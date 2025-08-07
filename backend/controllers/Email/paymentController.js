const { createPaymentLink } = require("../../services/razorpayService");
const { sendPaymentEmail } = require("../../services/emailService");
const Lead = require("../../models/Lead/leadModel"); 
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


    // 3. Update lead status to "payment-link-sent"
    const updatedLead = await Lead.findOneAndUpdate(
      { email }, // You can also use { email, contact } for more accuracy
      { status: "payment-link-sent" },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found to update status" });
    }

  return res.status(200).json({ message: "Payment link sent and lead status updated successfully", link: linkResult.paymentLink });
};
