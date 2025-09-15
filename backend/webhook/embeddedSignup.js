import express from "express";
import axios from "axios";

const router = express.Router();

// Hardcoded App Credentials (replace with your own)
const META_APP_ID = "1161878365754956";   // RK Test APP ID
const META_APP_SECRET = "038095ebcbb2ac866ae993a20b0e1b73"; // copy from Meta app settings
const REDIRECT_URI = "https://metaembeddedsignup-backend.onrender.com/api/webhook"; // must match Meta app

// Redirect URI endpoint for embedded signup
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("❌ Missing authorization code");
  }

  try {
    // Exchange code for access token
    const response = await axios.get("https://graph.facebook.com/v20.0/oauth/access_token", {
      params: {
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      },
    });

    const { access_token } = response.data;

    // Return token in response
    res.json({
      success: true,
      access_token,
    });
  } catch (err) {
    console.error("⚠️ Embedded signup error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});

export default router;
