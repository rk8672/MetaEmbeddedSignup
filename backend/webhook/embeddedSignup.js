import express from "express";
import axios from "axios";

const router = express.Router();

const META_APP_ID = "1161878365754956";  
const META_APP_SECRET = "038095ebcbb2ac866ae993a20b0e1b73"; 

router.get("/exchange-token", async (req, res) => {
  const { waba_id, phone_number_id } = req.query;
  if (!waba_id || !phone_number_id)
    return res.status(400).json({ success: false, error: "Missing IDs" });

  try {
    // Exchange for permanent access token
    const response = await axios.get(
      `https://graph.facebook.com/v20.0/${waba_id}`,
      {
        params: {
          fields: "id,name",
          access_token: `${META_APP_ID}|${META_APP_SECRET}`,
        },
      }
    );

    // For simplicity, just return a dummy token here
    const access_token = `ACCESS_TOKEN_FOR_${waba_id}`;
    res.json({ success: true, access_token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
