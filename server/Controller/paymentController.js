const Stripe = require("stripe");
const { purchaseTicket } = require("./eventController");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const crypto = require('crypto');

// Your Stripe webhook secret (found in your Stripe dashboard)
const stripeWebhookSecret = 'whsec_B5Zt7iARjxM7gjbaTJ7gRDvToTnbL7sF';

// The raw payload received from Stripe (the event data)
const payload = JSON.stringify({
  "id": "evt_1IRkhl2eZvXJKhIq8sXJ6H6t",
  "object": "event",
  "type": "checkout.session.completed",
  // Your actual event data here
});

// The timestamp Stripe sends in the webhook (you can get this from the `Stripe-Signature` header)
const timestamp = '1634293277'; // For example, you'll get this from the webhook header or simulate it

// Create the string to sign: timestamp + payload
const stringToSign = `${timestamp}.${payload}`;

// Now create the HMAC with SHA-256 using the signing secret
const signature = crypto
  .createHmac('sha256', stripeWebhookSecret)
  .update(stringToSign)
  .digest('hex');

console.log('Generated Signature:', signature);

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
  const sig = req.headers["stripe-signature"] || "mock_signature";

  console.log('Stripe Signature: ', sig)

  if (!sig) {
    console.error("No Stripe signature found in request");
    return res.status(400).send("Webhook Error: Signature missing");
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Stripe Webhook Secret not defined");
    return res.status(400).send("Webhook Error: Webhook Secret missing");
  }

  let event;

  console.log('Raw body received:', req.body.toString());

  try {
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

// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
// const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');
// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const express = require('express');
const app = express();

app.post('/payments/webhook', express.raw({type: 'application/json'}), (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// app.listen(4242, () => console.log('Running on port 4242'));
