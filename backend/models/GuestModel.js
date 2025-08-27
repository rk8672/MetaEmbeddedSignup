import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, unique: true, trim: true },

    // Identity
    aadharNumber: { type: String, trim: true },
    permanentAddress: { type: String, trim: true },
    profession: { type: String, trim: true },
    officeAddress: { type: String, trim: true },

    // Room mapping
    allottedRoom: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },

    // Rental contract (important for reminders & due tracking)
    rentAmount: { type: Number, required: true }, // agreed monthly rent
    depositAmount: { type: Number, default: 0 },
    rentDueDay: { type: Number, default: null }, // e.g., rent due on 5th of each month
    joinDate: { type: Date, default: Date.now },
    leaveDate: { type: Date },

    status: {
      type: String,
      enum: ["active", "inactive", "left"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Guest = mongoose.model("Guest", guestSchema);
export default Guest;