import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    building: { type: mongoose.Schema.Types.ObjectId, ref: "Building", required: true },
    roomNumber: { type: String, required: true },
    floor: { type: Number },
    type: { type: String, enum: ["single", "double", "shared"], default: "single" },
    capacity: { type: Number, default: 1 },
    rentAmount: { type: Number, },
    securityDeposit: { type: Number, },
    isOccupied: { type: Boolean, default: false },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
