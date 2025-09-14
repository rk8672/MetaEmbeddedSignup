import express from "express";
import { getWhatsappDetails } from "../controllers/detailsController.js";

const router = express.Router();

// POST /api/whatsapp/detail
router.post("/", getWhatsappDetails);

export default router;
