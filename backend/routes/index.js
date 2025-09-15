import express from "express";
import userRoutes from "./userRoutes.js";
import WhatsAppCredentialRoute from "./whatsappCredentialRoutes.js";
import webhookRouter from "../webhook/webhook.js"; 
import detailsRoutes from "./detailsRoutes.js"; 
import displayNameRoutes from "./displayNameRoutes.js"; 
import mobileVerificationRoutes from "./mobileVerificationRoutes.js"; 

import embeddedSignup from "../webhook/embeddedSignup.js"; 




const router = express.Router();

// User routes
router.use("/users", userRoutes);

// WhatsApp credentials routes
router.use("/whatsapp", WhatsAppCredentialRoute);

// Webhook routes
router.use("/webhook", webhookRouter);

router.use("/embeddedSignup", embeddedSignup);

router.use("/details", detailsRoutes);

router.use("/displayName", displayNameRoutes);


router.use("/verification", mobileVerificationRoutes);


export default router;
