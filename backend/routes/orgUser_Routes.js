const express = require("express");
const router = express.Router();
const { createOrgUser, getAllOrgUsers } = require("../controllers/orgUser_controller");
const  authenticateToken  = require("../middlewares/authMiddleware");

router.post("/orgusers", authenticateToken, createOrgUser); // Only logged-in admin can create
router.get("/orgusers", authenticateToken, getAllOrgUsers); // Get all staff

module.exports = router;
