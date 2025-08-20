const Transaction = require("../../models/RazorpayTransections/Transaction");

/**
 * @desc    Get all transactions with pagination & optional filters
 * @route   GET /api/transactions
 * @access  Public / Admin
 */
exports.getTransactions = async (req, res) => {
  try {
    let { page = 1, limit = 10, status, method } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // Build filters
    const filter = {};
    if (status) filter.status = status;
    if (method) filter.method = method;

    // Count total docs
    const total = await Transaction.countDocuments(filter);

    // Fetch paginated data
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching transactions",
    });
  }
};
