import Shop from "../models/ShopModel.js";
import Building from "../models/Buildingmodel.js";

// ✅ Create Shop
export const createShop = async (req, res) => {
  try {
    const {
      building,       // building ID
      shopNumber,
      floor,
      tenant,
      rentAmount,
      securityDeposit,
      leasePeriod,
      isOccupied,
      businessType,
      gstNumber,
      utilities,
      notes,
    } = req.body;

    // Create Shop with controlled fields
    const shop = new Shop({
      building,
      shopNumber,
      floor,
      tenant,
      rentAmount,
      securityDeposit,
      leasePeriod,
      isOccupied,
      businessType,
      gstNumber,
      utilities,
      notes,
    });

    await shop.save();

    // Push Shop reference into Building
    await Building.findByIdAndUpdate(building, {
      $push: { shops: shop._id },
    });

    res.status(201).json({ success: true, data: shop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get all Shops
export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json({ success: true, data: shops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get single Shop by ID
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    res.status(200).json({ success: true, data: shop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update Shop
export const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    res.status(200).json({ success: true, data: shop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Delete Shop
export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    res.status(200).json({ success: true, message: "Shop deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
