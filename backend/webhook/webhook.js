import express from "express";
import IncomingMessage from "../models/IncomingMessage.js";
import MessageStatus from "../models/MessageStatus.js";

const router = express.Router();

// Verification endpoint
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log(" Webhook verified successfully");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  res.sendStatus(400);
});

//  Event listener endpoint
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    if (body.object && body.entry) {
      for (const entry of body.entry) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};

          // Handle Delivery Updates
          if (value.statuses) {
            for (const status of value.statuses) {
              console.log("📦 Delivery Update:", status);

              await MessageStatus.create({
                msgId: status.id,
                status: status.status,
                timestamp: status.timestamp,
              });
            }
          }

          // Handle Incoming Messages
          if (value.messages) {
            for (const msg of value.messages) {
              console.log(" Incoming Message:", msg);

              await IncomingMessage.create({
                msgId: msg.id,
                from: msg.from,
                type: msg.type,
                text: msg.text?.body || "",
                timestamp: msg.timestamp,
              });
            }
          }
        }
      }
    }

    // Always return 200 fast to avoid retries
    res.sendStatus(200);
  } catch (err) {
    console.error(" Webhook error:", err);
    res.sendStatus(500);
  }
});

export default router;
