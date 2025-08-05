const mongoose = require("mongoose");
const Lead = require("../../models/Lead/leadModel");
const User = require("../../models/User/User");
const { sendSimpleEmail } = require("../../services/firstWelcomeMail");
const STATUS_LIST = [
  "new",
  "assigned",
  "in-contact",
  "follow-up",
  "payment-sent",
  "enrolled",
  "not-interested",
];

// Create a new lead

exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();

    // Send confirmation email (non-blocking, runs in background)
    if (lead.email && lead.fullName) {
      sendSimpleEmail({
        to: lead.email,
        fullName: lead.fullName,
      }).catch((error) => {
        console.error("Error sending confirmation email:", error);
      });
    }

    res.status(201).json({ message: "Lead created successfully", data: lead });
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).json({ message: "Failed to create lead", error: err.message });
  }
};

exports.getLeadByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const lead = await Lead.findOne({ email: email.toLowerCase().trim() });
    if (!lead) return res.status(404).json({ message: "No lead found with this email" });

    res.status(200).json({ data: lead });
  } catch (err) {
    console.error("Error fetching lead by email:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all leads (optionally filter by status, assigned telecaller, etc.)
exports.getAllLeads = async (req, res) => {
  try {
    const filters = {};

    // ✅ Only show assigned leads to staff
    if (req.user.role === "staff") {
      filters.assignedStaff = req.user.id;
    }

    // ✅ Admin can optionally filter by status or assigned staff
    if (req.query.status) filters.status = req.query.status;
    if (req.user.role === "admin" && req.query.assignedTo) {
      filters.assignedStaff = req.query.assignedTo;
    }

    // ✅ Date filter (optional)
    if (req.query.fromDate || req.query.toDate) {
      filters.createdAt = {};
      if (req.query.fromDate)
        filters.createdAt.$gte = new Date(req.query.fromDate);
      if (req.query.toDate)
        filters.createdAt.$lte = new Date(req.query.toDate);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const leads = await Lead.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("assignedStaff", "name email")
      .populate("payments", "transactionId amount date notes");

    const formattedLeads = leads.map((lead) => ({
      ...lead.toObject(),
      assignedStaff: lead.assignedStaff
        ? lead.assignedStaff
        : { fullName: "Not Assigned", email: null },
    }));

    const total = await Lead.countDocuments(filters);

    res.status(200).json({
      data: formattedLeads,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Failed to fetch leads", error: err.message });
  }
};

// Add follow-up entry to a lead
exports.addFollowUp = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { note, status } = req.body;

    // Optional: You can get createdBy from auth middleware (req.user._id)
    const createdBy = req.user?._id || null; // Replace with actual user ID in real auth

    if (!note || !status) {
      return res.status(400).json({ message: "Note and statusAtTime are required" });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.followUps.push({
      note,
      status,
      createdBy,
      date: new Date()
    });

    await lead.save();

    res.status(200).json({
      message: "Follow-up added successfully",
      data: lead.followUps[lead.followUps.length - 1]
    });
  } catch (err) {
    console.error("Error adding follow-up:", err);
    res.status(500).json({ message: "Failed to add follow-up", error: err.message });
  }
};
// Get a single lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.status(200).json({ data: lead });
  } catch (err) {
    console.error("Error fetching lead:", err);
    res.status(500).json({ message: "Failed to fetch lead", error: err.message });
  }
};

// Update a lead (status, assignedTo, notes, paymentDetails, etc.)
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.status(200).json({ message: "Lead updated successfully", data: lead });
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({ message: "Failed to update lead", error: err.message });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ message: "Failed to delete lead", error: err.message });
  }
};



exports.assignStaffToLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { staffId } = req.body;

    // console.log("Assign API hit");
    // console.log("leadId:", leadId);
    // console.log("staffId:", staffId);

    if (!mongoose.Types.ObjectId.isValid(leadId))
      return res.status(400).json({ message: "Invalid Lead ID" });

    if (!mongoose.Types.ObjectId.isValid(staffId))
      return res.status(400).json({ message: "Invalid Staff ID" });

    const staff = await User.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      { assignedStaff: staffId },
      { new: true }
    ).populate("assignedStaff", "name email");

    if (!updatedLead)
      return res.status(404).json({ message: "Lead not found" });

    res.status(200).json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error("Assign staff error:", error); // THIS should print the real bug
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getDashboardOverview = async (req, res) => {
  try {
    const [leadCounts, totalStaff] = await Promise.all([
      // Group leads by status
      Lead.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Count staff
      User.countDocuments({ role: "staff" }),
    ]);

    // Total leads
    const totalLeads = leadCounts.reduce((acc, curr) => acc + curr.count, 0);

    // Initialize all statuses with 0
    const statusBreakdown = STATUS_LIST.reduce((obj, status) => {
      obj[status] = 0;
      return obj;
    }, {});

    // Update with actual counts
    leadCounts.forEach((item) => {
      if (statusBreakdown.hasOwnProperty(item._id)) {
        statusBreakdown[item._id] = item.count;
      }
    });

    res.status(200).json({
      totalLeads,
      totalStaff,
      statusBreakdown,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
