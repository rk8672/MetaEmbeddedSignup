const express = require("express");
const crypto = require("crypto");
const Lead = require("../models/Lead/leadModel"); // Adjust path if needed
require("dotenv").config();

const router = express.Router();
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// /webhook/razorpay
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

    // Only handle payment.captured and payment.failed
    const event = req.body.event;
    if (!["payment.captured", "payment.failed"].includes(event)) {
      // Ignore all other events
      return res.status(200).send("Ignored event");
    }

    console.log("✅ Razorpay Webhook Verified!");
    console.log("Event:", event);

    const payment = req.body.payload.payment.entity;
    const linkId = payment.notes?.link_id || payment.payment_link_id;

    if (!linkId) {
      console.log("⚠️ No linkId found in payment payload");
      return res.status(200).send("No linkId found");
    }

    if (event === "payment.captured") {
      const updatedLead = await Lead.findOneAndUpdate(
        { "paymentLinks.linkId": linkId },
        {
          $set: {
            "paymentLinks.$.status": "paid",
            status: "payment-done",
          },
        },
        { new: true }
      );

      if (updatedLead) {
        console.log("✅ Lead updated:", updatedLead.email);
      } else {
        console.log("⚠️ No lead found for linkId:", linkId);
      }
    }

    if (event === "payment.failed") {
      await Lead.findOneAndUpdate(
        { "paymentLinks.linkId": linkId },
        { $set: { "paymentLinks.$.status": "failed" } }
      );
      console.log("❌ Payment failed for linkId:", linkId);
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Error handling webhook:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
