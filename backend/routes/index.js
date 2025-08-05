const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware");



const userRoutes=require("../routes/User/authRoutes");
router.use("/user", userRoutes);



const leadRoutes=require("../routes/Lead/leadRoutes");
router.use("/leads", leadRoutes);


router.use(protect);


const emailRoutes=require("../routes/Email/emailRoutes");
router.use("/email", emailRoutes);

const recivedPaymentRoutes=require("../routes/RecivedPayment/recivedPaymentRoutes");
router.use("/payments", recivedPaymentRoutes);






module.exports = router;