// models/RazorpayTransections/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    linkId: { type: String, required: true }, // Your payment link / lead id
    razorpayLinkId: { type: String },         // Actual Razorpay link ID
    paymentId: { type: String },
    orderId: { type: String },
    amount: { type: Number },
    currency: { type: String, default: "INR" },
    method: { type: String },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "paid", "failed"],
      default: "created",
    },
    customer: {
      name: String,
      email: String,
      contact: String,
    },
    verified: {
      captured: { type: Boolean, default: false },
      paid: { type: Boolean, default: false }
    },
    rawWebhooks: [{ type: Object }], // Keep history of all webhooks
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
