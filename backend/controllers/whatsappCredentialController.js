import WhatsAppCredential from "../models/WhatsAppCredentialModel.js";

// Attach WhatsApp credentials to a user
export const addWhatsAppCredential = async (req, res) => {
  try {
    const { wabaId, phoneNumberId, accessToken } = req.body;

    if (!wabaId || !phoneNumberId || !accessToken) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await WhatsAppCredential.findOne({ user: req.user._id });
    if (existing) {
      existing.wabaId = wabaId;
      existing.phoneNumberId = phoneNumberId;
      existing.accessToken = accessToken;
      await existing.save();
      return res.json({ message: "Credentials updated", credential: existing });
    }

    const credential = await WhatsAppCredential.create({
      user: req.user._id,
      wabaId,
      phoneNumberId,
      accessToken,
    });

    res.status(201).json({ message: "Credentials added", credential });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyWhatsAppCredentials = async (req, res) => {
  try {
    const credentials = await WhatsAppCredential.find({ user: req.user._id });
    res.json(credentials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};