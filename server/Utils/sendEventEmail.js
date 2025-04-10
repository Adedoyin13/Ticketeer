const nodemailer = require("nodemailer");

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

      <p>We're excited to confirm that you've successfully created an event! 🎉</p>

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

module.exports = {
  sendCreateEventMail,
  sendCreateTicketMail
};
