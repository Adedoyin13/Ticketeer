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
  getAttendeesForEvent,
  buyTicket,
  getTicket,
  cancelEvent,
  getOrganizerById,
  getTicketsSold,
  getUserEvents,
  getAllTickets,
  getEventWithTicketById,
  userUpcomingEvents,
  uploadEventImage,
  updateEventImage,
  updateTicketType,
  getUserCancelledEvents,
  unCancelEvent,
  deleteEventImage,
  getUserPastEvents,
  getMyTickets,
  unlikeEvent,
  likeEvent,
} = require("../Controller/eventController");
const { protectUser, organizerOnly } = require("../Middleware/authMiddleware");
const upload = require("../Middleware/multer");

router.post("/createEvent", protectUser, createEvent);
router.get("/getEvent/:id", protectUser, getEvent);
router.get("/getEvents", protectUser, getEvents);
router.get("/attendees/:eventId", protectUser, getAttendeesForEvent);
router.get("/getUserEvents", protectUser, getUserEvents);
router.get("/liked-events/:eventId", protectUser, likeStatus);
router.get("/liked-events", protectUser, getAllLikedEvents);
router.put("/updateEvent/:eventId", protectUser, updateEvent);
router.put("/updateTicketType/:ticketId", protectUser, updateTicketType);
router.delete("/deleteEvent/:eventId", protectUser, deleteEvent);
router.get("/my/cancelled-events", protectUser, getUserCancelledEvents);
router.patch("/cancelEvent/:eventId", protectUser, cancelEvent);
router.patch("/uncancel/:eventId", protectUser, unCancelEvent);
router.put("/like/:eventId", protectUser, likeEvent);
router.put("/unlike/:eventId", protectUser, unlikeEvent);

router.get("/upcoming-events", protectUser, upcomingEvents);
router.get("/my/upcoming-events", protectUser, userUpcomingEvents);
router.get("/my/past-events", protectUser, protectUser, getUserPastEvents);
router.get("/past-events", protectUser, pastEvents);
router.get("/trending-events", protectUser, trendingEvents);
router.get("/ticket/:id", protectUser, getEventWithTicketById);

router.post("/buy-ticket/:eventId", protectUser, buyTicket);
router.get("/organizer/:id", protectUser, getOrganizerById);
router.get("/tickets-sold/:eventId", protectUser, getTicketsSold);

// Ticket routes
router.post("/create-ticket/:eventId", protectUser, createTicket);
router.get("/my-tickets", protectUser, getMyTickets);
router.get("/getTicket/:ticketId", protectUser, getTicket);
router.get("/getAllTickets/:eventId", protectUser, organizerOnly, getAllTickets);
router.post("/ticket/purchase", protectUser, purchaseTicket);

router.post("/:eventId/upload-image", protectUser, upload.single("image"), uploadEventImage);
router.put("/:eventId/update-image", protectUser, upload.single("image"), updateEventImage);
router.delete("/:eventId/delete-photo", protectUser, deleteEventImage);

module.exports = router;