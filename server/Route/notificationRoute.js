const express = require("express");
const router = express.Router();
const {
  notification,
  getNotification,
  readNotification,
  getUnreadNotifications,
  getReadNotifications,
  deleteNotification,
  deleteAllNotifications,
  markAllNotificationsAsRead
} = require("../Controller/notificationController");
const { protectUser } = require("../Middleware/authMiddleware");

// Endpoint to create a new notification
router.post("/create-notification", protectUser, notification);

// Endpoint to get notifications for a specific user
router.get("/get-notifications", protectUser, getNotification);

// Endpoint to mark notifications as read
router.put('/mark-notification-read/:notificationId', protectUser, readNotification);
router.get('/unread-notification/', protectUser, getUnreadNotifications);
router.get('/read-notification/', protectUser, getReadNotifications);

// Delete a single notification
router.delete('/delete-notification/:notificationId', protectUser, deleteNotification);

// Delete all notifications
router.delete('/delete-all-notifications', protectUser, deleteAllNotifications);

// Mark all notifications as read
router.put('/notifications/mark-all-read', protectUser, markAllNotificationsAsRead);
  

module.exports = router;