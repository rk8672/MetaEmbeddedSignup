const express = require("express");
const router = express.Router();
const leadController = require("../../controllers/Lead/leadController");
const {protect} =require("../../middlewares/authMiddleware");


// Create a new lead
router.post("/", leadController.createLead);

router.get("/check", leadController.getLeadByEmail);


router.use(protect);

// Get all leads
router.get("/", leadController.getAllLeads);

// Route to get only enrolled leads
router.get("/enrolled", leadController.getEnrolledLeads);

router.get("/dashboard", leadController.getDashboardOverview);
// Get a single lead by ID (optional but useful)
router.get("/:id", leadController.getLeadById);

// Update a lead (name, phone, email, status, notes, etc.)
router.put("/:id", leadController.updateLead);

// Delete a lead
router.delete("/:id", leadController.deleteLead);

// Only authenticated admin can assign
router.patch('/assign/:leadId', leadController.assignStaffToLead);

// POST /api/leads/:leadId/followup
router.post("/followup/:leadId", leadController.addFollowUp);

// Update only priorityStatus
router.patch("/:id/priority-status", leadController.updatePriorityStatus);




module.exports = router;
