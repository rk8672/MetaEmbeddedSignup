import express from "express";
import { getDisplayNameDetails } from "../controllers/displayNameController.js";

const router = express.Router();

// POST /api/details
router.post("/", getDisplayNameDetails);

export default router;
