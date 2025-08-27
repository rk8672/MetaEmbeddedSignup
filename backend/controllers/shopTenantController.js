import ShopTenant from "../models/ShopTenantModel.js";

// ➕ Create Shop Tenant
export const createShopTenant = async (req, res) => {
  try {
    const tenant = new ShopTenant(req.body);
    await tenant.save();
    res.status(201).json({ success: true, data: tenant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 📖 Get All Shop Tenants
export const getShopTenants = async (req, res) => {
  try {
    const tenants = await ShopTenant.find();
    res.json({ success: true, data: tenants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📖 Get Shop Tenant by ID
export const getShopTenantById = async (req, res) => {
  try {
    const tenant = await ShopTenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });
    res.json({ success: true, data: tenant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Shop Tenant
export const updateShopTenant = async (req, res) => {
  try {
    const tenant = await ShopTenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });
    res.json({ success: true, data: tenant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ❌ Delete Shop Tenant
export const deleteShopTenant = async (req, res) => {
  try {
    const tenant = await ShopTenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });
    res.json({ success: true, message: "Tenant deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
