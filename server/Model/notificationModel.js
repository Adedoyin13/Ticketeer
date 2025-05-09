const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["event", "ticket", "general"],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    metadata: { type: Object }, // optional, for extra details like eventId or ticketId
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
