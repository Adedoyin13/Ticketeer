const Notification = require("../Model/notificationModel");
const { User } = require("../Model/authModel");
const expressAsyncHandler = require("express-async-handler");

// Endpoint to create a new notification
const notification = expressAsyncHandler(async (req, res) => {
  const { message, type } = req.body;

  const userId = req.userId;

  try {
    const notification = new Notification({
      userId,
      message,
      type,
    });

    await notification.save();

    res
      .status(200)
      .json({ message: "Notification created successfully", notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification" });
  }
});

// Endpoint to get notifications for a specific user
const getNotification = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;

  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Endpoint to mark notifications as read
const readNotification = expressAsyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read" });
  }
});

const getUnreadNotifications = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;

  const unread = await Notification.find({ userId, isRead: false }).sort({
    timestamp: -1,
  });

  res.json(unread);
});

const getReadNotifications = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;

  const read = await Notification.find({ userId, isRead: true }).sort({
    timestamp: -1,
  });

  res.json(read);
});

const deleteNotification = expressAsyncHandler(async (req, res) => {
  const { notificationId } = req.params; // notificationId from URL

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Make sure the notification belongs to the authenticated user
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own notifications" });
    }

    // Delete the notification
    await notification.deleteOne();

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
});

const deleteAllNotifications = expressAsyncHandler(async (req, res) => {
  try {
    // Delete all notifications that belong to the authenticated user
    const result = await Notification.deleteMany({ userId: req.user._id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No notifications found to delete" });
    }

    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Error deleting notifications" });
  }
});

const markAllNotificationsAsRead = expressAsyncHandler(async (req, res) => {
  try {
    // Update all notifications for the authenticated user
    const updatedNotifications = await Notification.updateMany(
      { userId: req.user._id, isRead: false }, // Only update unread notifications
      { $set: { isRead: true } }
    );

    if (updatedNotifications.nModified === 0) {
      return res.status(404).json({ message: "No unread notifications found" });
    }

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Error marking notifications as read" });
  }
});

const createPurchaseNotification = async (userId, eventTitle) => {
  try {
    const message = `You have successfully purchased a ticket for the event: ${eventTitle}`;
    const type = "purchase"; // You can define different types for different notification types

    const notification = new Notification({
      userId,
      message,
      type,
      isRead: false,
      createdAt: new Date(),
    });

    await notification.save();
  } catch (error) {
    console.error("Error creating purchase notification:", error);
  }
};

module.exports = {
  notification,
  getNotification,
  readNotification,
  getUnreadNotifications,
  getReadNotifications,
  markAllNotificationsAsRead,
  deleteAllNotifications,
  deleteNotification,
};
