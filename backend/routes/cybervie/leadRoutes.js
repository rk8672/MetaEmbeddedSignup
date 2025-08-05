const express = require("express");
const router = express.Router();
const leadController = require("../../controllers/cybervie/leadController");

router.post("/", leadController.createLead);
router.get("/", leadController.getAllLeads);
router.put("/:id", leadController.updateLead);
router.delete("/:id", leadController.deleteLead);

module.exports = router;