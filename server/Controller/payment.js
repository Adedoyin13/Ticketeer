const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);
const { purchaseTicket } = require("./eventController");

exports.verifyFlutterwavePayment = async (req, res) => {
  const { transaction_id, ticketId, eventId } = req.body;
  const userId = req.userId;

  console.log("Event ID from request body: ", eventId);
  console.log("Ticket ID from request body: ", ticketId);
  console.log("Transaction ID from request body: ", transaction_id);

  try {
    const response = await flw.Transaction.verify({ id: transaction_id });

    console.log("Transaction verification response", response);

    if (!eventId || !ticketTypeId || !userId) {
      return res
        .status(400)
        .json({ message: "Missing required fields before success check" });
    }

    if (response.data.status === "successful") {
      if (!eventId || !ticketTypeId || !userId) {
        return res
          .status(400)
          .json({ message: "Missing required fields after success check" });
      }
      await purchaseTicket(ticketId, eventId, userId, transaction_id);
      console.log("Event ID from request body after purchase: ", eventId);
      console.log("Ticket ID from request body after purchase: ", ticketId);
      console.log(
        "Transaction ID from request body after purchase: ",
        transaction_id
      );
      return res.status(201).json({ message: "Ticket purchased successfully" });
    }

    return res.status(400).json({ message: "Payment not successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
