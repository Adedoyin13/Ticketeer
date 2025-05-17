const mongoose = require("mongoose");
const DEFAULT_EVENT_IMAGE_URL = process.env.DEFAULT_EVENT_IMAGE_URL;

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
    totalQuantity: { type: Number, required: true },
    availableQuantity: { type: Number },
    soldQuantity: { type: Number },
    status: {
      type: String,
      enum: ["sold_out", "available"],
      default: "available",
    },
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
    quantity: { type: Number },
    qrCode: { type: String },
    purchaseDate: { type: Date, default: Date.now },
    checkInTime: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["going", "checkedIn"],
    },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

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
    location: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          // If location array is present, must have exactly 5 elements
          if (value.length > 0) {
            return value.length === 5;
          }
          return true;
        },
        message:
          "Location must contain exactly 5 elements [address, country, state, city, venue name].",
      },
    },
    meetLink: {
      type: String,
      default: "",
      validate: {
        validator: function (value) {
          if (value && value.length > 0) {
            return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value);
          }
          return true;
        },
        message: "A valid URL is required for the meet link.",
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    likedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
      },
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

eventSchema.pre("validate", function (next) {
  if (
    this.location.length === 5 ||
    (this.meetLink && this.meetLink.length > 0)
  ) {
    next();
  } else {
    next(
      new mongoose.Error.ValidationError(
        this,
        "Either a full location or a valid meet link must be provided."
      )
    );
  }
});

eventSchema.virtual("isUpcoming").get(function () {
  return this.date > Date.now();
});

eventSchema.virtual("isPast").get(function () {
  return this.date <= Date.now();
});

ticketTypeSchema.index({ eventId: 1, type: 1 }, { unique: true });

const Event = mongoose.model("Event", eventSchema);
const TicketType = mongoose.model("TicketType", ticketTypeSchema);
const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = { Event, Ticket, TicketType };