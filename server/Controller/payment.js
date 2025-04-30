const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
const { purchaseTicket } = require("./eventController");

exports.verifyFlutterwavePayment = async (req, res) => {
  const { transaction_id, ticketId, eventId } = req.body;
  const userId = req.userId;

  try {
    const response = await flw.Transaction.verify({ id: transaction_id });

    if (response.data.status === "successful") {
      await purchaseTicket(ticketId, eventId, userId, transaction_id);
      return res.status(201).json({ message: "Ticket purchased successfully" });
    }

    return res.status(400).json({ message: "Payment not successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};