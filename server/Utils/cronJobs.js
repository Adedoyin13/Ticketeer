// const cron = require('node-cron');
// const { Event } = require('../Model/eventModel');
// const Notification = require('../Model/notificationModel');

// const createEventReminderNotifications = async () => {
//   try {
//     // Find all events starting in the next 1 or 2 days
//     const upcomingEvents = await Event.find({
//       startDate: { $gte: new Date(), $lte: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000) },
//     });

//     // Loop through the upcoming events and create notifications for attendees and organizers
//     for (const event of upcomingEvents) {
//       const attendees = event.attendees;
//       const organizer = event.organizer;

//       // Create notifications for attendees
//       for (const attendee of attendees) {
//         const daysLeft = Math.abs((new Date(event.startDate) - new Date()) / (1000 * 60 * 60 * 24));
//         const message = `Reminder: The event "${event.title}" is happening in ${daysLeft} days!`;
//         const notification = new Notification({
//           userId: attendee._id,
//           message,
//           type: 'eventReminder',
//           isRead: false,
//           createdAt: new Date(),
//         });
//         await notification.save();
//       }

//       // Create notification for the organizer (assuming organizer is a single user, not an array)
//       if (organizer) {
//         const daysLeft = Math.abs((new Date(event.startDate) - new Date()) / (1000 * 60 * 60 * 24));
//         const message = `Reminder: Your event "${event.title}" is happening in ${daysLeft} days!`;
//         const notification = new Notification({
//           userId: organizer._id, // Assuming organizer is a single user
//           message,
//           type: 'eventReminder',
//           isRead: false,
//           createdAt: new Date(),
//         });
//         await notification.save();
//       }
//     }
//   } catch (error) {
//     console.error('Error checking upcoming events:', error);
//   }
// };

// // Schedule the job to check every day at midnight
// cron.schedule('0 0 * * *', () => {
//   console.log('Running event reminder notifications...');
//   createEventReminderNotifications();
// });

// module.exports = { createEventReminderNotifications };