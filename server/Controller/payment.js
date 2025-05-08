const Flutterwave = require("flutterwave-node-v3");
const axios = require('axios');
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);
const { purchaseTicketLogic } = require("./eventController");

exports.verifyFlutterwavePayment = async (req, res) => {
  const { transaction_id, ticketId, eventId } = req.body;
  const userId = req.userId;

  try {
    const response = await flw.Transaction.verify({ id: transaction_id });

    if (!eventId || !ticketId || !userId) {
      return res
        .status(400)
        .json({ message: "Missing required fields before success check" });
    }

    if (response.data.status === "successful") {
      if (!eventId || !ticketId || !userId) {
        return res
          .status(400)
          .json({ message: "Missing required fields after success check" });
      }

      await purchaseTicketLogic({ ticketTypeId: ticketId, eventId, userId });
      return res.status(201).json({ message: "Ticket purchased successfully" });
      // return res.status(200).json({ success: true, paymentData });
    }

    return res.status(400).json({ message: "Payment not successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

exports.verifyPaystackPayment = async (req, res) => {
  const { reference, ticketTypeId, eventId } = req.body;
  const userId = req.userId;

  if (!reference || !ticketTypeId || !eventId || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paymentData = response?.data?.data;

    if (!paymentData) {
      return res.status(400).json({ success: false, message: "Invalid response from Paystack" });
    }

    if (paymentData.status === 'success') {
      await purchaseTicketLogic({ ticketTypeId, eventId, userId });
      return res.status(200).json({ success: true, paymentData });
    } else {
      return res.status(403).json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};