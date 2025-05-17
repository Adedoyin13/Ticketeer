const asyncHandler = require("express-async-handler");
const { Event, Ticket, TicketType } = require("../Model/eventModel");
const { User } = require("../Model/authModel");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const mongoose = require("mongoose");
const {
  sendCreateEventMail,
  sendCreateTicketMail,
  sendTicketPurchaseMail,
  sendDeleteEventMail,
  sendCancelEventMail,
  sendReactivateEventMail,
} = require("../Utils/sendEventEmail");
const clientUrl = process.env.FRONTEND_URL;
const Notification = require("../Model/notificationModel");
const emailQueue = require("../Utils/emailQueue");
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
      location = [],
      meetLink = "",
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

    // Validate location and meetLink logic: at least one must be valid
    const hasValidLocation = Array.isArray(location) && location.length === 5;
    const hasValidMeetLink =
      typeof meetLink === "string" &&
      meetLink.length > 0 &&
      /^https?:\/\/[^\s$.?#].[^\s]*$/.test(meetLink);

    if (!hasValidLocation && !hasValidMeetLink) {
      return res.status(400).json({
        message:
          "Please provide either a full location (5 elements) or a valid meet link URL.",
      });
    }

    // Validate date and time
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
      location: hasValidLocation ? location : [],
      meetLink: hasValidMeetLink ? meetLink : "",
      organizer: req.userId || null,
      limit,
      likedUsers: [],
    });

    await newEvent.save();

    const populatedEvent = newEvent;
    // const populatedEvent = await Event.findById(newEvent._id).populate('organizer');

    // Send event creation email if user exists
    if (req.user) {
      const { name, email } = req.user;
      await sendCreateEventMail({
        name,
        email,
        title: populatedEvent.title,
        startDate: populatedEvent.startDate,
        startTime: populatedEvent.startTime,
        // Send location if available, else send null
        location: hasValidLocation
          ? {
              address: populatedEvent.location[0],
              country: populatedEvent.location[1],
              state: populatedEvent.location[2],
              city: populatedEvent.location[3],
              venue: populatedEvent.location[4],
            }
          : null,
        // Send meetLink if available, else null
        meetLink: hasValidMeetLink ? populatedEvent.meetLink : null,
        eventId: populatedEvent._id,
        createdAt: populatedEvent.createdAt,
      });
    }

    await Notification.create({
      user: req.userId, // The recipient
      type: "event",
      message: `You created a new event: ${populatedEvent.title}`,
      metadata: { eventId: populatedEvent._id },
    });

    return res
      .status(201)
      .json({ message: "Event created successfully", event: populatedEvent });
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

    if (event?.ticketTypes.length >= 5) {
      return res
        .status(400)
        .json(message, "You can only add up to 5 ticket types per event.");
    }

    const currentDateTime = new Date();
    const datePart = new Date(event.startDate).toISOString().split("T")[0];
    const eventStartDateTime = new Date(`${datePart}T${event.startTime}`);

    if (currentDateTime >= eventStartDateTime) {
      return res.status(400).json({
        message: "Ticket sales closed. Event has already started.",
      });
    }

    // 🚫 Check if a ticket type with the same name already exists for this event
    const existingType = await TicketType.findOne({
      eventId: eventObjectId,
      type: type.trim(),
    });

    if (existingType) {
      return res.status(400).json({
        message: `A ticket type with the name "${type.trim()}" already exists for this event.`,
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
    // if (newTotal === event.limit) {
    //   event.status = "sold_out";
    // }

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

    // 🔔 Notification
    await Notification.create({
      user: userId,
      type: "ticket",
      message: `You created a new ticket: ${ticketType.type}`,
      metadata: { ticketTypeId: ticketType._id, eventId: event._id },
    });

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

const validateTicketSelection = async ({ eventId, selectedTickets }) => {
  if (
    !eventId ||
    !selectedTickets ||
    !Array.isArray(selectedTickets) ||
    selectedTickets.length === 0
  ) {
    throw new Error("Missing eventId or selectedTickets");
  }

  // Find the event
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  // Check if event has started
  const now = new Date();
  const eventDate = new Date(event.startDate).toISOString().split("T")[0];
  const eventStartDateTime = new Date(`${eventDate}T${event.startTime}`);
  if (now >= eventStartDateTime) {
    throw new Error("Event has already started");
  }

  let total = 0;
  const validTickets = [];

  // Loop through array of tickets
  for (const ticket of selectedTickets) {
    const { ticketTypeId, quantity } = ticket;

    if (!mongoose.Types.ObjectId.isValid(ticketTypeId)) {
      throw new Error("Invalid ticket type ID");
    }

    const ticketType = await TicketType.findOne({
      _id: ticketTypeId,
      eventId,
    });

    if (!ticketType) throw new Error(`Ticket type ${ticketTypeId} not found`);

    console.log("ticketType: ", ticketType);
    if (
      ticketType.availableQuantity < quantity
      // ticketType.status === "sold_out"
    ) {
      throw new Error(
        `Ticket type "${ticketType.type}" not available or not enough`
      );
    }

    const fee = ticketType.price * 0.02;
    total += (ticketType.price + fee) * quantity;

    validTickets.push({
      ticketTypeId,
      type: ticketType.type,
      price: ticketType.price,
      quantity,
    });
  }

  return {
    event,
    tickets: validTickets,
    amount: Math.round(total * 100), // for Paystack/Flutterwave (kobo/naira * 100)
  };
};

const purchaseTicketLogic = async ({ eventId, selectedTickets, userId }) => {
  const session = await mongoose.startSession();
  let event, user;

  // Store ticket type and ticket info for post-processing
  const ticketMetaList = [];

  try {
    session.startTransaction();

    if (!eventId || !selectedTickets || !userId) {
      throw new Error("Missing required fields");
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid Event ID");
    }

    // Fetch user and event
    user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    event = await Event.findById(eventId).session(session);
    if (!event) throw new Error("Event not found");

    const now = new Date();
    const datePart = new Date(event.startDate).toISOString().split("T")[0];
    const eventStartDateTime = new Date(`${datePart}T${event.startTime}`);
    if (now >= eventStartDateTime) {
      throw new Error("Event has already started. Ticket sales closed.");
    }

    const createdTickets = [];

    // Iterate over selectedTickets array (updated)
    for (const ticket of selectedTickets) {
      const { ticketTypeId, quantity } = ticket;

      if (!mongoose.Types.ObjectId.isValid(ticketTypeId)) {
        throw new Error(`Invalid Ticket Type ID: ${ticketTypeId}`);
      }

      const ticketType = await TicketType.findOne({
        _id: ticketTypeId,
        eventId,
      }).session(session);

      if (!ticketType) throw new Error("Ticket type not found");

      // Validate ticket type availability
      if (
        ticketType.availableQuantity < quantity
        // ticketType.status === "sold_out"
      ) {
        throw new Error(
          `Not enough available tickets for ${ticketType.type}. Requested: ${quantity}, Available: ${ticketType.availableQuantity}`
        );
      }

      // Update ticketType quantities
      ticketType.availableQuantity -= quantity;
      ticketType.soldQuantity = (ticketType.soldQuantity || 0) + quantity;
      if (ticketType.availableQuantity === 0) {
        ticketType.status = "sold_out";
      }

      await ticketType.save({ session });

      const ticketIdsForType = [];

      for (let i = 0; i < quantity; i++) {
        const ticketDoc = new Ticket({
          userId,
          eventId,
          ticketTypeId,
          purchaseDate: new Date(),
          quantity: 1, // individual ticket per document
        });

        const clientUrl = process.env.CLIENT_URL;
        const qrPayload = JSON.stringify({
          ticketId: ticketDoc._id.toString(),
          userId,
          eventId,
        });
        const qrCodeDataURL = await QRCode.toDataURL(qrPayload);

        ticketDoc.qrCode = qrCodeDataURL;
        await ticketDoc.save({ session });

        createdTickets.push(ticketDoc._id);
        ticketIdsForType.push(ticketDoc._id);
      }

      // Store info to send mail & notification later
      ticketMetaList.push({
        ticketType,
        ticketIds: ticketIdsForType,
        purchaseDate: new Date(),
      });
    }

    // Update user
    user.ticket = user.ticket || [];
    user.ticket.push(...createdTickets);
    await user.save({ session });

    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: userId } },
      { session }
    );

    await session.commitTransaction();

    // Post-transaction: send mail & notifications
    // Post-transaction operations: send mail & notification for each ticket type

    const responsePayload = ticketMetaList.map(
      ({ ticketType, ticketIds, purchaseDate }) => {
        return {
          ticketTypeId: ticketType._id,
          ticketTypeName: ticketType.type,
          quantity: ticketIds.length,
          purchaseDate,
          eventId: event._id,
          eventTitle: event.title,
          startDate: event.startDate,
          startTime: event.startTime,

          // Include location if present
          ...(event.location && event.location.length === 5
            ? { location: event.location }
            : {}),

          // Include meetLink if present and non-empty string
          ...(event.meetLink && event.meetLink.trim() !== ""
            ? { meetLink: event.meetLink }
            : {}),

          tickets: ticketIds.map((id) => {
            const t = createdTickets.find(
              (docId) => docId.toString() === id.toString()
            );
            return {
              ticketId: id,
              qrCode: t?.qrCode || null,
            };
          }),
        };
      }
    );

    console.log("responsePayload: ", responsePayload);

    for (const meta of ticketMetaList) {
      const { ticketType, ticketIds, purchaseDate } = meta;

      // Fetch the actual tickets to get QR codes
      const tickets = await Ticket.find({ _id: { $in: ticketIds } });

      // Prepare QR codes array or other ticket info
      const ticketsInfo = tickets.map((t) => ({
        id: t._id,
        qrCode: t.qrCode,
      }));

      const mailData = {
        name: user.name,
        email: user.email,
        title: event.title,
        startDate: event.startDate,
        startTime: event.startTime,
        status: "purchased",
        purchaseDate,
        ticketTypeId: ticketType._id,
        ticketTypeName: ticketType.type,
        quantity: ticketIds.length,
        tickets: ticketsInfo,

        // Include location if present
        ...(event.location && event.location.length === 5
          ? { location: event.location }
          : {}),

        // Include meetLink if present and non-empty string
        ...(event.meetLink && event.meetLink.trim() !== ""
          ? { meetLink: event.meetLink }
          : {}),
      };

      try {
        console.log(`Ticket Purchase Email sent for type: ${ticketType?.type}`);
        await sendTicketPurchaseMail(mailData);
        // await emailQueue.add(mailData, {
        //   attempts: 3,     // Retry 3 times on failure
        //   backoff: 5000,   // 5s delay between retries
        // });

        // Send one notification per ticket type with quantity info
        await Notification.create({
          user: userId,
          type: "ticket",
          message: `You purchased ${ticketIds.length} ${ticketType?.type} ticket(s) to ${event.title}`,
          metadata: { ticketTypeId: ticketType._id, eventId: event._id },
        });
        // console.log("Notification sent to: ", user._id);
        // console.log("Notification sent to: ", userId);
      } catch (postError) {
        console.error("Post-transaction operation failed:", postError);
      }
    }

    return { tickets: responsePayload };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

const attendeeCheckIn = asyncHandler(async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId)
      return res.status(400).json({ message: "Ticket ID is required" });

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    console.log({ ticket });

    // Optional: Check if ticket is already checked in
    if (ticket.status === "checkedIn") {
      return res.status(400).json({ message: "Ticket already checked in" });
    }

    // Optional: Check if ticket is valid for this event, date, etc.

    ticket.status = "checkedIn";
    await ticket.save();

    console.log("Done");
    return res.json({ message: "Ticket checked in successfully", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

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

    const ticket = await Ticket.findOne({ _id: ticketId, userId })
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
          "title startDate startTime endDate endTime location image organizer meetLink limit",
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

    const now = new Date();
    console.log({ ticket });

    // Extract date part (YYYY-MM-DD) from endDate
    const datePart = new Date(ticket.eventId.endDate)
      .toISOString()
      .split("T")[0]; // "2025-04-18"

    // Combine with endTime to form a full datetime string (local time)
    const combinedDateTimeString = `${datePart}T${ticket.eventId.endTime}:00`;

    // Parse combined datetime
    const eventEndDateTime = new Date(combinedDateTimeString);

    // Status logic
    let computedStatus = "active";

    if (ticket.eventId.isCancelled) {
      computedStatus = "cancelled";
    } else if (now > eventEndDateTime) {
      computedStatus = ticket.status === "used" ? "used" : "passed";
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ ...ticket.toObject(), computedStatus });

    // res.status(200).json(ticket);
  } catch (error) {
    console.error("❌ Error fetching ticket:", error);
    res
      .status(500)
      .json({ message: "Error fetching ticket", error: error.message });
  }
});

const checkInTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId).populate("eventId");

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  const now = new Date();
  const eventEnd = new Date(
    ticket.eventId.endDate + "T" + ticket.eventId.endTime
  );

  if (ticket.status === "used") {
    return res.status(400).json({ message: "Ticket already used" });
  }

  if (now > eventEnd) {
    return res.status(400).json({ message: "Event has ended" });
  }

  if (ticket.status === "cancelled") {
    return res.status(400).json({ message: "Event cancelled" });
  }

  ticket.status = "used";
  ticket.usedAt = now;
  await ticket.save();

  res.status(200).json({ message: "Check-in successful", ticket });
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
        "title description meetLink category location startDate startTime endDate endTime"
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
        select: "userId eventId qrCode purchaseDate status ticketTypeId",
        populate: [
          {
            path: "eventId",
            select:
              "title description meetLink category location startDate startTime endDate endTime",
          },
        ],
      })
      .populate("ticketTypes", "type price description quantity")
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
      .populate("ticket", "userId eventId qrCode purchaseDate ticketTypeId")
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
        select: "name email photo userId socialMediaLinks",
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
        select: "name email photo ticket",
        populate: [
          {
            path: "photo",
            select: "imageUrl cloudinaryId",
          },
          {
            path: "ticket",
            // populate: {
            //   path: "ticketType",
            select: "ticketTypeId status purchaseDate",
            // },
          },
        ],
      })
      .populate({
        path: "ticket",
        select:
          "qrCode purchaseDate ticketTypeId availableQuantity ticketQuantity soldQuantity",
        populate: [
          {
            path: "eventId",
            select:
              "title description meetLink category location startDate startTime endDate endTime",
          },
        ],
      })
      .populate(
        "ticketTypes",
        "type price description availableQuantity totalQuantity soldQuantity status"
      )
      .populate(
        "ticket",
        "qrCode purchaseDate ticketTypeId availableQuantity ticketQuantity soldQuantity"
      );

    console.log({ attendees: event.attendees });

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
          "title startDate startTime endDate endTime location image organizer meetLink limit",
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
  const userId = req.userId;

  try {
    const [user, event, ticket] = await Promise.all([
      User.findById(userId),
      Event.findById(eventId),
      TicketType.findById(ticketId),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket type not found" });
    }

    if (user._id.toString() !== event.organizer.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update tickets for this event.",
      });
    }

    const now = new Date();
    const eventStartDateTime = new Date(
      `${event.startDate}T${event.startTime}`
    );
    if (now >= eventStartDateTime) {
      return res.status(400).json({
        message: "Event has already started. Ticket type cannot be updated.",
      });
    }

    // Normalize and validate the updated ticket type name
    if (type && type.trim() !== ticket.type) {
      const normalizedType = type.trim();

      const duplicate = await TicketType.findOne({
        eventId: event._id,
        _id: { $ne: ticket._id },
        type: { $regex: new RegExp(`^${normalizedType}$`, "i") },
      });

      if (duplicate) {
        return res.status(400).json({
          message: `Ticket type "${normalizedType}" already exists for this event.`,
        });
      }

      ticket.type = normalizedType;
    }

    // Handle quantity update with validations
    if (totalQuantity !== undefined) {
      const newTotal = Number(totalQuantity);
      if (!Number.isInteger(newTotal) || newTotal <= 0) {
        return res
          .status(400)
          .json({ message: "Total quantity must be a positive integer." });
      }

      const otherTicketsTotal = await TicketType.aggregate([
        { $match: { eventId: event._id, _id: { $ne: ticket._id } } },
        { $group: { _id: null, sum: { $sum: "$totalQuantity" } } },
      ]);

      const currentOthers = otherTicketsTotal[0]?.sum || 0;
      const combinedTotal = currentOthers + newTotal;

      if (combinedTotal > event.limit) {
        return res.status(400).json({
          message: `Updating to ${newTotal} would exceed event guest limit (${event.limit}).`,
        });
      }

      if (newTotal < ticket.soldQuantity) {
        return res.status(400).json({
          message: `Cannot reduce quantity below sold tickets (${ticket.soldQuantity}).`,
        });
      }

      ticket.totalQuantity = newTotal;
      ticket.availableQuantity = newTotal - ticket.soldQuantity;
    }

    // Handle price update
    if (price !== undefined) {
      const newPrice = Number(price);
      if (isNaN(newPrice) || newPrice < 0) {
        return res
          .status(400)
          .json({ message: "Price must be a non-negative number." });
      }
      ticket.price = newPrice;
    }

    // Handle description update
    if (description !== undefined) {
      if (description.length > 300) {
        return res
          .status(400)
          .json({ message: "Description must not exceed 300 characters." });
      }
      ticket.description = description;
    }

    const updatedTicket = await ticket.save();

    return res.status(200).json({
      message: "Ticket type updated successfully.",
      ticketType: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket type:", error);
    return res.status(500).json({ message: "Internal server error" });
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
    meetLink,
    limit,
  } = req.body;

  const { eventId } = req.params;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this event." });
    }

    const now = new Date();
    const originalStart = new Date(`${event.startDate}T${event.startTime}`);
    if (originalStart <= now) {
      return res.status(400).json({
        message: "Event has already started and cannot be updated.",
      });
    }

    const newStart =
      startDate && startTime ? new Date(`${startDate}T${startTime}`) : null;
    const newEnd =
      endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

    if (newStart && newStart <= now) {
      return res
        .status(400)
        .json({ message: "Start date & time must be in the future." });
    }

    if (newEnd && newEnd <= now) {
      return res
        .status(400)
        .json({ message: "End date & time must be in the future." });
    }

    if (newStart && newEnd && newStart >= newEnd) {
      return res.status(400).json({
        message: "Start date & time must be before end date & time.",
      });
    }

    // Only validate location/meetLink if provided
    if (location !== undefined) {
      const hasValidLocation = Array.isArray(location) && location.length === 5;
      if (!hasValidLocation) {
        return res.status(400).json({
          message: "Location must be an array of 5 elements.",
        });
      }
      event.location = location;
    }

    if (meetLink !== undefined) {
      const hasValidMeetLink =
        typeof meetLink === "string" &&
        meetLink.trim() !== "" &&
        /^https?:\/\/[^\s$.?#].[^\s]*$/.test(meetLink);
      if (!hasValidMeetLink) {
        return res.status(400).json({
          message: "meetLink must be a valid URL.",
        });
      }
      event.meetLink = meetLink;
    }

    // Update other fields
    event.title = title ?? event.title;
    event.liked = liked ?? event.liked;
    event.description = description ?? event.description;
    event.categories = categories ?? event.categories;
    event.startDate = startDate ?? event.startDate;
    event.endDate = endDate ?? event.endDate;
    event.startTime = startTime ?? event.startTime;
    event.endTime = endTime ?? event.endTime;
    event.photo = photo ?? event.photo;
    event.limit = limit ?? event.limit;

    const updatedEvent = await event.save();
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ message: "Internal server error" });
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
    const [event, user] = await Promise.all([
      Event.findById(eventId),
      User.findById(userId),
    ]);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // console.log(event)

    // ✅ Ensure only organizer can delete
    if (event.organizer.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this event." });
    }

    const dateOnly = new Date(event.startDate); // will be in UTC
    const [hours, minutes] = event.startTime.split(":").map(Number);
    const eventStart = new Date(dateOnly);
    eventStart.setUTCHours(hours, minutes, 0, 0); // Combine correctly in UTC

    const now = new Date();

    if (now < eventStart) {
      return res
        .status(400)
        .json({ message: "Cannot delete an upcoming event." });
    }

    // 🧹 Delete Cloudinary image if exists
    if (event.image?.cloudinaryId) {
      await cloudinary.uploader.destroy(event.image.cloudinaryId);
    }

    // 🧹 Delete associated TicketTypes and Tickets
    await Promise.all([
      TicketType.deleteMany({ eventId }),
      Ticket.deleteMany({ eventId }),
    ]);

    // 🧹 Delete the event
    await event.deleteOne();

    // ✉️ Send confirmation email
    await sendDeleteEventMail({
      name: user.name,
      email: user.email,
      title: event.title,
    });

    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Internal Server Error." });
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
    const event = await Event.findById(eventId).populate("ticket");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the ticket associated with the event
    const ticket = await Ticket.findById(event.ticket);
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
  createEvent,
  getMyTickets,
  updateTicketType,
  validateTicketSelection,
  likeStatus,
  getAllLikedEvents,
  unlikeEvent,
  likeEvent,
  getTicket,
  checkInTicket,
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
  attendeeCheckIn,
  getUserCancelledEvents,
  unCancelEvent,
  getAllTickets,
  purchaseTicketLogic,
  getOrganizerById,
  getTicketsSold,
  getEventWithTicketById,
  getUserPastEvents,
};
