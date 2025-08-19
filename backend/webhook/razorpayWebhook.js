const express = require("express");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

router.post("/razorpay", async (req, res) => {
  try {
    const webhookBody = JSON.stringify(req.body);
    const webhookSignature = req.headers["x-razorpay-signature"];

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(webhookBody)
      .digest("hex");

    if (expectedSignature !== webhookSignature) {
      console.log("❌ Webhook signature mismatch!");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;

    if (!["payment.captured", "payment.failed"].includes(event)) {
      console.log("ℹ️ Ignored non-payment event:", event);
      return res.status(200).send("Ignored event");
    }

    console.log("✅ Razorpay Webhook Verified!");
    console.log("Event:", event);

    const payment = req.body.payload.payment.entity;

    // Read full info from notes
    const linkId = payment.notes?.link_id || payment.payment_link_id;
    const email = payment.notes?.lead_email || payment.email || "N/A";
    const name = payment.notes?.lead_name || payment.name || "N/A";
    const contact = payment.notes?.lead_contact || payment.contact || "N/A";

    console.log("💰 Payment Details:");
    console.log({
      linkId,
      paymentId: payment.id,
      amount: payment.amount / 100, // convert paise to rupees
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      name,
      email,
      contact,
      created_at: payment.created_at
    });

    res.status(200).send("OK");
  } catch (err) {
    console.error("Error handling webhook:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
