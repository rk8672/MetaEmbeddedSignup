const express = require("express");
const Transactions = require("../../controllers/Transaction/transactionController");

const router = express.Router();

// GET /api/transactions?page=1&limit=10&status=captured&method=upi
router.get("/", Transactions.getTransactions);

module.exports = router;
