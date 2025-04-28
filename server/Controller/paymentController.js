const Stripe = require("stripe");
const { purchaseTicket } = require("./eventController");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { ticket, userEmail, eventId, userId, ticketTypeId } = req.body;

    if (
      !ticket ||
      !ticket.price ||
      !ticket.type ||
      !userEmail ||
      !eventId ||
      !ticketTypeId ||
      !userId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const fee = ticket.price * 0.02;
    const total = ticket.price + fee;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: ticket.type,
              description: `Ticket for event ${eventId}`,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        eventId,
        ticketTypeId
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout session error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

exports.confirmCheckoutSession = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const lineItems = await stripe.checkout.sessions.listLineItems(session_id);

    res.status(200).json({
      success: true,
      session,
      lineItems,
    });
  } catch (err) {
    console.error("Stripe session fetch error:", err);
    res
      .status(400)
      .json({ success: false, message: "Failed to retrieve session" });
  }
};

exports.stripeWebhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
  
      const { userId, eventId, ticketTypeId } = session.metadata;
  
      try {
        await purchaseTicket({ eventId, ticketTypeId, userId});
  
        return res.status(200).json({ received: true });
      } catch (error) {
        console.error("Ticket creation failed in webhook:", error.message);
        return res.status(500).json({ message: "Ticket creation failed" });
      }
    }
    res.status(200).send("Event received.");
};