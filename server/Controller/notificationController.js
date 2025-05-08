const Notification = require("../Model/notificationModal");

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 }) // newest first
      .limit(50); // optional: limit to 50

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to get notifications" });
  }
};
