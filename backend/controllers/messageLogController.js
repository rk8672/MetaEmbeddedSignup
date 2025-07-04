const MessageLog = require('../models/MessageLog');

// GET /api/message
exports.getMessageLogs = async (req, res) => {
  try {
    const {
      direction,
      fromDate,
      toDate,
      page = 1,
      limit = 20
    } = req.query;

    // 🔐 Normally from auth middleware, hardcoded for testing
    const organizationId = req.user?.organizationId || '6858dd76ea3226c96d2cb67f';
    
    if (!organizationId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: No organization context'
      });
    }

    const filter = { organizationId };

    if (direction) {
      filter.direction = direction;
    }

    if (fromDate || toDate) {
      filter.timeStamp = {};
      if (fromDate) filter.timeStamp.$gte = new Date(fromDate);
      if (toDate) filter.timeStamp.$lte = new Date(toDate);
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const message = await MessageLog.find(filter)
      .sort({ timeStamp: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate('whatsappAccountId', 'phoneNumberId'); // ✅ Works now

    const total = await MessageLog.countDocuments(filter);

    res.json({
      success: true,
      page: pageNumber,
      limit: limitNumber,
      total,
      message
    });

  } catch (err) {
    console.error('❌ getMessageLogs Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};
