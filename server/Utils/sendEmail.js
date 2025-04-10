const nodemailer = require("nodemailer");

const FRONTEND_URL = process.env.FRONTEND_URL

const sendUserLogInMail = (data) => {
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
    subject: `Log-In Confirmation - ${data.name}, Welcome back to Ticketeer!`,
    html: `
      <p>Dear ${data.name},</p>

      <p>We're excited to confirm that you've successfully logged in to your account! 🎉</p>

      <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
      <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

      <p>Enjoy the experience, and thank you for choosing Ticketeer!</p>

      <p>Best regards,</p>
      <p><strong>The Ticketeer Team</strong></p>
    `,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Check-in email sent successfully", data.email);
    }
  });
};

const sendUserRegisterMail = async (data) => {
  try {
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: `Check-In Confirmation - ${data.name}, Welcome to Ticketeer!`,
      html: `
        <p>Dear ${data.name},</p>

        <p>We're excited to confirm that you've successfully created an account with us! 🎉</p>

        <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
        <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

        <p>Enjoy the experience, and thank you for choosing Ticketeer!</p>

        <p>Best regards,</p>
        <p><strong>The Ticketeer Team</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Check-in email sent successfully to", data.email);
  } catch (err) {
    console.error("❌ Error sending check-in email:", err);
  }
};

const sendUserUpdateMail = async (data) => {
  try {
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: `Profile Update - ${data.name}`,
      html: `
        <p>Dear ${data.name},</p>

        <p>We're excited to confirm that you've successfully updated your profile! 🎉</p>

        <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
        <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

        <p>Enjoy the experience, and thank you for choosing Ticketeer!</p>

        <p>Best regards,</p>
        <p><strong>The Ticketeer Team</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Check-in email sent successfully to", data.email);
  } catch (err) {
    console.error("❌ Error sending check-in email:", err);
  }
};

const sendUserLogoutMail = async (data) => {
  try {
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: `Log out confirmation - ${data.name}`,
      html: `
        <p>Dear ${data.name},</p>

        <p>We've confirmed tat you've logged out of your account</p>

        <p>Log in to explore and create events of your choice - Ticketeer is always available for you!</p>

        <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
        <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

        <p>Enjoy the experience, and thank you for choosing Ticketeer!</p>

        <p>Best regards,</p>
        <p><strong>The Ticketeer Team</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Check-in email sent successfully to", data.email);
  } catch (err) {
    console.error("❌ Error sending check-in email:", err);
  }
};

const sendUserDeleteMail = async (data) => {
  try {
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: `Account deletion confirmation - ${data.name}`,
      html: `
         <p>Dear ${data.name},</p>

        <p>We're sorry to see you go! 😔</p>

        <p>Feel free to create a new account with us at <a href=${FRONTEND_URL}/login>ticketeer01@gmail.com</a>, we are alwas ready to welcome you</p>

        <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
        <p><strong>Ticketeer Support:</strong> <a href="mailto:ticketeer01@gmail.com">ticketeer01@gmail.com</a></p>

        <p>Enjoy the experience, and thank you for choosing Ticketeer!</p>

        <p>Best regards,</p>
        <p><strong>The Ticketeer Team</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Check-in email sent successfully to", data.email);
  } catch (err) {
    console.error("❌ Error sending check-in email:", err);
  }
};

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
    subject: `Check-In Confirmation - ${data.organizer.name}, You've successfully creates event - ${data.title}!`,
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

// const sendVerificationEmail = asyncHandler(async (req, res) => {
//   try {
//     // Fetch user from database
//     const user = await User.findById(req.userId);
//     if (!user) {
//       console.error(`User not found: ${req.userId}`);
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if user is already verified
//     if (user.isVerified) {
//       console.warn(`User ${user.email} is already verified.`);
//       return res.status(400).json({ message: "User already verified" });
//     }

//     // Rate limiting: Prevent sending emails too frequently
//     const lastSent = user.lastEmailSentAt || 0;
//     const cooldownTime = process.env.EMAIL_COOLDOWN || 5 * 60 * 1000; // Default: 5 minutes
//     if (Date.now() - lastSent < cooldownTime) {
//       console.warn(`User ${user.email} requested verification email too soon.`);
//       return res.status(429).json({
//         message: `Please wait ${
//           cooldownTime / 60000
//         } minutes before requesting another email.`,
//       });
//     }

//     // Generate verification token with configurable expiration
//     const tokenExpiry = process.env.VERIFICATION_TOKEN_EXPIRY || "1h"; // Default: 1 hour
//     const verificationToken = jwt.sign(
//       { userId: user._id },
//       process.env.ACCESS_TOKEN,
//       {
//         expiresIn: tokenExpiry,
//       }
//     );

//     // Construct verification URL
//     const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;

//     // Create email content
//     const emailContent = verificationEmailTemplate(user, verificationUrl);

//     // Send email with retry mechanism
//     await emailService.send({
//       to: user.email,
//       from: process.env.EMAIL_USER,
//       subject: "Verify Your Account",
//       html: emailContent,
//       retry: 3,
//     });

//     // Update last email sent timestamp
//     user.lastEmailSentAt = Date.now();
//     await user.save();

//     console.log(`Verification email sent to ${user.email}`);
//     return res
//       .status(200)
//       .json({ message: "Verification email sent successfully" });
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//     return res.status(500).json({
//       message: "Failed to send verification email. Please try again later.",
//     });
//   }
// });

// const sendAutomatedEmail = asyncHandler(async (req, res) => {
//   const { subject, send_to, reply_to, template, url } = req.body;

//   if (!subject || !send_to || !reply_to || !template) {
//     return res.status(500).json({ message: "Missing email parameter" });
//   }

//   // Get user
//   const user = await User.findOne({ email: send_to });

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   const sent_from = process.env.EMAIL_USER;
//   const name = user.firstName;
//   const link = `${process.env.FRONTEND_URL}${url}`;

//   try {
//     await sendEmail(
//       subject,
//       send_to,
//       sent_from,
//       reply_to,
//       template,
//       name,
//       link
//     );
//     res.status(200).json({ message: "Email Sent" });
//   } catch (error) {
//     res.status(500);
//     throw new Error("Email not sent, please try again");
//   }
// });

module.exports = {sendUserLogInMail, sendUserRegisterMail, sendUserUpdateMail, sendUserLogoutMail, sendUserDeleteMail};