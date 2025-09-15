import express from "express";
import { getDisplayNameDetails } from "../controllers/displayNameController.js";

const router = express.Router();

router.post("/", getDisplayNameDetails);

export default router;
