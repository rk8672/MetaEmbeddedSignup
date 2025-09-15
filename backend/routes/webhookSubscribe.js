import express from "express";
import {
  subscribeWebhook,
  getWebhookStatus,
  unsubscribeWebhook,
} from "../controllers/webhookSubscribeController.js";

const router = express.Router();

router.post("/subscribe", subscribeWebhook);

router.post("/status", getWebhookStatus);

router.post("/unsubscribe", unsubscribeWebhook);

export default router;
