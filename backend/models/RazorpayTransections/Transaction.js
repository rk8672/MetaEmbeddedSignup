const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },         // Razorpay event type
    linkId: { type: String },                        // Custom link ID
    razorpayLinkId: { type: String },                // Razorpay Link ID
    paymentId: { type: String },                     // Razorpay Payment ID
    orderId: { type: String },                       // Razorpay Order ID (if exists)

    amount: { type: Number, required: true },        // in paise
    currency: { type: String, default: "INR" },
    status: { type: String, required: true },        // created, authorized, captured, failed, refunded
    method: { type: String },                        // upi, card, netbanking, etc.

    // Student / customer details
    name: { type: String },
    email: { type: String },
    contact: { type: String },

    // Raw webhook data (for debugging/audit)
    rawWebhook: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
