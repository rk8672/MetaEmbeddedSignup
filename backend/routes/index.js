import express from "express";
import userRoutes from "./userRoutes.js";
import WhatsAppCredentialRoute from "./whatsappCredentialRoutes.js";
import webhookRouter from "../webhook/webhook.js"; // import your webhook

const router = express.Router();

// User routes
router.use("/users", userRoutes);

// WhatsApp credentials routes
router.use("/whatsapp", WhatsAppCredentialRoute);

// Webhook routes
router.use("/webhook", webhookRouter);

export default router;
