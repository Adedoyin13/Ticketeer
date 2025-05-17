const Flutterwave = require("flutterwave-node-v3");
const axios = require("axios");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);
const { purchaseTicketLogic, validateTicketSelection } = require("./eventController");

exports.verifyFlutterwavePayment = async (req, res) => {
  const { transaction_id, eventId, selectedTickets } = req.body;
  const userId = req.userId;

  if (!transaction_id || !eventId || !selectedTickets || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const response = await flw.Transaction.verify({ id: transaction_id });

    if (response.data.status === "successful") {
      const responsePayload = await purchaseTicketLogic({ eventId, selectedTickets, userId });
      // console.log('responsePayload: ', responsePayload)
    
      return res
        .status(201)
        .json({
          success: true,
          message: "Tickets purchased successfully",
          tickets: responsePayload,
        });  
    }    
    return res.status(400).json({ message: "Payment not successful" });
  } catch (error) {
    console.error("Flutterwave verify error:", error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

exports.verifyPaystackPayment = async (req, res) => {
  const { reference, eventId, selectedTickets } = req.body;
  // console.log('selectedTickets', selectedTickets)
  const userId = req.userId;

  if (!reference || !eventId || !selectedTickets || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response?.data?.data;

    if (!paymentData) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid response from Paystack" });
    }

    if (paymentData.status === "success") {
      const responsePayload = await purchaseTicketLogic({ eventId, selectedTickets, userId });

      return res
      .status(201)
      .json({
        success: true,
        message: "Tickets purchased successfully",
        tickets: responsePayload, // 🔥 Add this
      });  
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Payment not successful" });
    }
  } catch (error) {
    console.error(
      "Paystack verify error:",
      error.response?.data || error.message
    );
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.validateTicketPurchaseController = async (req, res) => {
  try {
    const { selectedTickets, eventId } = req.body;
    const userId = req.userId;

    await validateTicketSelection({ selectedTickets, eventId, userId }); // shared logic

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
