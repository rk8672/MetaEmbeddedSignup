const express = require("express");
const crypto = require("crypto");
const Lead = require("../models/Lead/leadModel");
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

    // Fetch student info from Razorpay notes
    let studentInfo = {
      name: payment.notes?.lead_name || "N/A",
      email: payment.notes?.lead_email || "N/A",
      contact: payment.notes?.lead_contact || "N/A"
    };

    // Try fetching from MongoDB fallback using linkId or razorpayLinkId
    const linkId = payment.notes?.link_id;
    const razorpayLinkId = payment.payment_link_id;

    if (linkId || razorpayLinkId) {
      const lead = await Lead.findOne({
        $or: [
          { "paymentLinks.linkId": linkId },
          { "paymentLinks.razorpayLinkId": razorpayLinkId }
        ]
      });

      if (lead) {
        const paymentLink = lead.paymentLinks.find(p =>
          p.linkId === linkId || p.razorpayLinkId === razorpayLinkId
        );

        studentInfo = {
          name: paymentLink?.lead_name || lead.fullName || "N/A",
          email: paymentLink?.lead_email || lead.email || "N/A",
          contact: paymentLink?.contact || lead.mobile || "N/A"
        };
      }
    }

    // Log payment details
    console.log("💰 Payment Details:");
    console.log({
      linkId: linkId || razorpayLinkId,
      paymentId: payment.id,
      amount: payment.amount / 100, // paise -> rupees
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      ...studentInfo,
      created_at: payment.created_at
    });

    res.status(200).send("OK");

  } catch (err) {
    console.error("Error handling webhook:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
