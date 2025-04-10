const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN, { expiresIn: "1d" });
};

// Hash Token
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token.toString()).digest("hex");
};

const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  generateToken,
  hashToken,
  sendEmail
};