const Certificate = require("../../models/Certificate/Certificate"); 
const Lead = require("../../models/Lead/leadModel"); // Lead model

const { v4: uuidv4 } = require("uuid");

// Generate certificate number in format YYMMDD-XXXXXX
exports.generateCertificateNumber = async (req, res) => {
  try {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(); // last 2 digits of year
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // month
    const dd = String(today.getDate()).padStart(2, "0"); // day

    const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit number

    const certificateNumber = `${yy}${mm}${dd}-${randomPart}`;

    res.status(200).json({ certificateNumber });
  } catch (err) {
    console.error("Certificate number generation error:", err);
    res.status(500).json({
      message: "Failed to generate certificate number",
      error: err.message,
    });
  }
};


// 2️⃣ Create a new certificate (after PDF generation & public link)
exports.createCertificate = async (req, res) => {
  try {
    const { leadId, name, date, certificateNumber, publicLink } = req.body;

    // Validate lead is enrolled
    const lead = await Lead.findById(leadId);
    if (!lead || lead.status !== "enrolled") {
      return res.status(400).json({ message: "Lead must be enrolled to generate certificate" });
    }

    const certificate = await Certificate.create({
      leadId,
      name,
      date,
      certificateNumber,
      publicLink,
    });

    res.status(201).json({ message: "Certificate created successfully", certificate });
  } catch (err) {
    console.error("Certificate creation error:", err);
    res.status(500).json({ message: "Failed to create certificate", error: err.message });
  }
};

// 3️⃣ Get all certificates
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("leadId", "name status")
      .sort({ createdAt: -1 }); // latest first
    res.status(200).json(certificates);
  } catch (err) {
    console.error("Get certificates error:", err);
    res.status(500).json({ message: "Failed to fetch certificates", error: err.message });
  }
};
