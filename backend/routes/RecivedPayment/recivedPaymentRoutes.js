const express = require("express");
const router = express.Router();
const { attachPaymentToLead } = require("../../controllers/RecivedPayment/paymentRecived");

router.post("/attach", attachPaymentToLead);

module.exports = router;
