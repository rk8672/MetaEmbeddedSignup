const OrgUser = require("../models/OrgUser_Model");
const Organization = require("../models/Organization_Model");

// Create new internal staff user
exports.createOrgUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Only allow if the user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can add staff." });
    }

    // Validate organizationId from token
    const organizationId = req.user.organizationId;

    const existingUser = await OrgUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const newUser = new OrgUser({
      name,
      email,
      phone,
      password,
      role, // optional: validate allowed roles here
      organizationId,
    });

    await newUser.save();

    res.status(201).json({
      message: "Organization user created successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organizationId: newUser.organizationId,
      },
    });
  } catch (error) {
    console.error("Error creating OrgUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all staff of an organization
exports.getAllOrgUsers = async (req, res) => {
  try {
    const orgUsers = await OrgUser.find({ organizationId: req.user.organizationId }).select("-password");
    res.json(orgUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};
