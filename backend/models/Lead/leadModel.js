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
    "new",           // 1. Just registered (form submitted)
    "mentor-assigned",    // 2. Mentor/executive assigned
    "mentor-in-contact",  // 3. Mentor has reached out or is in contact
    "payment-link-sent",  // 4. Payment (Razorpay) link sent
    "payment-done",       // 5. Payment received
    "enrolled",           // 6. Enrollment confirmed, ready to start
    "not-interested"      // Rejected or unresponsive after follow-ups
  ],
  default: "new",
},
   priorityStatus: {
      type: String,
      enum: ["hot", "warm", "cold", "dead"],
      
    },
        // ✅ Multiple payment links
   paymentLinks: [
  {
    linkId: { type: String, index: true },       // Internal link ID
    razorpayLinkId: { type: String, index: true }, // Razorpay Payment Link ID
    orderId: { type: String, index: true },      // Razorpay Order ID
    amount: Number,
    status: {
      type: String,
      enum: ["created", "paid", "expired"],
      default: "created"
    },
    contact: { type: String },   // Add this to store student mobile/contact
    createdAt: { type: Date, default: Date.now }
  }
],
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
