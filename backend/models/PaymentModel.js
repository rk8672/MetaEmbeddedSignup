import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "payerType", // dynamically reference Guest or ShopTenant
    },
    payerType: {
      type: String,
      required: true,
      enum: ["Guest", "ShopTenant"],
    },
    month: { type: Number, required: true }, // 1 = Jan, 12 = Dec
    year: { type: Number, required: true },
    rentAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["paid", "partial", "unpaid", "overdue"],
      default: "unpaid",
    },
    paymentDate: { type: Date },
    paymentMode: {
      type: String,
      enum: ["cash", "bank", "upi", "cheque", "other"],
      default: "cash",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent duplicate entries for same month/year + payer
paymentSchema.index(
  { payer: 1, payerType: 1, month: 1, year: 1 },
  { unique: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
