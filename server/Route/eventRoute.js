const express = require("express");
const router = express.Router();
const {
  createEvent,
  likeStatus,
  getAllLikedEvents,
  getEvents,
  createTicket,
  purchaseTicket,
  getEvent,
  updateEvent,
  deleteEvent,
  upcomingEvents,
  pastEvents,
  trendingEvents,
  buyTicket,
  getTicket,
  getOrganizerById,
  getTicketsSold,
  getUserEvents,
  getAllTickets,
  getEventWithTicketById,
  userUpcomingEvents,
  uploadEventImage,
  updateEventImage,
  deleteEventImage,
  getUserPastEvents
} = require("../Controller/eventController");
const { protectUser, organizerOnly } = require("../Middleware/authMiddleware");
const upload = require("../Middleware/multer");

router.post("/createEvent", protectUser, createEvent);
router.get("/getEvent/:id", protectUser, getEvent);
router.get("/getEvents", protectUser, getEvents);
router.get("/getUserEvents", protectUser, getUserEvents);
router.get("/liked-events/:eventId", protectUser, likeStatus);
router.get("/liked-events", protectUser, getAllLikedEvents);
router.patch("/updateEvent/:eventId", protectUser, organizerOnly, updateEvent);
router.delete("/deleteEvent/:eventId", protectUser, organizerOnly, deleteEvent);

router.get("/upcoming-events", upcomingEvents);
router.get("/my/upcoming-events", protectUser, userUpcomingEvents);
router.get("/my/past-events", protectUser, getUserPastEvents);
router.get("/past-events", pastEvents);
router.get("/trending-events", trendingEvents);
router.get("/ticket/:id", getEventWithTicketById);

router.post("/buy-ticket/:eventId", protectUser, buyTicket);
router.get("/organizer/:id", getOrganizerById);
router.get("/tickets-sold/:eventId", getTicketsSold);

// Ticket routes
router.post("/create-ticket/:eventId", protectUser, createTicket);
router.get("/getTicket/:eventId", protectUser, getTicket);
router.get("/getAllTickets/:eventId", protectUser, organizerOnly, getAllTickets);
router.post("/tickets/purchase", purchaseTicket);

router.post("/:eventId/upload-image", protectUser, upload.single("photo"), uploadEventImage);
router.put("/:eventId/update-image", protectUser, upload.single("photo"), updateEventImage);
router.delete("/:eventId/delete-photo", protectUser, deleteEventImage);

module.exports = router;