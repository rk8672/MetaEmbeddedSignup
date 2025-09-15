import express from "express";
import { getWhatsappDetails } from "../controllers/detailsController.js";

const router = express.Router();


router.post("/", getWhatsappDetails);

export default router;
