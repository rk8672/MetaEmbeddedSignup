import express from "express";
import WhatsAppCredential from "../models/WhatsAppCredentialModel.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const GRAPH_API = process.env.GRAPH_API;
const META_TOKEN = process.env.META_ACCESS_TOKEN;

// Get all credentials for logged-in user
router.get("/credentials", async (req, res) => {
  try {
    const credentials = await WhatsAppCredential.find({ user: req.user._id });
    res.json(credentials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Connect a phone number + trigger OTP
router.post("/verify/:id", async (req, res) => {
  try {
    const credential = await WhatsAppCredential.findById(req.params.id);
    if (!credential) return res.status(404).json({ message: "Credential not found" });

    // Meta API to initiate phone verification
    const response = await axios.post(
      `${GRAPH_API}/${credential.phoneNumberId}/verify_credentials`,
      {},
      { headers: { Authorization: `Bearer ${credential.accessToken}` } }
    );

    res.json({ message: "Phone verification triggered", data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to trigger verification" });
  }
});

// Poll Payment method status via Graph API
router.get("/payment-status/:id", async (req, res) => {
  try {
    const credential = await WhatsAppCredential.findById(req.params.id);
    if (!credential) return res.status(404).json({ message: "Credential not found" });

    const response = await axios.get(
      `${GRAPH_API}/${credential.phoneNumberId}?fields=business_payment_method`,
      { headers: { Authorization: `Bearer ${credential.accessToken}` } }
    );

    credential.paymentMethodStatus = response.data.business_payment_method ? "ATTACHED" : "NOT_ATTACHED";
    await credential.save();

    res.json({ paymentMethodStatus: credential.paymentMethodStatus });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch payment status" });
  }
});

// Optional: trigger display name request
router.post("/display-name/:id", async (req, res) => {
  try {
    const { displayName } = req.body;
    const credential = await WhatsAppCredential.findById(req.params.id);
    if (!credential) return res.status(404).json({ message: "Credential not found" });

    const response = await axios.post(
      `${GRAPH_API}/${credential.phoneNumberId}/display_names`,
      { display_name: displayName },
      { headers: { Authorization: `Bearer ${credential.accessToken}` } }
    );

    credential.displayName = displayName;
    credential.displayNameStatus = "PENDING";
    await credential.save();

    res.json({ message: "Display name requested", data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to request display name" });
  }
});

export default router;
