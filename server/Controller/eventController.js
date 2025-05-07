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
      _id,
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
      _id,
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
      likedUsers: [],
    });

    await newEvent.save();

    // console.log()

    // Send event creation email
    if (req.user) {
      const { name, email } = req.user;
      await sendCreateEventMail({
        name,
        email,
        title: newEvent.title,
        startDate: newEvent.startDate,
        startTime: newEvent.startTime,
        eventType: newEvent.eventType,
        meetLink: newEvent.eventType === "virtual" ? newEvent.meetLink : null,
        location:
          newEvent.eventType === "physical"
            ? {
                address: newEvent.location[0],
                country: newEvent.location[1],
                state: newEvent.location[2],
                city: newEvent.location[3],
                venue: newEvent.location[4],
              }
            : null,
        eventId: newEvent._id,
        createdAt: newEvent.createdAt,
      });
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

const checkAndUpdateTicketStatus = async (ticketType) => {
  const event = await Event.findById(ticketType.eventId);
  if (!event || !event.startDate || !event.startTime) return;

  const now = new Date();
  const datePart = new Date(event.startDate).toISOString().split("T")[0];
  const eventStartDateTime = new Date(`${datePart}T${event.startTime}`);

  if (now >= eventStartDateTime && ticketType.status !== "closed") {
    ticketType.status = "closed";
    await ticketType.save();
  }
};

const createTicket = asyncHandler(async (req, res) => {
  try {
    const { type, price, totalQuantity, description } = req.body;
    const { eventId } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    if (!type || !price || !totalQuantity) {
      return res.status(400).json({ message: "Required fields are missing!" });
    }

    const ticketQuantity = Number(totalQuantity);
    if (!Number.isInteger(ticketQuantity) || ticketQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be a valid integer greater than 0",
      });
    }

    const ticketPrice = Number(price);
    if (isNaN(ticketPrice) || ticketPrice < 0) {
      return res.status(400).json({
        message: "Price must be a valid non-negative number",
      });
    }

    if (description && description.length > 300) {
      return res.status(400).json({
        message: "Description must not exceed 300 characters",
      });
    }

    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const event = await Event.findById(eventObjectId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ Only the organizer of the event can create ticket types
    if (!user || user._id.toString() !== event.organizer.toString()) {
      return res.status(403).json({
        message: "You are not authorized to create tickets for this event.",
      });
    }

    if (!event.limit || event.limit <= 0) {
      return res.status(400).json({
        message: "Guest limit is not set for this event",
      });
    }

    const currentDateTime = new Date();
    const datePart = new Date(event.startDate).toISOString().split("T")[0];
    const eventStartDateTime = new Date(`${datePart}T${event.startTime}`);

    if (currentDateTime >= eventStartDateTime) {
      return res.status(400).json({
        message: "Ticket sales closed. Event has already started.",
      });
    }

    // 🔒 Enforce only ONE ticket type per event
    const existingTicketType = await TicketType.findOne({
      eventId: eventObjectId,
    });

    if (existingTicketType) {
      return res.status(400).json({
        message: "Only one ticket type can be created per event.",
      });
    }

    // 🧮 Aggregate total tickets for this event
    const totalTickets = await TicketType.aggregate([
      { $match: { eventId: eventObjectId } },
      { $group: { _id: null, totalQuantity: { $sum: "$totalQuantity" } } },
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

    // ✅ Now create the ticketType
    const ticketType = new TicketType({
      eventId: eventObjectId,
      type: type.trim(),
      price: ticketPrice,
      totalQuantity: ticketQuantity,
      availableQuantity: ticketQuantity,
      soldQuantity: 0,
      description,
      status: ticketStatus,
    });

    await ticketType.save();

    // ✅ Check and update status
    await checkAndUpdateTicketStatus(ticketType);

    // 🔄 Link to event
    event.ticketTypes = event.ticketTypes || [];
    event.ticketTypes.push(ticketType._id);

    // 🛑 Mark event as sold out if needed
    if (newTotal === event.limit) {
      event.status = "sold_out";
    }

    await event.save();

    // 📧 Email Notification
    if (req.user) {
      const { name, email } = req.user;

      const mailData = {
        name,
        email,
        title: event.title,
        type: ticketType.type,
        price: ticketType.price,
        totalQuantity: ticketType.totalQuantity,
        ticketTypeId: ticketType._id,
        createdAt: ticketType.createdAt,
        eventId: event._id,
      };

      await sendCreateTicketMail(mailData);
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

const purchaseTicketLogic = async ({
  eventId,
  ticketTypeId,
  userId,
  reqUser,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!eventId || !ticketTypeId || !userId) {
      throw new Error("Missing required fields");
    }

    if (
      !mongoose.Types.ObjectId.isValid(eventId) ||
      !mongoose.Types.ObjectId.isValid(ticketTypeId)
    ) {
      throw new Error("Invalid Event ID or Ticket Type ID");
    }

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    const event = await Event.findById(eventId).session(session);
    if (!event) throw new Error("Event not found");

    const now = new Date();
    const datePart = new Date(event.startDate).toISOString().split("T")[0];
    const eventStartDateTime = new Date(`${datePart}T${event.startTime}`);
    if (now >= eventStartDateTime) {
      throw new Error("Event has already started. Ticket sales closed.");
    }

    const existingTicket = await Ticket.findOne({
      userId,
      eventId,
      ticketTypeId,
    }).session(session);
    if (existingTicket) {
      throw new Error("You already purchased a ticket for this event");
    }

    const ticketType = await TicketType.findOne({
      _id: ticketTypeId,
      eventId,
    }).session(session);
    if (!ticketType) throw new Error("Ticket type not found");

    if (
      ticketType.availableQuantity <= 0 ||
      ticketType.status === "sold_out" ||
      ticketType.status === "closed"
    ) {
      throw new Error("Ticket is not available");
    }

    // Update ticket type availability
    ticketType.availableQuantity -= 1;
    ticketType.soldQuantity = (ticketType.soldQuantity || 0) + 1;
    if (ticketType.availableQuantity === 0) {
      ticketType.status = "sold_out";
    }
    await ticketType.save({ session });

    // Step 1: Create ticket (initially without QR)
    const ticket = new Ticket({
      userId,
      eventId,
      ticketTypeId,
      status: "active",
      purchaseDate: new Date(),
    });

    // Step 2: Prepare payload for QR code
    const qrPayload = JSON.stringify({
      ticketId: ticket._id.toString(),
      userId,
      eventId,
    });

    // Step 3: Generate QR code image (base64 string)
    const qrCodeDataURL = await QRCode.toDataURL(qrPayload);

    // Step 4: Attach to ticket and save
    ticket.qrCode = qrCodeDataURL;
    await ticket.save({ session });

    // Attach ticket to user
    user.ticket = user.ticket || [];
    user.ticket.push(ticket._id);
    await user.save({ session });

    // Add user to event attendees
    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: userId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Optional email notification
    if (reqUser?.name && reqUser?.email) {
      const mailData = {
        name: reqUser.name,
        email: reqUser.email,
        title: event.title,
        startDate: event.startDate,
        startTime: event.startTime,
        eventType: event.eventType,
        status: ticket.status,
        purchaseDate: ticket.purchaseDate,
        ticketTypeId: ticketType._id,
        ...(event.eventType === "physical"
          ? { location: event.location }
          : { meetLink: event.meetLink }),
      };

      await sendCreateTicketMail(mailData);
      console.log("Ticket Purchase Email sent successfully");
    }

    return { success: true, message: "Ticket purchased successfully", ticket };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const purchaseTicket = asyncHandler(async (req, res) => {
  try {
    const { eventId, ticketTypeId } = req.body;
    const userId = req.userId;

    const result = await purchaseTicketLogic({ eventId, ticketTypeId, userId });
    console.log("Result after purhasing ticket: ", result);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Ticket purchase failed:", error.message);
    return res.status(500).json({ message: error.message });
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
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!ticketId) {
      return res.status(400).json({ message: "Ticket ID is required" });
    }

    console.log(ticketId);

    const ticket = await Ticket.findById(userId, ticketId)
      .populate({
        path: "userId",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      })
      .populate({
        path: "eventId",
        select:
          "title startDate startTime endDate endTime location image organizer eventType meetLink limit",
        populate: {
          path: "organizer",
          select: "name email photo",
          populate: {
            path: "photo",
            select: "imageUrl cloudinaryId",
          },
        },
      })
      .populate(
        "ticketTypeId",
        "type price description availableQuantity totalQuantity ticketQuantity"
      );

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

    const updatedEvent = await Event.findById(event._id);

    return res.status(201).json(updatedEvent);
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
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const now = new Date();
    const eventStartDateTime = new Date(
      `${event.startDate}T${event.startTime}`
    );
    if (eventStartDateTime < now) {
      return res
        .status(400)
        .json({ message: "Cannot like or unlike a past event" });
    }

    const alreadyLiked = event.likedUsers.includes(userId);

    if (alreadyLiked) {
      // Unlike: remove user from likedUsers
      event.likedUsers = event.likedUsers.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Like: add user to likedUsers
      event.likedUsers.push(userId);
    }

    await event.save();

    // Populate likedUsers with user info
    const updatedEvent = await Event.findById(eventId).populate({
      path: "likedUsers",
      select: "name email photo",
      populate: {
        path: "photo",
        select: "imageUrl cloudinaryId",
      },
    });

    return res.status(200).json({
      message: alreadyLiked
        ? "Event unliked successfully"
        : "Event liked successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
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
      })
      .populate({
        path: "likedUsers",
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
        path: "likedUsers",
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
          select: "cloudinaryId imageUrl",
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
        path: "ticket",
        populate: [
          {
            path: "eventId",
            select:
              "title description eventType meetLink category location startDate startTime endDate endTime",
          },
        ],
      })
      .populate("ticketTypes", "type price description quantity")
      .populate("tickets", "userId eventId qrCode purchaseDate ticketTypeId")
      .sort({ startDate: 1 })
      .exec();

    // Filter safely
    const upcomingEvents = events.filter((event) => {
      if (!event.startDate || !event.startTime) return false;

      const fullStart = new Date(
        `${event.startDate.toISOString().split("T")[0]}T${event.startTime}`
      );
      return fullStart > now;
    });

    // Sort safely
    upcomingEvents.sort((a, b) => {
      if (!a.startDate || !a.startTime || !b.startDate || !b.startTime)
        return 0;

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
      .populate({
        path: "likedUsers",
        select: "name email photo",
        populate: {
          path: "photo",
          select: "imageUrl cloudinaryId",
        },
      })
      .populate(
        "ticketTypes",
        "type price description totalQuantity soldQuantity availableQuantity"
      )
      .populate("tickets", "userId eventId qrCode purchaseDate ticketTypeId")
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
      })
      .populate({
        path: "ticket",
        select:
          "qrCode purchaseDate ticketTypeId availableQuantity ticketQuantity soldQuantity",
        populate: [
          {
            path: "eventId",
            select:
              "title description eventType meetLink category location startDate startTime endDate endTime",
          },
        ],
      })
      .populate(
        "ticketTypes",
        "type price description availableQuantity totalQuantity soldQuantity"
      )
      .populate(
        "tickets",
        "userId eventId qrCode purchaseDate ticketTypeId availableQuantity ticketQuantity soldQuantity"
      )
      .populate(
        "ticket",
        "userId eventId qrCode purchaseDate ticketTypeId availableQuantity ticketQuantity soldQuantity"
      );

    if (event) {
      return res.json(event);
    } else {
      return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// const getTicket = async (req, res) => {
//   try {
//     const ticket = await Ticket.find({ userId: req.userId, ticketId: req.params.ticketId })
//       .populate({
//         path: "eventId",
//         select:
//           "title startDate startTime endDate endTime location image organizer eventType meetLink limit",
//         populate: {
//           path: "organizer",
//           select: "name email photo",
//           populate: {
//             path: "photo",
//             select: "imageUrl cloudinaryId",
//           },
//         },
//       })
//       .populate(
//         "ticketTypeId",
//         "type price availableQuantity totalQuantity soldQuantity"
//       );

//     res.status(200).json(ticket);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.userId })
      .populate({
        path: "eventId",
        select:
          "title startDate startTime endDate endTime location image organizer eventType meetLink limit",
        populate: {
          path: "organizer",
          select: "name email photo",
          populate: {
            path: "photo",
            select: "imageUrl cloudinaryId",
          },
        },
      })
      .populate(
        "ticketTypeId",
        "type price availableQuantity totalQuantity soldQuantity"
      );

    res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateTicketType = async (req, res) => {
  const { type, totalQuantity, price, description, eventId } = req.body;
  const { ticketId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ticket = await TicketType.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
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

    // Update ticket fields if provided
    ticket.type = type ?? ticket.type;
    ticket.totalQuantity = totalQuantity ?? ticket.totalQuantity;
    ticket.price = price ?? ticket.price;
    ticket.description = description ?? ticket.description;

    const updatedTicket = await ticket.save();
    return res.status(200).json(updatedTicket);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

    // Ensure eventType is valid and update it
    if (eventType && !["physical", "virtual"].includes(eventType)) {
      return res.status(400).json({
        message: "Invalid eventType. Choose 'physical' or 'virtual'.",
      });
    }

    if (eventType) {
      event.eventType = eventType; // Update eventType if provided

      // If the event is virtual, clear location and ensure meetLink is valid
      if (eventType === "virtual") {
        event.location = []; // Clear location for virtual event
        if (!meetLink || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(meetLink)) {
          return res
            .status(400)
            .json({ message: "A valid URL is required for virtual events." });
        }
      } else {
        // If physical event, location is required
        if (!location || !Array.isArray(location) || location.length !== 5) {
          return res.status(400).json({
            message:
              "Location must contain [address, country, state, city, venue name] for physical events.",
          });
        }
        event.meetLink = null; // Remove meetLink if switching to physical
      }
    }

    // Update other fields
    event.title = title ?? event.title;
    event.liked = liked !== undefined ? liked : event.liked; // Handle false values correctly
    event.description = description ?? event.description;
    event.startDate = startDate ?? event.startDate;
    event.endDate = endDate ?? event.endDate;
    event.categories = categories ?? event.categories;
    event.startTime = startTime ?? event.startTime;
    event.endTime = endTime ?? event.endTime;
    event.location = location ?? event.location; // Update location after checking eventType
    event.photo = photo ?? event.photo;
    event.meetLink = meetLink ?? event.meetLink;
    event.limit = limit ?? event.limit;

    const updatedEvent = await event.save();
    return res.status(200).json(updatedEvent);
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

    if (!event.startDate || !event.startTime) {
      return res.status(400).json({ message: "Invalid event date/time" });
    }

    const now = new Date();
    const eventStart = new Date(
      `${event.startDate.toISOString().split("T")[0]}T${event.startTime}`
    );

    if (eventStart <= now) {
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
        .json({ message: "Not authorized to cancel this event" });
    }

    if (!event.startDate || !event.startTime) {
      return res.status(400).json({ message: "Invalid event date/time" });
    }

    const now = new Date();
    const eventStart = new Date(
      `${event.startDate.toISOString().split("T")[0]}T${event.startTime}`
    );

    if (eventStart <= now) {
      return res.status(400).json({ message: "Cannot resume past event" });
    }

    if (!event.canceled) {
      return res.status(400).json({ message: "Event is ongoing" });
    }

    event.canceled = false;
    await event.save();

    const user = await User.findById(userId); // Only if name/email not in token
    await sendReactivateEventMail({
      name: user.name,
      email: user.email,
      title: event.title,
    });

    return res.status(200).json({
      message: "Event resumed successfully",
      event,
    });
  } catch (error) {
    console.error("Resume event error:", error);
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
  updateTicketType,
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
  purchaseTicketLogic,
  getOrganizerById,
  getTicketsSold,
  getEventWithTicketById,
  getUserPastEvents,
};
