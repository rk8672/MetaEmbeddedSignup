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

    // Only process payment events
    if (!["payment_link.paid", "payment_link.partially_paid", "payment.failed", "payment.captured"].includes(event)) {
      console.log("ℹ️ Ignored non-payment event:", event);
      return res.status(200).send("Ignored event");
    }

    console.log("✅ Razorpay Webhook Verified!");
    console.log("Event:", event);

    const payment = req.body.payload.payment?.entity;  // comes in payment.captured
    const paymentLink = req.body.payload.payment_link?.entity; // comes in payment_link.paid

    let studentInfo = {
      name: payment?.notes?.lead_name || paymentLink?.notes?.lead_name || "N/A",
      email: payment?.notes?.lead_email || paymentLink?.notes?.lead_email || "N/A",
      contact: payment?.notes?.lead_contact || paymentLink?.notes?.lead_contact || "N/A"
    };

    // Get IDs
    const linkId = payment?.notes?.link_id || paymentLink?.notes?.link_id;
    const razorpayLinkId = payment?.payment_link_id || paymentLink?.id;

    // Fallback → fetch from MongoDB if needed
    if (linkId || razorpayLinkId) {
      const lead = await Lead.findOne({
        $or: [
          { "paymentLinks.linkId": linkId },
          { "paymentLinks.razorpayLinkId": razorpayLinkId }
        ]
      });

      if (lead) {
        const pl = lead.paymentLinks.find(p =>
          p.linkId === linkId || p.razorpayLinkId === razorpayLinkId
        );

        studentInfo = {
          name: studentInfo.name !== "N/A" ? studentInfo.name : (pl?.lead_name || lead.fullName || "N/A"),
          email: studentInfo.email !== "N/A" ? studentInfo.email : (pl?.lead_email || lead.email || "N/A"),
          contact: studentInfo.contact !== "N/A" ? studentInfo.contact : (pl?.contact || lead.mobile || "N/A")
        };
      }
    }

    // ✅ Log correct payment details
    console.log("💰 Payment Details:", {
      linkId: linkId || razorpayLinkId,
      paymentId: payment?.id || "N/A",
      amount: payment ? payment.amount / 100 : paymentLink?.amount / 100,
      currency: payment?.currency || "INR",
      status: payment?.status || paymentLink?.status,
      method: payment?.method || "link",
      ...studentInfo,
      created_at: payment?.created_at || paymentLink?.created_at
    });

    res.status(200).send("OK");

  } catch (err) {
    console.error("Error handling webhook:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
