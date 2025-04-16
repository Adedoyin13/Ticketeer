const nodemailer = require("nodemailer");
const { Event } = require("../Model/eventModel");

const sendCreateEventMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Event creation Confirmation - ${data.name}, You've successfully created event - ${data.title}!`,
    html: `
      <p>Dear ${data.name},</p>

      <p>We're excited to confirm that you've successfully created an event! - ${data.title} 🎉</p>

      <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
      <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

      <p>Enjoy the event, and thank you for choosing Ticketeer!</p>

      <p>Best regards,</p>
      <p><strong>The Ticketeer Team</strong></p>
    `,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Check-in email sent successfully");
    }
  });
};

const sendCreateTicketMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Ticket creation Confirmation - ${data.name}, You've successfully created ticket for event - ${data.title}!`,
    html: `
      <p>Dear ${data.name},</p>

      <p>We're excited to confirm that you've successfully created ticket for an event! 🎉</p>

      <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
      <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

      <p>Enjoy the event, and thank you for choosing Ticketeer!</p>

      <p>Best regards,</p>
      <p><strong>The Ticketeer Team</strong></p>
    `,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Check-in email sent successfully");
    }
  });
};

const sendDeleteEventMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Event deletion Confirmation!`,
    html: `
      <p>Dear ${data.name},</p>

      <p>This is to inform you that you've successfully deleted an event! - ${data.title}</p>

      <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
      <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

      <p>Enjoy the event, and thank you for choosing Ticketeer!</p>

      <p>Best regards,</p>
      <p><strong>The Ticketeer Team</strong></p>
    `,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Event deletion email sent successfully to", data.email);
    }
  });
};

const sendCancelEventMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Event cancellation Confirmation!`,
    html: `
      <p>Dear ${data.name},</p>

      <p>This is to inform you that you've successfully canceled an event! - ${data.title}</p>
      <p>If this was a mistake, log into your account to resume the event</p>

      <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
      <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

      <p>Enjoy the event, and thank you for choosing Ticketeer!</p>

      <p>Best regards,</p>
      <p><strong>The Ticketeer Team</strong></p>
    `,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Event cancellation email sent successfully to", data.email);
    }
  });
};

const sendReactivateEventMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Event Resumption Confirmation!`,
    html: `
      <p>Dear ${data.name},</p>

      <p>We're excited to confirm that you've successfully resumed an event! - ${data.title} 🎉</p>
      // <p>If this action was a mistake, log into your account to cancel the event</p>

      <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
      <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

      <p>Enjoy the event, and thank you for choosing Ticketeer!</p>

      <p>Best regards,</p>
      <p><strong>The Ticketeer Team</strong></p>
    `,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Event Resumption email sent successfully to", data.email);
    }
  });
};

const createEventReminderMail = async () => {
  try {
    // Find all events starting in the next 1 or 2 days
    const upcomingEvents = await Event.find({
      startDate: {
        $gte: new Date(),
        $lte: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
      },
    });

    // Loop through the upcoming events and create notifications for attendees and organizers
    for (const event of upcomingEvents) {
      const attendees = event.attendees;
      const organizer = event.organizer;

      // Loop through attendees and send email notifications
      for (const attendee of attendees) {
        const message = `Reminder: The event "${
          event.title
        }" is happening in ${Math.abs(
          (new Date(event.startDate) - new Date()) / (1000 * 60 * 60 * 24)
        )} days!`;

        // Create an email transporter
        const transporter = nodemailer.createTransport({
          service: "gmail", // You can use any other email service provider
          auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
          },
        });

        // Email options
        const mailOptions = {
          from: process.env.EMAIL_USER, // Sender address
          to: attendee.email, // Receiver's email
          subject: "Event Reminder Notification",
          text: message,
        };

        // Send email to the attendee
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to: ${attendee.email}`);
      }

      // Create notifications for organizers (similar to attendees)
      for (const organizer of organizer) {
        const message = `Reminder: Your event "${
          event.title
        }" is happening in ${Math.abs(
          (new Date(event.startDate) - new Date()) / (1000 * 60 * 60 * 24)
        )} days!`;

        const transporter = nodemailer.createTransport({
          service: "gmail", // You can use any other email service provider
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: organizer.email,
          subject: "Event Reminder Notification",
          text: message,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to organizer: ${organizer.email}`);
      }
    }
  } catch (error) {
    console.error("Error checking upcoming events:", error);
  }
};

const sendTicketPurchaseMail = (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Ticket Purchase Confirmation!`,
    html: `
      <p>Dear ${data.name},</p>

      <p>Thank you for purchasing ticket for the event "${event.title}"</p>


      <p>Event Details:</p>
      ------------------

      <p>Title: ${event.title}</p>
      <p>Description: \t${event.description}</p>
      <p>Date: ${new Date(event.startDate - event.endDate).toLocaleString()}</p>
      <p>Time: ${(event.startTime - event.endTime).toLocaleString()}</p>
      <p>Location: ${event.location}</p>

      <p>Your Ticket Information:</p>
      -------------------------

      <p>We appreciate your support and look forward to seeing you at the event.</p>

      <p>Thank you,</p>
      <p><strong>The Ticketeer Team</strong></p>

    `,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Ticket Purchase email sent successfully to", data.email);
    }
  });
};

module.exports = {
  sendCreateEventMail,
  sendCreateTicketMail,
  createEventReminderMail,
  sendDeleteEventMail,
  sendCancelEventMail,
  sendReactivateEventMail,
  sendTicketPurchaseMail,
};
