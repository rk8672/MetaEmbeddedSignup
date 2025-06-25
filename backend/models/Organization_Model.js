const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },

  organizationType: {
    type: String,
    enum: ['hospital', 'clinic', 'lab', 'dental_clinic', 'other'],
    required: true,
  },

  logo: { type: String }, // Optional logo URL

  subscriptionPlan: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free',
  },

  isActive: { type: Boolean, default: true },
  profileCompleted: { type: Boolean, default: false }, // Optional completion flag

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Organization', organizationSchema);
