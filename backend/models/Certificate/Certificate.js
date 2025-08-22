const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    certificateNumber: { type: String, required: true, unique: true },
    publicLink: { type: String, required: true }, // Google Drive public link
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
