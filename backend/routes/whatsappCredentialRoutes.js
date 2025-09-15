import express from "express";
import { addWhatsAppCredential, getMyWhatsAppCredentials } from "../controllers/whatsappCredentialController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addWhatsAppCredential);
router.get("/credentials", protect, getMyWhatsAppCredentials);

export default router;