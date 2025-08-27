import express from "express";
import { registerAdmin, loginAdmin, getAdminProfile } from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", getAdminProfile);

export default router;
