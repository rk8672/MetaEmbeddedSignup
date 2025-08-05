const express = require("express");
const router = express.Router();
const { sendEmailToLead } = require("../../controllers/Email/emailController");
const {sendPaymentLink } = require("../../controllers/Email/paymentController");


router.post("/send-to-lead", sendEmailToLead);
router.post("/send-payment-link", sendPaymentLink);
module.exports = router;
