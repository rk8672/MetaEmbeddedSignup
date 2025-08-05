const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: "CyberVie Form",
  },
  status: {
    type: String,
    enum: ["new", "in-progress", "converted", "rejected"],
    default: "new",
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lead", leadSchema);
