const asyncHandler = require("express-async-handler");
// const User = require("../Model/authModel");
const { Event, Ticket, TicketType } = require("../Model/eventModel");
const { User, ProfilePicture } = require("../Model/authModel");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const mongoose = require("mongoose");
const {
  sendCreateEventMail,
  sendCreateTicketMail,
  sendDeleteEventMail,
  sendCancelEventMail,
  sendReactivateEventMail,
} = require("../Utils/sendEventEmail");
const clientUrl = process.env.FRONTEND_URL;
const DEFAULT_EVENT_IMAGE_URL = process.env.DEFAULT_EVENT_IMAGE_URL;
const cloudinary = require("cloudinary").v2;

const createEvent = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      eventType,
      meetLink,
      limit,
      categories,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !categories ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate eventType
    if (!["physical", "virtual"].includes(eventType)) {
      return res.status(400).json({
        message: "Invalid eventType. Choose either 'physical' or 'virtual'.",
      });
    }

    // Validate constraints for virtual and physical
    if (eventType === "virtual") {
      if (!meetLink || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(meetLink)) {
        return res
          .status(400)
          .json({ message: "A valid URL is required for virtual events." });
      }
    } else if (eventType === "physical") {
      if (!location || !Array.isArray(location) || location.length !== 5) {
        return res.status(400).json({
          message:
            "Location must contain [address, country, state, city, venue name] for physical events.",
        });
      }
    }

    // // Validate date and time
    const now = new Date();
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (start < now) {
      return res
        .status(400)
        .json({ message: "Start time cannot be in the past." });
    }

    if (end <= start) {
      return res
        .status(400)
        .json({ message: "End time must be after start time." });
    }

    // Create event
    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      categories,
      location: eventType === "physical" ? location : [],
      organizer: req.user ? req.user._id : null,
      meetLink: eventType === "virtual" ? meetLink : null,
      limit,
      eventType,
    });

    await newEvent.save();

    // console.log()

    // Send event creation email
    if (req.user) {
      const { name, email } = req.user;
      await sendCreateEventMail({ name, email, title });
    }

    return res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    return res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
});

const createTicket = asyncHandler(async (req, res) => {
  try {
    const { type, price, quantity, description } = req.body;
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    if (!type || price == null || quantity == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate quantity
    const ticketQuantity = Number(quantity);
    if (isNaN(ticketQuantity) || ticketQuantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a valid number greater than 0" });
    }

    // Validate price
    const ticketPrice = Number(price);
    if (isNaN(ticketPrice) || ticketPrice < 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid non-negative number" });
    }

    // Get the event
    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const event = await Event.findById(eventObjectId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check guest limit
    if (!event.limit || event.limit <= 0) {
      return res
        .status(400)
        .json({ message: "Guest limit is not set for this event" });
    }

    // Check if the event has already started
    const eventStartDateTime = new Date(
      `${event.startDate}T${event.startTime}`
    );
    const currentDateTime = new Date();
    if (currentDateTime >= eventStartDateTime) {
      return res
        .status(400)
        .json({ message: "Ticket sales closed. Event has already started." });
    }

    // Aggregate existing ticket quantities
    const totalTickets = await TicketType.aggregate([
      { $match: { eventId: eventObjectId } },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);

    const existingTickets =
      totalTickets.length > 0 ? Number(totalTickets[0].totalQuantity) : 0;

    const newTotal = existingTickets + ticketQuantity;

    if (newTotal > event.limit) {
      return res.status(400).json({
        message: `Cannot create tickets. Guest limit exceeded. Current: ${existingTickets}, New Total: ${newTotal}, Limit: ${event.limit}`,
      });
    }

    const ticketStatus = newTotal === event.limit ? "sold_out" : "available";

    const ticketType = new TicketType({
      eventId: eventObjectId,
      type,
      price: ticketPrice,
      quantity: ticketQuantity,
      description,
      status: ticketStatus,
    });

    await ticketType.save();

    // ✅ Link ticketType to event if your Event schema stores ticketTypes
    event.ticketTypes = event.ticketTypes || [];
    event.ticketTypes.push(ticketType._id);
    await event.save();

    if (req.user) {
      const { name, email } = req.user;
      await sendCreateTicketMail({
        name,
        email,
        title: event.title, // ✅ properly pass event title
      });
    }

    res.status(201).json({
      message: `Ticket created successfully for this event. Status: ${ticketStatus}`,
      ticketType,
    });
  } catch (error) {
    console.error("❌ Error creating ticket for event:", error);
    res.status(500).json({
      message: "Error adding ticket type",
      error: error.message,
    });
  }
});

// Purchase a ticket
const purchaseTicket = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start transaction

  try {
    const { eventId, ticketTypeId } = req.body;
    const userId = req.userId; // Get the logged-in user's ID

    // Validate user
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has a ticket for this event
    const existingTicket = await Ticket.findOne({ userId, eventId }).session(
      session
    );
    if (existingTicket) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "You have already purchased a ticket for this event",
      });
    }

    // Validate ticket type and update quantity atomically
    const ticketType = await TicketType.findOneAndUpdate(
      { _id: ticketTypeId, eventId, quantity: { $gt: 0 } }, // Ensure ticket is available
      { $inc: { quantity: -1 } }, // Decrease quantity by 1
      { new: true, session } // Return updated document and use session
    );

    if (!ticketType) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Tickets sold out or invalid ticket type" });
    }

    // Create the ticket and assign to the user
    const ticket = new Ticket({
      userId,
      eventId,
      ticketTypeId,
      qrCode: `${userId}-${eventId}-${ticketTypeId}-${Date.now()}`,
    });

    await ticket.save({ session });

    // Add the ticket ID to the user's ticket array
    // Add the ticket ID to the user's ticket array
    user.ticket.push(ticket._id);
    // event.attendees.push(userId);
    // await event.save();
    await user.save({ session });

    // Add the user as an attendee of the event
    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: userId } }, // Use $addToSet to avoid duplicates
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Ticket purchased successfully",
      ticket,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Error purchasing ticket", error: error.message });
  }
});

// const getTicket = asyncHandler(async (req, res) => {
//   try {
//     const { ticketId } = req.params;

//     console.log('Ticket Id:', ticketId)

//     // Validate ticket ID
//     if (!ticketId) {
//       return res.status(400).json({ message: "Ticket ID is required" });
//     }

//     // Find ticket and populate related fields
//     const ticket = await Ticket.findById(ticketId)
//     .populate("userId", "name email photo") // Populate user details (name, email)
//     .populate(
//       "eventId",
//       "title description eventType meetLink category location startDate startTime endDate endTime"
//     )
//     .populate("ticketTypeId", "type price quantity description"); // Populate ticket type details

//     if (!ticket) {
//       return res.status(404).json({ message: "Ticket not found" });
//     }

//     return res.status(200).json(ticket);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error fetching ticket", error: error.message });
//   }
// });

const getTicket = asyncHandler(async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return res.status(400).json({ message: "Ticket ID is required" });
    }

    console.log(ticketId);

    const ticket = await Ticket.findById(ticketId)
      .populate({
        path: "userId",
        select: "name email photo",
        populate: {
          path: "photo", // Only if 'photo' is a reference field
          select: "imageUrl cloudinaryId",
        },
      })
      .populate(
        "eventId",
        "title description eventType meetLink category location startDate startTime"
      )
      .populate("ticketTypeId", "type price");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("❌ Error fetching ticket:", error);
    res
      .status(500)
      .json({ message: "Error fetching ticket", error: error.message });
  }
});

const getAllTickets = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  console.log("🔍 Received Event ID (from request params):", eventId);

  try {
    // Convert eventId to ObjectId if necessary
    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    console.log("🔍 Converted Event ID to ObjectId:", eventObjectId);

    // Check if the event exists
    const eventExists = await Event.findById(eventObjectId);
    console.log("🔍 Event Exists:", eventExists ? "Yes" : "No");

    if (!eventExists) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get only the tickets for this event
    const allTickets = await Ticket.find({ eventId: eventObjectId })
      .populate({
        path: "userId",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      })
      .populate(
        "eventId",
        "title description eventType meetLink category location startDate startTime endDate endTime"
      )
      .populate("ticketTypeId", "type price description");

    console.log("🎟️ Total Tickets for this Event:", allTickets.length);

    if (allTickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this event" });
    }

    return res.status(200).json(allTickets);
  } catch (error) {
    console.error("❌ Error Fetching Tickets:", error);
    return res.status(400).json({ message: error.message });
  }
});

const uploadEventImage = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update event image" });
    }

    // Delete old Cloudinary image if it exists
    if (event.image && event.image.cloudinaryId) {
      await cloudinary.uploader.destroy(event.image.cloudinaryId);
    }

    // Upload Image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "event_images", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Ensure Multer is using memory storage
      stream.end(req.file.buffer);
    });

    // Update event image details
    event.image = {
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    };

    await event.save();

    return res.status(201).json({
      message: "Event image uploaded successfully",
      image: event.image,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateEventImage = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let event = await User.findById(eventId).populate("photo");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If user already has a Cloudinary image, delete the old one
    if (event.image && event.image.cloudinaryId) {
      await cloudinary.uploader.destroy(event.image.cloudinaryId);
    }

    // Upload new image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream({ folder: "profile_pictures" }, async (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        // Update user's profile picture details
        event.image.imageUrl = result.secure_url;
        event.image.cloudinaryId = result.public_id;
        await event.image.save();

        return res.status(200).json({
          message: "Profile picture updated",
          profilePicture: event.image,
        });
      })
      .end(req.file.buffer); // Pass buffer from multer's memory storage
  } catch (error) {
    console.error("Profile Picture Update Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteEventImage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await User.findById(eventId).populate("photo");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If event has a Cloudinary image, delete it
    if (event.image && event.image.cloudinaryId) {
      await cloudinary.uploader.destroy(event.image.cloudinaryId);
    }

    // Reset to default profile picture
    event.image.imageUrl = DEFAULT_EVENT_IMAGE_URL;
    event.image.cloudinaryId = null;
    await event.image.save();

    return res.status(200).json({
      message: "Profile picture deleted, reverted to default",
      image: event.image,
    });
  } catch (error) {
    console.error("Delete Profile Picture Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllLikedEvents = asyncHandler(async (req, res) => {
  const userId = req.userId;
  try {
    // Find all events where liked is true
    const likedEvents = await Event.find({ organizer: userId, liked: true })
      .populate({
        path: "organizer",
        select: "name email photo",
        populate: {
          path: "photo", // Populate the ProfilePicture model
          select: "imageUrl", // Select only imageUrl from ProfilePicture
          model: "ProfilePicture", // ✅ Ensure it references the correct model
        },
      })
      .populate({ path: "ticketType", select: "type, quantity" })
      .sort("-createdAt");

    // Check if there are any liked events
    if (!likedEvents) {
      return res.status(404).json({ message: "No liked events found" });
    }

    return res.status(200).json(likedEvents);
  } catch (error) {
    console.error("Error fetching liked events:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const likeStatus = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params; // Extract event ID from URL

    // Find the specific event by ID
    let event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if event is liked
    if (event.liked === true) {
      return res.json({ message: "Event is liked", event });
    } else {
      return res.json({ message: "Event is not liked", event });
    }
  } catch (error) {
    console.error("Error in likeStatus:", error);
    return res.status(500).json({ error: "Server Error" });
  }
});

const likeEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the event is in the past
    const now = new Date();
    const eventStartDateTime = new Date(
      `${event.startDate}T${event.startTime}`
    );

    if (eventStartDateTime < now) {
      return res.status(400).json({ message: "Cannot like a past event" });
    }

    // Check if the user has already liked the event
    if (event?.likedUsers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this event" });
    }

    // Add the user to the likedUsers array
    event?.likedUsers.push(userId);
    event.liked = true;

    // Save the event
    await event.save();

    return res.status(200).json({ message: "Event liked successfully", event });
  } catch (error) {
    console.error("Error liking event:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const unlikeEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the event is in the past
    const now = new Date();
    const eventStartDateTime = new Date(
      `${event.startDate}T${event.startTime}`
    );

    if (eventStartDateTime < now) {
      return res.status(400).json({ message: "Cannot unlike a past event" });
    }

    // Check if the user has already unliked the event
    if (!event.likedUsers.includes(userId)) {
      return res.status(400).json({ message: "You have not liked this event" });
    }

    // Remove the user from the likedUsers array
    event.likedUsers = event.likedUsers.filter((id) => id !== userId);
    event.liked = event.likedUsers.length > 0; // If there are no liked users, set liked to false

    // Save the event
    await event.save();

    return res
      .status(200)
      .json({ message: "Event unliked successfully", event });
  } catch (error) {
    console.error("Error unliking event:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all events
const getEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Event.find()
      .sort("-createdAt")
      .populate({
        path: "organizer",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      })
      .populate("ticket", "type")
      .populate({
        path: "attendees",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      });
    if (!events) {
      return res.status(404).json({ message: "No events found" });
    }
    return res.status(200).json(events);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

// Get all events
const getUserEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.userId })
      .sort("-createdAt")
      .populate({
        path: "organizer",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      })
      .populate({
        path: "ticket",
        select: "ticketTypeId userId eventId qrCode purchaseDate status",
        populate: {
          path: "photo image",
          select: "imageUrl cloudinaryId",
        },
      })
      .populate({
        path: "ticketType",
        select: "eventId type description price quantity",
      })
      .populate("ticket", "type")
      .populate({
        path: "attendees",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      });

    if (!events) {
      return res.status(404).json({ message: "No events found" });
    }

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    return res.status(400).json({ message: error.message });
  }
});

const upcomingEvents = async (req, res) => {
  try {
    const now = new Date();

    const events = await Event.find()
      .populate({
        path: "organizer",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "cloudinaryId imageUrl", // Select only necessary fields
        },
      })
      .populate({
        path: "ticket", // Populate ticket references
        populate: [
          {
            path: "eventId",
            select:
              "title description eventType meetLink category location startDate startTime endDate endTime",
          },
          { path: "ticketTypeId", select: "type price description" },
        ],
      })
      .sort({ startDate: 1 }) // Ascending order (earliest first)
      .exec();

    const upcomingEvents = events.filter((event) => {
      try {
        // Check if startDate and startTime exist
        if (!event.startDate || !event.startTime) return false;

        // Convert to ISO date string (just the date part)
        const datePart = new Date(event.startDate).toISOString().split("T")[0]; // YYYY-MM-DD

        // Normalize time format
        let timePart = event.startTime.trim();
        if (/^\d{2}:\d{2}$/.test(timePart)) {
          timePart += ":00";
        }

        // Combine and create full datetime string in local time
        const combined = `${datePart}T${timePart}`;

        const eventDateTime = new Date(combined);

        if (isNaN(eventDateTime.getTime())) {
          throw new Error(`Invalid date-time: ${combined}`);
        }

        return eventDateTime > new Date();
      } catch (err) {
        console.error(
          "Error parsing datetime for event:",
          event?._id,
          err.message
        );
        return false;
      }
    });

    return res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const userUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();

    // Get all events by the organizer
    const allEvents = await Event.find({
      organizer: req.userId,
    })
      .populate({
        path: "organizer",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "cloudinaryId imageUrl",
        },
      })
      .populate("ticket")
      .exec();

    // Filter based on full datetime (startDate + startTime)
    const upcomingEvents = allEvents.filter((event) => {
      const fullStart = new Date(
        `${event.startDate.toISOString().split("T")[0]}T${event.startTime}`
      );
      return fullStart > now;
    });

    // Sort by date
    upcomingEvents.sort((a, b) => {
      const aStart = new Date(
        `${a.startDate.toISOString().split("T")[0]}T${a.startTime}`
      );
      const bStart = new Date(
        `${b.startDate.toISOString().split("T")[0]}T${b.startTime}`
      );
      return aStart - bStart;
    });

    return res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAttendeesForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Assuming you have a Ticket model where attendees are stored.
    const event = await Event.find({ eventId })
      .populate({
        path: "attendee", // Assuming 'attendee' field exists in Ticket schema
        select: "name email photo", // Selecting only necessary fields
        populate: {
          path: "photo", // Populating the user's profile picture
          select: "imageUrl cloudinaryId", // Select only necessary fields from the photo model
        },
      })
      .exec();

    if (!event) {
      return res.status(404).json({ message: "No attendees found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return res.status(500).json({ message: "Failed to fetch attendees" });
  }
};

// Get single event
const getEvent = asyncHandler(async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({
        path: "organizer",
        select: "name email photo userId",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      })
      .populate({
        path: "likedUsers",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      })
      .populate({
        path: "attendees",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      });

    if (event) {
      return res.json(event);
    } else {
      return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.userId })
    .populate({
      path: "eventId",
      select: "title startDate startTime endDate endTime location image organizer eventType meetLink limit",
      populate: {
        path: "organizer",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      },
    })
      .populate("ticketTypeId", "type price quantity");

    res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  const {
    title,
    liked,
    description,
    categories,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    photo,
    eventType,
    meetLink,
    limit,
  } = req.body;

  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const now = new Date(); // Current date & time
    const eventStartDateTime = new Date(
      `${event.startDate}T${event.startTime}`
    );

    // Prevent updates if the event has already started
    if (eventStartDateTime <= now) {
      return res
        .status(400)
        .json({ message: "Event has already started and cannot be updated." });
    }

    // Validate date & time inputs
    if (startDate && new Date(startDate) < now) {
      return res
        .status(400)
        .json({ message: "Start date cannot be in the past." });
    }
    if (endDate && new Date(endDate) < now) {
      return res
        .status(400)
        .json({ message: "End date cannot be in the past." });
    }
    if (startDate && startTime && new Date(`${startDate}T${startTime}`) < now) {
      return res
        .status(400)
        .json({ message: "Start time cannot be in the past." });
    }
    if (endDate && endTime && new Date(`${endDate}T${endTime}`) < now) {
      return res
        .status(400)
        .json({ message: "End time cannot be in the past." });
    }

    // Validate eventType
    if (eventType && !["physical", "virtual"].includes(eventType)) {
      return res.status(400).json({
        message: "Invalid eventType. Choose 'physical' or 'virtual'.",
      });
    }

    // Ensure either location or meetLink is updated correctly
    if (eventType === "physical") {
      if (!location || !Array.isArray(location) || location.length !== 4) {
        return res.status(400).json({
          message:
            "Location must contain [address, country, city, venue name] for physical events.",
        });
      }
      event.meetLink = null; // Remove meetLink if changing to physical
    } else if (eventType === "virtual") {
      if (!meetLink || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(meetLink)) {
        return res
          .status(400)
          .json({ message: "A valid URL is required for virtual events." });
      }
      event.location = null; // Remove location if changing to virtual
    }

    // Update event fields
    event.title = title ?? event.title;
    event.liked = liked !== undefined ? liked : event.liked; // Handle false values correctly
    event.description = description ?? event.description;
    event.startDate = startDate ?? event.startDate;
    event.endDate = endDate ?? event.endDate;
    event.categories = categories ?? event.categories;
    event.startTime = startTime ?? event.startTime;
    event.endTime = endTime ?? event.endTime;
    event.location = location ?? event.location;
    event.photo = photo ?? event.photo;
    event.eventType = eventType ?? event.eventType;
    event.meetLink = meetLink ?? event.meetLink;
    event.limit = limit ?? event.limit;

    const updatedEvent = await event.save();
    return res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const cancelEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this event" });
    }

    const now = new Date();
    const eventStartDateTime = new Date(
      `${event.startDate}T${event.startTime}`
    );

    if (eventStartDateTime < now) {
      return res.status(400).json({ message: "Cannot cancel past event" });
    }

    if (event.canceled) {
      return res.status(400).json({ message: "Event is already canceled" });
    }

    event.canceled = true;
    await event.save();

    const user = await User.findById(userId); // Only if name/email not in token
    await sendCancelEventMail({
      name: user.name,
      email: user.email,
      title: event.title,
    });

    return res.status(200).json({
      message: "Event canceled successfully",
      event,
    });
  } catch (error) {
    console.error("Cancel event error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const unCancelEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to resume this event" });
    }

    // Prevent un-cancelling past events
    const now = new Date();
    const eventStartDateTime = new Date(
      `${event.startDate}T${event.startTime}`
    );

    if (eventStartDateTime < now) {
      return res.status(400).json({ message: "Cannot resume a past event" });
    }

    if (!event.canceled) {
      return res.status(400).json({ message: "Event is not canceled" });
    }

    event.canceled = false;
    const updatedEvent = await event.save();

    // Optionally: Send a confirmation email (if needed)
    const user = await User.findById(userId); // Ensure we have updated user info if needed
    await sendReactivateEventMail({
      name: user.name,
      email: user.email,
      title: updatedEvent.title,
    });

    return res.status(200).json({
      message: "Event resumed successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Un-cancel event error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const getUserCancelledEvents = asyncHandler(async (req, res) => {
  const userId = req.userId;

  try {
    const cancelledEvents = await Event.find({
      organizer: userId,
      canceled: true,
    });

    return res.status(200).json(cancelledEvents);
  } catch (error) {
    console.error("Failed to get cancelled events:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete an event
const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;

  try {
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this event" });
    }

    const now = new Date();
    const eventStartDateTime = new Date(
      `${event.startDate}T${event.startTime}`
    );

    if (eventStartDateTime < now) {
      return res.status(400).json({ message: "Cannot delete past event" });
    }

    // 🧹 Delete Cloudinary image if exists
    if (event.image && event.image.cloudinaryId) {
      await cloudinary.uploader.destroy(event.image.cloudinaryId);
    }

    // 🧹 Delete associated TicketTypes
    await TicketType.deleteMany({ eventId });

    // 🧹 Delete associated Tickets
    await Ticket.deleteMany({ eventId });

    // 🧹 Delete the event itself
    await event.deleteOne();

    // ✉️ Send confirmation email
    await sendDeleteEventMail({
      name: user.name,
      email: user.email,
      title: event.title,
    });

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch past events
const pastEvents = async (req, res) => {
  try {
    const now = new Date();

    const events = await Event.find()
      .populate({
        path: "organizer",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "cloudinaryId imageUrl",
        },
      })
      .populate("ticket", "type")
      .sort("-createdAt") // ✅ Moved before .exec()
      .exec();

    const pastEvents = events.filter((event) => {
      const eventDate = new Date(event.startDate).toISOString().split("T")[0]; // Get YYYY-MM-DD
      const combinedDateTime = new Date(`${eventDate}T${event.startTime}`);
      return combinedDateTime < now;
    });

    return res.status(200).json(pastEvents);
  } catch (error) {
    console.error("Error fetching past events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserPastEvents = async (req, res) => {
  try {
    const now = new Date();
    // Ensure you are using the correct date field (e.g., startDate or endDate)
    const events = await Event.find({
      organizer: req.userId,
    })
      .populate({
        path: "organizer",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "cloudinaryId imageUrl",
        },
      })
      .populate("ticket", "type")
      .sort("-createdAt") // ✅ Moved before .exec()
      .exec();

    const pastEvents = events.filter((event) => {
      const eventDate = new Date(event.startDate).toISOString().split("T")[0]; // Get YYYY-MM-DD
      const combinedDateTime = new Date(`${eventDate}T${event.startTime}`);
      return combinedDateTime < now;
    });

    return res.status(200).json(pastEvents);
  } catch (error) {
    console.error("Error fetching past events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch trending events
const trendingEvents = async (req, res) => {
  try {
    console.log("Fetching trending events...");
    const trendingEvents = await Event.find({ trending: true }).exec();
    console.log("Trending events found:", trendingEvents);
    return res.status(200).json(trendingEvents);
  } catch (error) {
    console.error("Error fetching trending events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getEventWithTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id).populate("ticket");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const buyTicket = async (req, res) => {
  const { eventId } = req.params;
  const { quantity, paymentOption } = req.body;
  const userId = req.user._id;

  try {
    // Find the event by ID and populate ticket details
    const event = await Event.findById(eventId).populate("tickets");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the ticket associated with the event
    const ticket = await Ticket.findById(event.tickets);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if enough tickets are available
    if (ticket.quantity < quantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // Decrease the ticket quantity
    ticket.quantity -= quantity;
    ticket.sold += quantity;
    await ticket.save();

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bookedEvents.push(eventId);
    await user.save();

    event.attendees.push(userId);
    await event.save();

    if (paymentOption === "stripe") {
      try {
        const line_items = [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: event.title,
              },
              unit_amount: Math.round(course.price * 100),
            },
            quantity,
          },
        ];

        let stripeCustomer = await StripeCustomer.findOne({ userId });
        if (!stripeCustomer) {
          const customer = await stripe.customers.create({
            email: user.emailAddress,
          });
          stripeCustomer = await StripeCustomer.create({
            userId,
            stripeCustomerId: customer.id,
          });
        }

        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomer.stripeCustomerId,
          line_items,
          mode: "payment",
          success_url: `${clientUrl}/success`,
          cancel_url: `${clientUrl}/cancel`,
          metadata: {
            courseId,
            userId: userId.toString(),
          },
        });

        return res.json({ url: session.url });
      } catch (error) {
        console.error("[PURCHASE_COURSE]", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.emailAddress,
      subject: "Ticket Purchase Confirmation",
      text: `As salam 'alaekum Dear ${user.firstName} 🤗,
    
      Thank you for purchasing ${quantity} ticket(s) for the event "${
        event.title
      }".
    
      Event Details:
      ---------------
      Title: ${event.title}
      Description: \t${event.subTitle}
      Date: ${new Date(event.date).toLocaleString()}
      Location: ${event.location}
    
      Your Ticket Information:
      -------------------------
      Quantity: ${quantity}
    
      We appreciate your support and look forward to seeing you at the event.
    
      Thank you,
      The Ticketeer Event Team
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(200)
        .json({ message: "Ticket purchased and email sent" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOrganizerById = async (req, res) => {
  try {
    const organizer = await User.findById(req.params.id);
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }
    return res.status(200).json(organizer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTicketsSold = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get the number of sold tickets from the event's ticket schema
    const ticketsSold = event.tickets.sold;

    return res.status(200).json({ ticketsSold });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // validateCreateEvent,
  createEvent,
  getMyTickets,
  likeStatus,
  getAllLikedEvents,
  unlikeEvent,
  likeEvent,
  getTicket,
  getEvents,
  getUserEvents,
  cancelEvent,
  userUpcomingEvents,
  createTicket,
  purchaseTicket,
  uploadEventImage,
  updateEventImage,
  getAttendeesForEvent,
  deleteEventImage,
  getEvent,
  updateEvent,
  deleteEvent,
  upcomingEvents,
  pastEvents,
  trendingEvents,
  buyTicket,
  getUserCancelledEvents,
  unCancelEvent,
  getAllTickets,
  getOrganizerById,
  getTicketsSold,
  getEventWithTicketById,
  getUserPastEvents,
};
