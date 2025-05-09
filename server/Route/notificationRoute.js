const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  deleteNotification,
  deleteAllNotifications,
} = require("../Controller/notificationController");
const { protectUser } = require("../Middleware/authMiddleware");

router.get("/get-notifications", protectUser, getUserNotifications);

router.delete(
  "/delete-notification/:notificationId",
  protectUser,
  deleteNotification
);

router.delete("/delete-all-notifications", protectUser, deleteAllNotifications);

module.exports = router;
