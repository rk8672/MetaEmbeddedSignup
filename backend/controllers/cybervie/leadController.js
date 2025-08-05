const Lead = require("../../models/Lead/leadModel");

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
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

    if (req.query.status) filters.status = req.query.status;
    if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo;

    const leads = await Lead.find(filters).sort({ createdAt: -1 });
    res.status(200).json({ data: leads });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Failed to fetch leads", error: err.message });
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
