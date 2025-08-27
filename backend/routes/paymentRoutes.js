import express from "express";
import { createPayment, getPayments, updatePayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", createPayment);       // Add new payment entry
router.get("/", getPayments);          // Get list of payments (filters: month, year, payer, payerType)
router.put("/:id", updatePayment);     // Update payment (add new amount, update status)

export default router;
