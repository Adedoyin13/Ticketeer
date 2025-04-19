const mongoose = require("mongoose");
const DEFAULT_EVENT_IMAGE_URL = process.env.DEFAULT_EVENT_IMAGE_URL;

// Define the ticket schema

const ticketTypeSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    type: { type: String, required: true }, // e.g., VIP, GA
    description: { type: String },
    price: { type: Number, required: true },
    totalQuantity: { type: Number, required: true }, // Original total tickets available
    availableQuantity: { type: Number }, // How many are left
    soldQuantity: { type: Number },
    // status: {
    //   type: String,
    //   enum: ["available", "sold_out", "closed"],
    //   default: "available",
    // },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketType",
      required: true,
    },
    qrCode: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "used", "cancelled"],
      default: "active",
    },
    expiresAt: { type: Date }, // useful for checking ticket validity
  },
  {
    timestamps: true,
    minimize: false,
  }
);

// Define the event schema
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    ticketTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: "TicketType" }],
    startTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Basic validation for HH:MM format
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    liked: { type: Boolean, default: false },
    eventType: {
      type: String,
      enum: ["physical", "virtual"],
      required: true,
    }, // Enum for event type
    location: {
      type: Array, // Required for physical events
      default: [],
      validate: {
        validator: function (value) {
          return this.eventType === "physical"
            ? value.length === 5
            : value.length === 0;
        },
        message:
          "Location must contain [address, country, state, city, venue name] for physical events.",
      },
    },
    meetLink: {
      type: String, // Required for virtual events
      validate: {
        validator: function (value) {
          return this.eventType === "virtual"
            ? /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value)
            : !value;
        },
        message: "A valid URL is required for virtual events.",
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likedUsers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    canceled: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: String,
      enum: [
        "business and networking",
        "music and concert",
        "sport and fitness",
        "arts and culture",
        "festival and fairs",
        "fun and hangout",
      ],
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    image: {
      imageUrl: {
        type: String,
        required: true,
        default: DEFAULT_EVENT_IMAGE_URL,
      }, // Stores Cloudinary URL
      cloudinaryId: {
        type: String,
      },
      googleId: {
        type: String,
        sparse: true,
      },
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    trending: { type: Boolean, default: false },
    tickets: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: false,
    },
    ticketType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketType",
      required: false,
    },
    limit: { type: Number, required: true },
    hasBooked: {
      type: Boolean,
      default: false,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

eventSchema.virtual("isUpcoming").get(function () {
  return this.date > Date.now();
});

eventSchema.virtual("isPast").get(function () {
  return this.date <= Date.now();
});

const Event = mongoose.model("Event", eventSchema);
const TicketType = mongoose.model("TicketType", ticketTypeSchema);
const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = { Event, Ticket, TicketType };
