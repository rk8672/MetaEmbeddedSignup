import express from "express";
import axios from "axios";
import WhatsAppCredential from "../models/WhatsAppCredentialModel.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();




const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;

router.post("/exchange-token",protect, async (req, res) => {
  const { code, wabaId, phoneNumberId, businessId } = req.body;
  if (!code || !wabaId || !phoneNumberId) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    // 1️⃣ Exchange code → get access token
    const tokenResponse = await axios.get(
      "https://graph.facebook.com/v21.0/oauth/access_token",
      {
        params: {
          client_id: META_APP_ID,
          client_secret: META_APP_SECRET,
          code,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2️⃣ Save credentials for logged-in user
   // Instead of findOne → check by phoneNumberId
const existing = await WhatsAppCredential.findOne({
  user: req.user._id,
  phoneNumberId,
});

if (existing) {
  // Update if same phone number already onboarded
  existing.wabaId = wabaId;
  existing.businessAccountId = businessId;
  existing.accessToken = accessToken;
  await existing.save();
  return res.json({ success: true, message: "Credentials updated", credential: existing });
}

// Else create new record
const credential = await WhatsAppCredential.create({
  user: req.user._id,
  wabaId,
  phoneNumberId,
  businessAccountId: businessId,
  accessToken,
});

res.json({ success: true, message: "New credentials saved", credential });
  } catch (err) {
    console.error("Token exchange error:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

export default router;
