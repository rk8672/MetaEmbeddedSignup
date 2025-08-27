import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    totalFloors: { type: Number, default: 1, min: 1 },
    notes: { type: String, trim: true }, // optional lightweight info
  },
  { timestamps: true }
);

const Building = mongoose.model("Building", buildingSchema);
export default Building;
