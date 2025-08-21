// routes/razorpayWebhook.js
const express = require("express");
const crypto = require("crypto");
const Lead = require("../models/Lead/leadModel");
const Transaction = require("../models/RazorpayTransections/Transaction");
const Payment = require("../models/RecivedPayment/Payment");

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

    if (
      ![
        "payment_link.paid",
        "payment_link.partially_paid",
        "payment.captured",
        "payment.failed",
      ].includes(event)
    ) {
      console.log("ℹ️ Ignored non-payment event:", event);
      return res.status(200).send("Ignored event");
    }

    console.log("✅ Razorpay Webhook Verified!");
    console.log("Event:", event);

    const payment = req.body.payload.payment?.entity;
    const paymentLink = req.body.payload.payment_link?.entity;

    const linkId = payment?.notes?.link_id || paymentLink?.notes?.link_id || null;
    const razorpayLinkId = payment?.payment_link_id || paymentLink?.id || null;
    const paymentId = payment?.id || null;

    let studentInfo = {
      name: payment?.notes?.lead_name || paymentLink?.notes?.lead_name || null,
      email: payment?.notes?.lead_email || paymentLink?.notes?.lead_email || null,
      contact: payment?.notes?.lead_contact || paymentLink?.notes?.lead_contact || null,
    };

    // 🎯 Find the Lead
    let lead = null;
    if (linkId || razorpayLinkId) {
      lead = await Lead.findOne({
        $or: [
          { "paymentLinks.linkId": linkId },
          { "paymentLinks.razorpayLinkId": razorpayLinkId },
        ],
      });
    }

    // 🔄 Find existing transaction or create new
    let txn = await Transaction.findOne({
      $or: [{ linkId }, { razorpayLinkId }, { paymentId }],
    });

    if (!txn) {
      txn = new Transaction({ linkId, razorpayLinkId, paymentId });
    }

    txn.amount = payment ? payment.amount / 100 : paymentLink?.amount / 100;
    txn.currency = payment?.currency || paymentLink?.currency || "INR";
    txn.method = payment?.method || txn.method;
    txn.customer = studentInfo;

    if (event === "payment.captured") {
      txn.status = "captured";
      txn.verified.captured = true;
    } else if (event === "payment_link.paid") {
      txn.status = "paid";
      txn.verified.paid = true;
    } else if (event === "payment.failed") {
      txn.status = "failed";
    }

    txn.rawWebhooks.push(req.body);
    await txn.save();

    // 🆕 Link Transaction to Lead & also create Payment record
    if (lead && txn.status !== "failed") {
      // ✅ Check if Payment already exists
      let paymentDoc = await Payment.findOne({ transactionId: txn.paymentId });
      if (!paymentDoc) {
        paymentDoc = new Payment({
          transactionId: txn.paymentId,
          lead: lead._id,
          amount: txn.amount,
          method: txn.method || "razorpay",
          date: new Date(),
          notes: `Webhook auto-recorded payment via Razorpay (${txn.status})`,
        });
        await paymentDoc.save();
        console.log("💾 Payment model record created:", paymentDoc._id);
      }

      // ✅ Push Payment._id into Lead (not Transaction._id)
      if (!lead.payments.includes(paymentDoc._id)) {
        lead.payments.push(paymentDoc._id);
      }

      // update status
      if (lead.status !== "payment-done") {
        lead.status = "payment-done";
      }

      await lead.save();

      console.log(`📌 Lead updated: ${lead.fullName} → payment recorded`);
    }

    console.log("💰 Transaction Updated:", txn.paymentId, txn.status);

    res.status(200).send("Webhook processed");
  } catch (err) {
    console.error("Error handling webhook:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
