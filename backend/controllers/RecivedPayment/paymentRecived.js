const Payment = require("../../models/RecivedPayment/Payment");
const Lead = require("../../models/Lead/leadModel");
const mongoose = require("mongoose");

exports.attachPaymentToLead = async (req, res) => {
  try {
    const { transactionId, leadId, amount, date, notes } = req.body;

    // Validate inputs
    if (!transactionId || !leadId || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ message: "Invalid Lead ID" });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const existing = await Payment.findOne({ transactionId });
    if (existing) {
      return res.status(409).json({ message: "Duplicate transaction ID" });
    }

    const payment = new Payment({
      transactionId,
      lead: lead._id,
      amount,
      date: new Date(date),
      notes,
      createdBy: req.user?._id,
    });

    await payment.save();

    lead.payments.push(payment._id);
        // Automatically update status to "payment-done"
    lead.status = "payment-done";

    await lead.save();

    res.status(201).json({
      message: "Payment successfully attached to lead",
      payment,
    });
  } catch (err) {
    console.error("Attach Payment Error:", err);
    res.status(500).json({
      message: "Internal Server Error while attaching payment",
      error: err.message,
    });
  }
};
