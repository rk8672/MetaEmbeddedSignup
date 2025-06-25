const OrgUser = require('../models/OrgUser_Model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

exports.loginOrgUser = async (req, res) => {
  
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "Email/Phone and password are required" });
    }

    // Find user by email or phone
    const user = await OrgUser.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "User not found with provided email or phone" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

   const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    organizationId: user.organizationId, // ✅ required for protected routes
  },
  process.env.SECRET_KEY,
  { expiresIn: '1d' }
);

   res.status(200).json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    organizationId: user.organizationId, // optional: for frontend logic
  }
});

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
