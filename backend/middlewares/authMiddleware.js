const jwt = require("jsonwebtoken");
const User = require("../models/User/User");

// Auth required
exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Access denied: Admins only" });
  next();
};

// Staff only
exports.staffOnly = (req, res, next) => {
  if (req.user?.role !== "staff")
    return res.status(403).json({ message: "Access denied: Staff only" });
  next();
};
