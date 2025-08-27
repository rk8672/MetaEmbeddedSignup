import mongoose from "mongoose";

const shopTenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shopName: { type: String, trim: true },
    businessType: { type: String, trim: true },
    mobileNumber: { type: String, required: true, unique: true, trim: true },
    address: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    allottedShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      default: null,
    },
  },
  { timestamps: true }
);


const ShopTenant = mongoose.model("ShopTenant", shopTenantSchema);
export default ShopTenant;
