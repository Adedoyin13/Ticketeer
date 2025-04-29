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

    console.log('Done')

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

    console.log('Session', session)
    
    const lineItems = await stripe.checkout.sessions.listLineItems(session_id);
    console.log('lineItems', lineItems)

    res.status(200).json({
      success: true,
      session,
      lineItems,
    });

    console.log('Success...')
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

  // Log the raw body (you can log this for debugging purposes, be cautious in production)
  console.log('Raw body received:', req.body.toString());

  try {
    // Construct the Stripe event using the webhook secret
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    console.log('Event received:', event);  // Logs the entire event object

  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log the event type for easy reference
  console.log('Event type:', event.type);

  // Check if the event is a successful checkout session
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;  // Contains the session object

    // Log the session object
    console.log('Session object:', session);

    const { userId, eventId, ticketTypeId } = session.metadata;

    try {
      console.log('Creating ticket for user', userId);

      // Log the ticket creation process for debugging
      await purchaseTicket({ eventId, ticketTypeId, userId });
      console.log('Ticket purchase successful');
      
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Ticket creation failed in webhook:", error.message);
      return res.status(500).json({ message: "Ticket creation failed" });
    }
  }

  res.status(200).send("Event received but no action taken.");
};

exports.strieWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Event received:', event);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, eventId, ticketTypeId } = session.metadata;

    try {
      console.log('Creating ticket for user', userId);
      await purchaseTicket({ eventId, ticketTypeId, userId });
      console.log('Ticket purchase successful');
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Ticket creation failed in webhook:", error.message);
      return res.status(500).json({ message: "Ticket creation failed" });
    }
  }

  res.status(200).send("Event received but no action taken.");
};
