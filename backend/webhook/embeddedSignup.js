import express from "express";
import axios from "axios";

const router = express.Router();

const META_APP_ID = "1161878365754956";  
const META_APP_SECRET = "038095ebcbb2ac866ae993a20b0e1b73"; 

router.get("/exchange-token", async (req, res) => {
  const { code } = req.query; // The code returned by Embedded Signup
  if (!code) return res.status(400).json({ success: false, error: "Missing code" });

  try {
    // Step 1: Exchange code for a business token
    const tokenResponse = await axios.get("https://graph.facebook.com/v21.0/oauth/access_token", {
      params: {
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        code,
      },
    });

    const businessToken = tokenResponse.data.access_token;

 

    res.json({ success: true, access_token: businessToken });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

export default router;
