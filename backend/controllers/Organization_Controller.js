const mongoose = require("mongoose");
const Organization = require("../models/Organization_Model");
const OrganizationAccount = require("../models/OrganizationAccount_Model");
const OrgUser = require("../models/OrgUser_Model");

// Helper to generate unique ID like MT0001
async function generateUniqueOrgId() {
  const count = await OrganizationAccount.countDocuments();
  return `MT${(count + 1).toString().padStart(4, "0")}`;
}

exports.registerOrganization = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address,
      organizationType,
      logo,
      subscriptionPlan = "free",
      adminName,
      adminEmail,
      adminPassword,
    } = req.body;

    // Check for existing email conflicts
    const [existingOrg, existingAdmin] = await Promise.all([
      Organization.findOne({ email }).lean(),
      OrgUser.findOne({ email: adminEmail }).lean(),
    ]);

    if (existingOrg) {
      return res.status(409).json({ message: "Organization email already exists" });
    }
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin email already exists" });
    }

    const registrationNumber = await generateUniqueOrgId();

    // Create organization
    const newOrg = await Organization.create([{
      name,
      contactPerson,
      email,
      phone,
      address,
      organizationType,
      logo,
      subscriptionPlan,
      registrationNumber,
    }], { session });

    // Create organization account
    await OrganizationAccount.create([{
      organizationId: newOrg[0]._id,
      registrationNumber,
      subscription: {
        plan: subscriptionPlan,
      },
    }], { session });

    // Create admin user
    await OrgUser.create([{
      organizationId: newOrg[0]._id,
      role: "admin",
      name: adminName,
      email: adminEmail,
      phone: phone, // optional: or a separate admin phone
      password: adminPassword,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Organization and admin registered successfully",
      organizationId: newOrg[0]._id,
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Registration Error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
};
