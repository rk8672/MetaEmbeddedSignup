const { createPaymentLink } = require("../../services/razorpayService");
const { sendPaymentEmail } = require("../../services/emailService");
const Lead = require("../../models/Lead/leadModel");

exports.sendPaymentLink = async (req, res) => {
  try {
    const { fullName, email, contact, amount } = req.body;

    // Validate input
    if (!email || !fullName || !contact || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate a unique internal linkId for your lead
    const customLinkId = `lead_${Date.now()}`;

    // ✅ Create Razorpay payment link with student info in notes
    const linkResult = await createPaymentLink({
      amount,
      customer: { name: fullName, email, contact },
      notes: {
        link_id: customLinkId,
        lead_name: fullName,
        lead_email: email,
        lead_contact: contact
      }
    });

    if (!linkResult.success) {
      return res.status(500).json({ message: "Failed to create payment link" });
    }

    // ✅ Send email with payment link
    const emailResult = await sendPaymentEmail({
      to: email,
      fullName,
      link: linkResult.paymentLink, // Razorpay short_url
      amount
    });

    if (!emailResult.success) {
      return res.status(500).json({ message: "Payment link created, but email failed" });
    }

    // ✅ Save payment link in MongoDB with Razorpay ID
    const updatedLead = await Lead.findOneAndUpdate(
      { email },
      {
        $set: { status: "payment-link-sent" },
        $push: {
          paymentLinks: {
            linkId: customLinkId,            // Internal ID for tracking
            razorpayLinkId: linkResult.id,   // ✅ Razorpay Payment Link ID
            amount,
            status: "created",
            contact,
            lead_name: fullName,
            lead_email: email,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found to update status" });
    }

    return res.status(200).json({
      message: "Payment link sent and lead status updated successfully",
      razorpayLinkId: linkResult.id, // ✅ include Razorpay ID in response
      link: linkResult.paymentLink   // ✅ short_url for student
    });

  } catch (err) {
    console.error("Error sending payment link:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
