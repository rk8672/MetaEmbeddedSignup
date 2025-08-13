const express = require("express");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();

// Use your webhook secret from Razorpay dashboard (TEST mode)
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// Route: /webhook/razorpay
router.post("/razorpay", (req, res) => {
  const webhookBody = JSON.stringify(req.body);
  const webhookSignature = req.headers["x-razorpay-signature"];

  // Verify the webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(webhookBody)
    .digest("hex");

  if (expectedSignature === webhookSignature) {
    console.log("✅ Razorpay Webhook Verified!");
    console.log("Event:", req.body.event);
    console.log("Payload:", req.body.payload);

    // Handle different events
    switch (req.body.event) {
      case "payment.captured":
        const payment = req.body.payload.payment.entity;
        console.log("Payment captured:", payment);
        // TODO: Update your database or order status here
        break;
      case "payment.failed":
        console.log("Payment failed:", req.body.payload.payment.entity);
        break;
      default:
        console.log("Other event received:", req.body.event);
    }

    res.status(200).send("OK");
  } else {
    console.log("❌ Webhook signature mismatch!");
    res.status(400).send("Invalid signature");
  }
});

module.exports = router;
