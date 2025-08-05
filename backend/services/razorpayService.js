const razorpay = require("../config/razorpayConfig");

const createPaymentLink = async ({ amount, customer }) => {
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
      callback_url: "https://yourdomain.com/payment/callback",
      callback_method: "get",
    });

    return { success: true, paymentLink: res.short_url };
  } catch (err) {
    console.error("Error creating payment link:", err);
    return { success: false, error: err };
  }
};

module.exports = { createPaymentLink };
