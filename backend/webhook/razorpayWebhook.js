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

    // Fetch student info from Razorpay notes or fallback to MongoDB
    const linkId = payment.notes?.link_id || payment.payment_link_id;

    let studentInfo = {
      name: payment.notes?.lead_name || "N/A",
      email: payment.notes?.lead_email || "N/A",
      contact: payment.notes?.lead_contact || "N/A"
    };

    // Fallback: fetch from DB if notes are missing
    if (linkId && (!studentInfo.email || studentInfo.email === "N/A")) {
      const lead = await Lead.findOne({ "paymentLinks.linkId": linkId });
      if (lead) {
        studentInfo = {
          name: lead.fullName || "N/A",
          email: lead.email || "N/A",
          contact: lead.mobile || "N/A"
        };
      }
    }

    // Log payment details
    console.log("💰 Payment Details:");
    console.log({
      linkId,
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
