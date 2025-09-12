import express from "express";

const router = express.Router();

// ✅ Verification endpoint
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN; // put in .env

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ✅ Event listener endpoint
router.post("/", (req, res) => {
  try {
    console.log("📩 Webhook Event:", JSON.stringify(req.body, null, 2));

    // You can add DB save logic here later
    res.sendStatus(200); // must return 200 for Meta
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

export default router;
