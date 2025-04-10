const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User } = require("../Model/authModel");
const { Event } = require("../Model/eventModel");

const protectUser = asyncHandler(async (req, res, next) => {
  let token;

  // Corrected logic for checking authorization header or cookie token
  if (req.headers.authorization?.startsWith("Bearer") || req.cookies.token) {
    try {
      token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.userId = decoded.id;

      // Fetch user from database and exclude password
      const foundUser = await User.findById(decoded.id).select("-password");

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
      }

      // Check if user is suspended
      if (foundUser.role === "suspended") {
        return res.status(403).json({ message: "User suspended, please contact support" });
      }

      // Attach user to request
      req.user = foundUser;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized, no token" });
  }
});

const organizerOnly = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized. No user ID provided." });
    }

    // Get event ID from request params
    const { eventId } = req.params;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if logged-in user is the organizer
    if (event.organizer.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden. You are not the organizer of this event." });
    }

    // If the user is the organizer, allow the request to proceed
    next();
  } catch (error) {
    console.error("OrganizerOnly Middleware Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { protectUser, organizerOnly };