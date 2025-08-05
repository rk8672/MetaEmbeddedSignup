const express = require("express");
const router = express.Router();
const authController = require("../../controllers/User/authController");
const { protect, adminOnly } = require("../../middlewares/authMiddleware");

// Register main admin (one-time)
router.post("/admin/register", authController.registerAdmin);

// Login for both admin & telecaller
router.post("/login", authController.login);

// Admin creates telecaller
router.post("/staff/create", protect, adminOnly, authController.createTelecaller);

// Only admins can get staff list
router.get('/staff', authController.getAllStaff);

module.exports = router;
