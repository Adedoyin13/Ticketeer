const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      isRead: {
        type: Boolean,
        default: false, // New notifications start as unread
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;