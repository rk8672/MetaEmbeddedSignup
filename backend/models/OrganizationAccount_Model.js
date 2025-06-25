const mongoose = require("mongoose");

const organizationAccountSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    unique: true,
  },

  subscription: {
    plan: { type: String, enum: ["free", "premium", "enterprise"], default: "free" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },

  usageStats: {
    totalPatients: { type: Number, default: 0 },
    monthlyVisits: { type: Number, default: 0 },
  },

  status: {
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrganizationAccount", organizationAccountSchema);
