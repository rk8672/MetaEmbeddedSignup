const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware");



const userRoutes=require("../routes/User/authRoutes");
router.use("/user", userRoutes);



const leadRoutes=require("../routes/Lead/leadRoutes");
router.use("/leads", leadRoutes);

const transactionRoutes = require("../routes/Transaction/transactionRoutes");
router.use("/transactions", transactionRoutes);

router.use(protect);


const emailRoutes=require("../routes/Email/emailRoutes");
router.use("/email", emailRoutes);

const recivedPaymentRoutes=require("../routes/RecivedPayment/recivedPaymentRoutes");
router.use("/payments", recivedPaymentRoutes);

const certificateRoutes = require("../routes/certificate/certificateRoutes");
router.use("/certificates", certificateRoutes);




module.exports = router;