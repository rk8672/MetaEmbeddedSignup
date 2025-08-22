const express = require("express");
const router = express.Router();
const certificateController = require("../../controllers/certificate/certificateController");

// 1️⃣ Generate certificate number
router.post("/generate-number", certificateController.generateCertificateNumber);

// 2️⃣ Create/save certificate
router.post("/create", certificateController.createCertificate);

// 3️⃣ Get all certificates
router.get("/", certificateController.getCertificates);

module.exports = router;
