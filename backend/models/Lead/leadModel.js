const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    courseInterested: {
      type: String,
      trim: true,
    },
    source: {
      type: String, // e.g. "WhatsApp", "Facebook", "Flyer", "Referral"
      trim: true,
    },

status: {
  type: String,
  enum: [
    "new",               // Just registered or form submitted
    "assigned",          // Assigned to an executive, no contact yet
    "in-progress",       // Executive has started contacting/following up
    "payment-link-sent", // Payment link shared
    "payment-done",      // Payment received
    "enrolled",          // Fully enrolled
    "not-interested"     // Clearly rejected or unresponsive after follow-ups
  ],
  default: "new",
},

    // Assigned telecaller
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],

    enrollment: {
      enrolledDate: Date,
      remarks: String,
      batch: String,
    },

    // Follow-up history with notes
    followUps: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          trim: true,
        },
        statusAtTime: {
          type: String,
          enum: [
            "new", "assigned", "contacted", "follow-up",
            "interested", "payment-sent", "enrolled", 
            "not-interested", "dropped"
          ],
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
leadSchema.index({ mobile: 1 }, { unique: true });
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedStaff: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Lead", leadSchema);
