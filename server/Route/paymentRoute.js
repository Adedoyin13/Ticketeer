const express = require("express");
const { createCheckoutSession, confirmCheckoutSession, stripeWebhookHandler } = require("../Controller/paymentController");
const { protectUser } = require("../Middleware/authMiddleware");
const router = express.Router();

// router.post("/create-payment-intent", protectUser, createPaymentIntent);
router.post("/create-checkout-session", protectUser, createCheckoutSession);
router.get("/confirm-checkout-session", protectUser, confirmCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

module.exports = router;