const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
} = require("../Controller/notificationController");
const { protectUser } = require("../Middleware/authMiddleware");

// Endpoint to create a new notification
router.get("/get-notifications", protectUser, getUserNotifications);

module.exports = router;
