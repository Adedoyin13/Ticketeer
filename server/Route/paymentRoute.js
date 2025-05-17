const express = require("express");
const { protectUser } = require("../Middleware/authMiddleware");
const { verifyFlutterwavePayment, verifyPaystackPayment, validateTicketPurchaseController } = require("../Controller/payment");
const router = express.Router();

router.post("/flutterwave/verify", protectUser, verifyFlutterwavePayment);
router.post("/paystack/verify", protectUser, verifyPaystackPayment);
router.post('/validate', protectUser, validateTicketPurchaseController);

module.exports = router;