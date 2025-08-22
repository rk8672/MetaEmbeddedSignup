const mongoose = require("mongoose");
const Lead = require("../../models/Lead/leadModel");
const User = require("../../models/User/User");
const { sendSimpleEmail } = require("../../services/firstWelcomeMail");
const { notifyManagement } = require("../../services/firstNotifyManagement");

const STATUS_LIST = [
    "new",           // 1. Just registered (form submitted)
    "mentor-assigned",    // 2. Mentor/executive assigned
    "mentor-in-contact",  // 3. Mentor has reached out or is in contact
    "payment-link-sent",  // 4. Payment (Razorpay) link sent
    "payment-done",       // 5. Payment received
    "enrolled",           // 6. Enrollment confirmed, ready to start
    "not-interested"      // Rejected or unresponsive after follow-ups
  ]

// Create a new lead

exports.createLead = async (req, res) => {
  try {
    const { fullName, email, mobile } = req.body;

    // Basic server-side validations
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ message: "Full name must be at least 2 characters long." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobile || !mobileRegex.test(mobile.trim())) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
    }

    // Check for duplicate leads by email or phone
    const existingLead = await Lead.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { phone: mobile.trim() }
      ]
    });

    if (existingLead) {
      return res.status(409).json({
        message: "This email or phone number has already been submitted.",
      });
    }

    // Sanitize input and save new lead
 const sanitizedLead = new Lead({
  fullName: fullName.trim(),
  email: email.trim().toLowerCase(),
  mobile: mobile.trim(),
  courseInterested: req.body.courseInterested?.trim(), 
});

    await sanitizedLead.save();

    // Send confirmation email to student (non-blocking)
    sendSimpleEmail({
      to: sanitizedLead.email,
      fullName: sanitizedLead.fullName,
    }).catch((error) => {
      console.error("❌ Error sending confirmation email:", error);
    });

    // Notify management team (non-blocking)
    notifyManagement({
      fullName: sanitizedLead.fullName,
      email: sanitizedLead.email,
      mobile: sanitizedLead.mobile,
    }).catch((error) => {
      console.error("❌ Error notifying management:", error);
    });

    return res.status(201).json({
      message: "Lead submitted successfully.",
      data: sanitizedLead,
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
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
     .populate("payments", "transactionId amount date notes")

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

// Get only enrolled leads
exports.getEnrolledLeads = async (req, res) => {
  try {
    const enrolledLeads = await Lead.find({ status: "enrolled" })
     .select("fullName") 
      .sort({ fullName: 1 });

    res.status(200).json(enrolledLeads); 
    // Example response: [{ "name": "John Doe" }, { "name": "Jane Smith" }]
  } catch (err) {
    console.error("Error fetching enrolled leads:", err);
    res.status(500).json({ message: "Failed to fetch enrolled leads", error: err.message });
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
    const isFirstFollowUp = lead.followUps.length === 0;

    lead.followUps.push({
      note,
      status,
      createdBy,
      date: new Date()
    });
  if (isFirstFollowUp) {
      lead.status = "mentor-in-contact";
    }
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

// Update only priorityStatus
exports.updatePriorityStatus = async (req, res) => {
  try {
    const { priorityStatus } = req.body;

    // Validate input
    const allowedStatuses = ["hot", "warm", "cold", "dead"];
    if (!allowedStatuses.includes(priorityStatus)) {
      return res.status(400).json({
        message: `Invalid priorityStatus. Must be one of: ${allowedStatuses.join(", ")}`
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { priorityStatus },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({
      message: "Priority status updated successfully",
      data: lead
    });
  } catch (err) {
    console.error("Error updating priority status:", err);
    res.status(500).json({ message: "Failed to update priority status", error: err.message });
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
      { assignedStaff: staffId,
         status: "mentor-assigned",
       },
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
      Lead.aggregate([
        // Ensure status exists and normalize
        {
          $addFields: {
            statusNormalized: {
              $toLower: { $ifNull: ["$status", "new"] },
            },
          },
        },
        // Replace spaces with hyphens
        {
          $addFields: {
            statusNormalized: {
              $replaceAll: {
                input: "$statusNormalized",
                find: " ",
                replacement: "-",
              },
            },
          },
        },
        // Map old/legacy statuses to new ones
        {
          $addFields: {
            statusNormalized: {
              $switch: {
                branches: [
                  { case: { $in: ["$statusNormalized", ["assigned", "mentor-assigned"]] }, then: "mentor-assigned" },
                  { case: { $in: ["$statusNormalized", ["in-contact", "mentor-in-contact"]] }, then: "mentor-in-contact" },
                  { case: { $eq: ["$statusNormalized", "follow-up"] }, then: "mentor-in-contact" },
                  { case: { $in: ["$statusNormalized", ["payment-sent", "payment-link-sent"]] }, then: "payment-link-sent" },
                  { case: { $in: ["$statusNormalized", ["payment-done", "paid"]] }, then: "payment-done" },
                  { case: { $eq: ["$statusNormalized", "enrolled"] }, then: "enrolled" },
                  { case: { $eq: ["$statusNormalized", "not-interested"] }, then: "not-interested" },
                  { case: { $eq: ["$statusNormalized", "new"] }, then: "new" },
                ],
                default: "new",
              },
            },
          },
        },
        // Group by normalized status
        {
          $group: {
            _id: "$statusNormalized",
            count: { $sum: 1 },
          },
        },
      ]),

      // Count total staff
      User.countDocuments({ role: "staff" }),
    ]);

    // Calculate total leads
    const totalLeads = leadCounts.reduce((acc, curr) => acc + curr.count, 0);

    // Fill all statuses with default 0
    const statusBreakdown = STATUS_LIST.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    // Populate actual counts
    for (const { _id, count } of leadCounts) {
      if (_id in statusBreakdown) statusBreakdown[_id] = count;
    }

    res.status(200).json({ totalLeads, totalStaff, statusBreakdown });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};