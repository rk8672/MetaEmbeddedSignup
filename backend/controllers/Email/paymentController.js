const { createPaymentLink } = require("../../services/razorpayService");
const { sendPaymentEmail } = require("../../services/emailService");

exports.sendPaymentLink = async (req, res) => {
  const { fullName, email, contact, amount } = req.body;

  if (!email || !fullName || !contact || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const linkResult = await createPaymentLink({
    amount,
    customer: { name: fullName, email, contact },
  });

  if (!linkResult.success) {
    return res.status(500).json({ message: "Failed to create payment link" });
  }

  const emailResult = await sendPaymentEmail({
    to: email,
    fullName,
    link: linkResult.paymentLink,
    amount,
  });

  if (!emailResult.success) {
    return res.status(500).json({ message: "Payment link created, but email failed" });
  }

  return res.status(200).json({ message: "Payment link sent successfully", link: linkResult.paymentLink });
};
