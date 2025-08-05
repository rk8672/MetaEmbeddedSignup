const User = require("../../models/User/User");
const jwt = require("jsonwebtoken");

// Helper to generate random password
const generateRandomPassword = () => {
  return crypto.randomBytes(4).toString("hex"); // 8-char password
};
// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
     { 
      id: user._id,
      role: user.role, 
      name: user.name,
      email: user.email
      },
    process.env.JWT_SECRET || "secretKey",
    { expiresIn: "7d" }
  );
};

// Admin Register (initial setup)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role: "admin" });
    res.status(201).json({
      message: "Admin registered",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
};

// Admin creates telecaller staff

exports.createTelecaller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already in use" });

    const plainPassword = password || generateRandomPassword();

    const user = await User.create({ name, email, password: plainPassword, role: "staff" });

    res.status(201).json({
      message: "Telecaller created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      credentials: {
        email: user.email,
        password: plainPassword, // Only shown once here
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating telecaller", error: err.message });
  }
};

// Login for both admin & telecaller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// GET /api/staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('name email phone'); // select only needed fields
    res.status(200).json({ staff });
  } catch (error) {
    console.error('Get Staff Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
