const razorpay = require("../config/razorpayConfig");

const createPaymentLink = async ({ amount, customer, notes = {} }) => {
  try {
    const res = await razorpay.paymentLink.create({
      amount: amount * 100, // ₹500 → 50000 paise
      currency: "INR",
      accept_partial: false,
      customer: {
        name: customer.name,
        contact: customer.contact,
        email: customer.email,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: notes,   // ✅ Add metadata here, will come back in webhook
      // ❌ Removed callback_url and callback_method if relying on webhook
    });

    // ✅ Save res.id (payment_link_id) in DB with customer record
    // Example: await Payment.create({ razorpayLinkId: res.id, shortUrl: res.short_url, status: "created", ... });

    return { success: true, id: res.id, paymentLink: res.short_url };
  } catch (err) {
    console.error("Error creating payment link:", err);
    return { success: false, error: err };
  }
};

module.exports = { createPaymentLink };
