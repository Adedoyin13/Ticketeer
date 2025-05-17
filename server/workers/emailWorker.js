const emailQueue = require("../Utils/emailQueue");
const {sendTicketPurchaseMail} = require("../Utils/sendEventEmail");

emailQueue.process(async (job) => {
  const mailData = job.data;
  try {
    await sendTicketPurchaseMail(mailData);
    console.log("✅ Email sent to:", mailData.email);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw err; // Bull will retry based on original job options
  }
});
