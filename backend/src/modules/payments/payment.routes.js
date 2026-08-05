const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');

// Create Escrow Razorpay Order
router.post('/create-order', paymentController.createEscrowOrder);

// Verify Signature & Lock Escrow
router.post('/verify-escrow', paymentController.verifyEscrow);

// Release Instant UPI Payout to Volunteer
router.post('/release-payout', paymentController.releasePayout);

module.exports = router;