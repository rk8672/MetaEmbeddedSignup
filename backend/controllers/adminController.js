import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register new admin
// @route   POST /api/admin/register
export const registerAdmin = async (req, res) => {
  try {
    const { name, mobile, email, password, role } = req.body;

    const adminExists = await Admin.findOne({ mobile });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ name, mobile, email, password, role });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      mobile: admin.mobile,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const admin = await Admin.findOne({ mobile });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        user:{ _id: admin._id,
        name: admin.name,
        mobile: admin.mobile,
        email: admin.email,
        role: admin.role,},
       
        token: generateToken(admin._id, admin.role),
      });
    } else {
      res.status(401).json({ message: "Invalid mobile or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profile
// @route   GET /api/admin/profile
// @access  Private
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
