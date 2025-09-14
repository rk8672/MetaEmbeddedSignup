import express from "express";
import { requestMobileOTP, verifyMobileOTP } from "../controllers/mobileVerificationController.js";

const router = express.Router();

// Request OTP
router.post("/request-otp", requestMobileOTP);

// Verify OTP
router.post("/verify-otp", verifyMobileOTP);

export default router;
