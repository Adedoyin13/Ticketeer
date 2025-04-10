const cron = require('node-cron');
const { Event } = require('../Model/eventModel');
const Notification = require('../Model/notificationModel');

const createEventReminderNotifications = async () => {
  try {
    // Find all events starting in the next 1 or 2 days
    const upcomingEvents = await Event.find({
      startDate: { $gte: new Date(), $lte: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000) },
    });

    // Loop through the upcoming events and create notifications for attendees and organizers
    for (const event of upcomingEvents) {
      const attendees = event.attendees;
      const organizers = event.organizers;

      // Create notifications for attendees
      for (const attendee of attendees) {
        const message = `Reminder: The event "${event.title}" is happening in ${Math.abs((new Date(event.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days!`;
        const notification = new Notification({
          userId: attendee.userId,
          message,
          type: 'eventReminder',
          isRead: false,
          createdAt: new Date(),
        });
        await notification.save();
      }

      // Create notifications for organizers
      for (const organizer of organizers) {
        const message = `Reminder: Your event "${event.title}" is happening in ${Math.abs((new Date(event.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days!`;
        const notification = new Notification({
          userId: organizer.userId,
          message,
          type: 'eventReminder',
          isRead: false,
          createdAt: new Date(),
        });
        await notification.save();
      }
    }
  } catch (error) {
    console.error('Error checking upcoming events:', error);
  }
};

// Schedule the job to check every day at midnight
cron.schedule('0 0 * * *', createEventReminderNotifications);

module.exports = { createEventReminderNotifications };