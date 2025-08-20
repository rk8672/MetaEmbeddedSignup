const express = require("express");
const crypto = require("crypto");
const Lead = require("../models/Lead/leadModel");
const Transaction = require("../models/RazorpayTransections/Transaction");

require("dotenv").config();
const router = express.Router();
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

router.post("/razorpay", async (req, res) => {
  try {
    const webhookBody = JSON.stringify(req.body);
    const webhookSignature = req.headers["x-razorpay-signature"];

    // 🔐 Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(webhookBody)
      .digest("hex");

    if (expectedSignature !== webhookSignature) {
      console.log("❌ Webhook signature mismatch!");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;

    // Process only relevant events
    if (
      ![
        "payment_link.paid",
        "payment_link.partially_paid",
        "payment.captured",
        "payment.failed"
      ].includes(event)
    ) {
      console.log("ℹ️ Ignored non-payment event:", event);
      return res.status(200).send("Ignored event");
    }

    console.log("✅ Razorpay Webhook Verified!");
    console.log("Event:", event);

    const payment = req.body.payload.payment?.entity;      // payment.captured, payment.failed
    const paymentLink = req.body.payload.payment_link?.entity; // payment_link.paid, partially_paid

    // Extract student info
    let studentInfo = {
      name: payment?.notes?.lead_name || paymentLink?.notes?.lead_name || null,
      email: payment?.notes?.lead_email || paymentLink?.notes?.lead_email || null,
      contact: payment?.notes?.lead_contact || paymentLink?.notes?.lead_contact || null
    };

    // Extract IDs
    const linkId = payment?.notes?.link_id || paymentLink?.notes?.link_id || null;
    const razorpayLinkId = payment?.payment_link_id || paymentLink?.id || null;

    // Fallback → fetch student details from Lead collection
    if (linkId || razorpayLinkId) {
      const lead = await Lead.findOne({
        $or: [
          { "paymentLinks.linkId": linkId },
          { "paymentLinks.razorpayLinkId": razorpayLinkId }
        ]
      });

      if (lead) {
        const pl = lead.paymentLinks.find(
          (p) => p.linkId === linkId || p.razorpayLinkId === razorpayLinkId
        );

        studentInfo = {
          name: studentInfo.name || pl?.lead_name || lead.fullName,
          email: studentInfo.email || pl?.lead_email || lead.email,
          contact: studentInfo.contact || pl?.contact || lead.mobile
        };
      }
    }

    // ✅ Build transaction record
    const txn = new Transaction({
      event,
      linkId,
      razorpayLinkId,
      paymentId: payment?.id || null,
      orderId: payment?.order_id || null,
      amount: payment ? payment.amount : paymentLink?.amount,
      currency: payment?.currency || paymentLink?.currency || "INR",
      status: payment?.status || paymentLink?.status,
      method: payment?.method || "link",
      name: studentInfo.name,
      email: studentInfo.email,
      contact: studentInfo.contact,
      rawWebhook: req.body
    });

    await txn.save();

    console.log("💰 Transaction Saved:", txn.paymentId, txn.status);

    res.status(200).send("Webhook processed");
  } catch (err) {
    console.error("Error handling webhook:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
