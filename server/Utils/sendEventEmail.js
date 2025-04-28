const nodemailer = require("nodemailer");
const { Event } = require("../Model/eventModel");
const { generateQrCode } = require("./qrCode");

const CLIENT_URL = process.env.CLIENT_URL

const sendCreateEventMail = (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <title>Event Created</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Inter', sans-serif;">
      <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;background-color:#f8fafc;">
        <tr>
          <td align="center">
            <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.06);">
              <tr>
                <td style="background:#1e293b;padding:24px;text-align:center;color:#ffffff;">
                  <h2 style="margin:0;font-size:24px;font-weight:600;">Ticketeer</h2>
                  <p style="margin:4px 0 0;font-size:14px;color:#cbd5e1;">Your event is live!</p>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <h3 style="margin-top:0;color:#0f172a;font-size:20px;">Hey ${
                    data.name
                  },</h3>
                  <p style="color:#334155;font-size:16px;">Your event has been created successfully 🎉</p>

                  <div style="margin-top:24px;">
                    <p style="margin:8px 0;"><strong>📌 Title:</strong> ${
                      data.title
                    }</p>
                    <p style="margin:8px 0;"><strong>📅 Date:</strong> ${
                      data.startDate
                    }</p>
                    <p style="margin:8px 0;"><strong>⏰ Time:</strong> ${
                      data.startTime
                    }</p>
                    <p style="margin:8px 0;"><strong>🧭 Type:</strong> ${
                      data.eventType
                    }</p>

                    ${
                      data.eventType === "virtual"
                        ? `<p style="margin:8px 0;"><strong>🔗 Meet Link:</strong> <a href="${data.meetLink}" style="color:#3b82f6;">Join Now</a></p>`
                        : `<div style="margin:8px 0;">
                            <strong>📍 Location:</strong>
                            <p style="margin:4px 0 0;color:#475569;">
                              <p>Venue Name: ${data.location?.venue}</p><br />
                              <p>Address: ${data.location?.address}, ${data.location?.city}</p><br />
                              <p>Country: ${data.location?.state}, ${data.location?.country}</p>
                            </p>
                          </div>`
                    }

                    <p style="margin:8px 0;"><strong>🆔 Event ID:</strong> #${
                      data.eventId
                    }</p>
                    <p style="margin:8px 0;"><strong>📌 Created At:</strong> ${new Date(
                      data.createdAt
                    ).toLocaleString()}</p>
                  </div>

                  <div style="text-align:center;margin-top:32px;">
                    <a href="${CLIENT_URL}/my-events" style="background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">View My Events</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#f1f5f9;padding:20px;text-align:center;font-size:13px;color:#94a3b8;">
                  Need help? Email us at 
                  <a href="mailto:ticketeer01@gmail.com" style="color:#94a3b8;">ticketeer01@gmail.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: "Your event has been created!",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Email error:", err);
    else console.log("Event creation email sent to", data.email);
  });
};

const sendCreateTicketMail = (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Ticket Created</title>
    </head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',sans-serif;">
      <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.06);">
              <tr>
                <td style="background:#1e293b;padding:24px;text-align:center;color:#fff;">
                  <h2 style="margin:0;">Ticketeer</h2>
                  <p style="color:#cbd5e1;">New Ticket Type Created</p>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <h3 style="margin-top:0;">Hi ${data.name},</h3>
                  <p style="color:#334155;">A new ticket type has been successfully added to your event.</p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background:#f1f5f9; border-radius:8px; padding: 20px; font-size: 14px; color:#0f172a;">
                    <tr>
                      <td colspan="2" style="padding-bottom: 12px; font-weight: 600; font-size: 16px;">🎟 ${
                        data.type || "General Admission"
                      } Ticket</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-weight: 500;">Event:</td>
                      <td>${data.title || "Untitled Event"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-weight: 500;">Price:</td>
                      <td>$${data.price || 0}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-weight: 500;">Quantity:</td>
                      <td>${data.totalQuantity || 0}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-weight: 500;">Ticket ID:</td>
                      <td>${data.ticketTypeId || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-weight: 500;">Created At:</td>
                      <td>${data.createdAt || "N/A"}</td>
                    </tr>
                  </table>

                  <div style="text-align:center;margin-top:24px;">
                    <a href="${CLIENT_URL}/event-details/${
                      data.eventId
                    }" style="background:#f97316;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">View Event</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#f1f5f9;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
                  Need help? Email us at 
                  <a href="mailto:ticketeer01@gmail.com" style="color:#94a3b8;">ticketeer01@gmail.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: "Ticket Type Created for Your Event",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error("Ticket creation email error:", err);
    else console.log("Ticket creation email sent to", data.email);
  });
};

const sendTicketPurchaseMail = async (data) => {
  const {
    ticketTypeId,
    name,
    email,
    event,
    startDate,
    startTime,
    eventType,
    location,
    meetLink,
    status,
  } = data;

  const qrData = `ticketeer://ticket/${ticketTypeId}`;
  const qrCodeImage = await generateQrCode(qrData);

  // Set up transporter for sending email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head><meta charset="UTF-8"><title>Ticket Purchase</title></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:monospace;">
      <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.06);">
              <tr>
                <td style="background:#1e293b;padding:24px;text-align:center;color:#fff;">
                  <h2 style="margin:0;">Ticketeer</h2>
                  <p style="color:#cbd5e1;">Ticket Purchase Confirmation</p>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <h3 style="margin-top:0;">Hi ${name},</h3>
                  <p style="color:#334155;">Thanks for your purchase! 🎉</p>
                  <pre style="background:#f1f5f9;padding:20px;border-radius:8px;color:#0f172a;">
<h3 style="color:#1e293b;">Ticket Purchase Summary</h3>
<div style="background:#f1f5f9;padding:20px;border-radius:8px;">
  <p style="margin:0;padding-bottom:10px;"><strong>🎟 Ticket:</strong> ${event.title} Ticket</p>
  <p style="margin:0;padding-bottom:10px;"><strong>Event:</strong> ${event.title}</p>
  <p style="margin:0;padding-bottom:10px;"><strong>Date:</strong> ${startDate}</p>
  <p style="margin:0;padding-bottom:10px;"><strong>Time:</strong> ${startTime}</p>
  <p style="margin:0;padding-bottom:10px;"><strong>Event Type:</strong> ${eventType}</p>
  <p style="margin:0;padding-bottom:10px;"><strong>Location:</strong> ${location}</p>
  <p style="margin:0;padding-bottom:10px;"><strong>Link:</strong> <a href="${meetLink}" style="color:#f97316;text-decoration:none;">Join the Event</a></p>
  
  <div style="text-align:center;margin-top:20px;">
    <p style="font-weight:bold;color:#1e293b;">Your QR Code:</p>
    <img src="${qrCodeImage}" alt="QR Code" style="width:150px;height:150px;border-radius:8px;" />
  </div>

  <p style="margin-top:20px;color:#334155;"><strong>Status:</strong> ✅ ${status}</p>
  <p style="margin-top:10px;color:#334155;"><strong>Ticket ID:</strong> #${ticketTypeId}</p>
</div>

                  </pre>
                  <div style="text-align:center;margin-top:24px;">
                    <a href="${CLIENT_URL}/my-tickets" style="background:#f97316;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">View My Tickets</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#f1f5f9;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
                  Need help? Email us at 
                  <a href="mailto:ticketeer01@gmail.com" style="color:#94a3b8;">ticketeer01@gmail.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  // Set mail options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Ticket is Confirmed!",
    html: htmlContent,
  };

  // Send email
  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error("Ticket purchase email error:", err);
    else console.log("Ticket purchase email sent to", email);
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
    subject: `Your Event Has Been Deleted — ${data.title}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; background-color: #f9fafb; padding: 40px; color: #1f2937;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.05);">
          <h2 style="color: #ef4444; margin-top: 0;">Event Deleted Successfully</h2>
          <p style="font-size: 16px;">Hello <strong>${data.name}</strong>,</p>
          <p style="font-size: 15px;">
            This email is to confirm that the event <strong>"${data.title}"</strong> has been successfully deleted from your Ticketeer account.
          </p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="font-size: 14px;">
            If this was a mistake or if you need help, please contact our support team below.
          </p>

          <p style="margin-bottom: 4px;"><strong>Ticketeer Support</strong></p>
          <a href="mailto:ticketeer01@gmail.com" style="color: #3b82f6;">ticketeer01@gmail.com</a>

          <p style="margin-top: 40px; font-size: 14px; color: #6b7280;">
            Thank you for using Ticketeer.<br />
            — The Ticketeer Team
          </p>
        </div>
      </div>
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
    subject: `Event Cancelled — ${data.title}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; background-color: #f9fafb; padding: 40px; color: #1f2937;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.05);">
          <h2 style="color: #f97316; margin-top: 0;">Event Cancelled</h2>
          <p style="font-size: 16px;">Hi <strong>${data.name}</strong>,</p>
          <p style="font-size: 15px;">
            You have successfully cancelled the event <strong>"${data.title}"</strong>.
          </p>
          <p style="font-size: 14px;">
            If this was a mistake, you can log in to your account and resume the event at any time.
          </p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="font-size: 14px;">
            Need help or have questions? We're here for you.
          </p>
          <p style="margin-bottom: 4px;"><strong>Ticketeer Support</strong></p>
          <a href="mailto:ticketeer01@gmail.com" style="color: #3b82f6;">ticketeer01@gmail.com</a>

          <p style="margin-top: 40px; font-size: 14px; color: #6b7280;">
            Thank you for using Ticketeer.<br />
            — The Ticketeer Team
          </p>
        </div>
      </div>
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
    subject: `Event Resumed — ${data.title}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; background-color: #f9fafb; padding: 40px; color: #1f2937;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.05);">
          <h2 style="color: #10b981; margin-top: 0;">🎉 Event Resumed</h2>
          <p style="font-size: 16px;">Hey <strong>${data.name}</strong>,</p>
          <p style="font-size: 15px;">
            Great news! Your event <strong>"${data.title}"</strong> has been successfully resumed and is now live again.
          </p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="font-size: 14px;">
            If this was done in error, you can log into your Ticketeer account to cancel it again.
          </p>

          <p style="margin-bottom: 4px;"><strong>Ticketeer Support</strong></p>
          <a href="mailto:ticketeer01@gmail.com" style="color: #3b82f6;">ticketeer01@gmail.com</a>

          <p style="margin-top: 40px; font-size: 14px; color: #6b7280;">
            Keep making magic happen with your events ✨<br />
            — The Ticketeer Team
          </p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Event resumption email sent successfully to", data.email);
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

module.exports = {
  sendCreateEventMail,
  sendCreateTicketMail,
  createEventReminderMail,
  sendDeleteEventMail,
  sendCancelEventMail,
  sendReactivateEventMail,
  sendTicketPurchaseMail,
};
