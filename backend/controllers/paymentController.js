import Payment from "../models/PaymentModel.js";
import Guest from "../models/GuestModel.js";
import ShopTenant from "../models/ShopTenantModel.js";

// Create Payment Entry
export const createPayment = async (req, res) => {
  try {
    const { payer, payerType, month, year, rentAmount, paidAmount, paymentMode, notes, dueDate } = req.body;

    // Check if payer exists
    if (payerType === "Guest") {
      const guest = await Guest.findById(payer);
      if (!guest) return res.status(404).json({ message: "Guest not found" });
    } else if (payerType === "ShopTenant") {
      const tenant = await ShopTenant.findById(payer);
      if (!tenant) return res.status(404).json({ message: "Shop Tenant not found" });
    }

    // Determine status
    let status = "unpaid";
    if (paidAmount >= rentAmount) status = "paid";
    else if (paidAmount > 0) status = "partial";

    const payment = new Payment({
      payer,
      payerType,
      month,
      year,
      rentAmount,
      paidAmount,
      paymentMode,
      notes,
      dueDate,
      status,
      paymentDate: paidAmount > 0 ? new Date() : null,
    });

    await payment.save();
    res.status(201).json({ message: "Payment entry created", payment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Payment for this month already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get Payments (by month/year or payer)
export const getPayments = async (req, res) => {
  try {
    const { month, year, payer, payerType } = req.query;

    const filter = {};
    if (month) filter.month = month;
    if (year) filter.year = year;
    if (payer) filter.payer = payer;
    if (payerType) filter.payerType = payerType;

    const payments = await Payment.find(filter)
      .populate("payer")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Payment (add new paid amount)
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMode, notes } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.paidAmount += paidAmount;
    payment.paymentMode = paymentMode || payment.paymentMode;
    payment.notes = notes || payment.notes;
    payment.paymentDate = new Date();

    // Recalculate status
    if (payment.paidAmount >= payment.rentAmount) {
      payment.status = "paid";
    } else if (payment.paidAmount > 0) {
      payment.status = "partial";
    } else {
      payment.status = "unpaid";
    }

    await payment.save();
    res.json({ message: "Payment updated", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
