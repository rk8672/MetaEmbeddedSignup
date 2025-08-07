const { sendSimpleEmail } = require("../../services/firstWelcomeMail");
const { notifyManagement } = require("../../services/firstNotifyManagement");

exports.sendEmailToLead = async (req, res) => {
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    return res.status(400).json({ message: "Email and name are required" });
  }

  try {
    const result = await sendSimpleEmail({
      to: email,
      fullName,
    });

    if (result.success) {
      return res.status(200).json({ message: "Email sent successfully" });
    } else {
      return res.status(500).json({ message: "Failed to send email", error: result.error });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unexpected error", error: err.message });
  }
};



exports.sendEmailToManagement = async (req, res) => {
  const { fullName, email, phone } = req.body;

  if (!email || !fullName) {
    return res.status(400).json({ message: "Full name and email are required" });
  }

  try {
    const result = await notifyManagement({ fullName, email, phone });

    if (result.success) {
      return res.status(200).json({ message: "Management notified successfully" });
    } else {
      return res.status(500).json({ message: "Failed to send notification", error: result.error });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unexpected error", error: err.message });
  }
};