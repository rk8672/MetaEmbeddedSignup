// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      default: "razorpay", // For now, assuming Razorpay only
    },
    date: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who attached payment
    },
    notes: String, // Optional: any comment/note about the payment
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ transactionId: 1 }, { unique: true });
paymentSchema.index({ lead: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
