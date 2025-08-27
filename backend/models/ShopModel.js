import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    shopNumber: { type: String, required: true },
    floor: { type: Number },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopTenant",
    },

    rentAmount: { type: Number, required: true },
    securityDeposit: { type: Number, default: 0 },
    leasePeriod: { type: String },
    isOccupied: { type: Boolean, default: false },

    businessType: { type: String },
    gstNumber: { type: String },

    utilities: {
      electricity: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
    },

    notes: { type: String },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
