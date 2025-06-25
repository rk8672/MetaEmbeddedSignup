const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const orgUserSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },

  role: {
    type: String,
    enum: ["admin","doctor","receptionist"],
    required: true,
  },

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  profileCompleted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

orgUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("OrgUser", orgUserSchema);
