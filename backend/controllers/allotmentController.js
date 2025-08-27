import Guest from "../models/GuestModel.js";
import Room from "../models/RoomModel.js";
import Shop from "../models/ShopModel.js";
import ShopTenant from "../models/ShopTenantModel.js";

/**
 * ✅ Allot Room to Guest
 */
export const allotRoomToGuest = async (req, res) => {
  try {
    const { guestId, roomId } = req.params;

    // Find guest & room
    const guest = await Guest.findById(guestId);
    const room = await Room.findById(roomId);

    if (!guest) return res.status(404).json({ success: false, message: "Guest not found" });
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    // Check if room is already full
    if (room.isOccupied && room.tenants.length >= room.capacity) {
      return res.status(400).json({ success: false, message: "Room is already full" });
    }

    // Update guest & room
    guest.allottedRoom = room._id;
    await guest.save();

    room.tenants.push(guest._id);
    room.isOccupied = room.tenants.length >= room.capacity;
    await room.save();

    res.json({
      success: true,
      message: "Room allotted successfully",
      data: { guest, room },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ✅ Allot Shop to ShopTenant
 */
export const allotShopToTenant = async (req, res) => {
  try {
    const { tenantId, shopId } = req.params;

    // Find tenant & shop
    const tenant = await ShopTenant.findById(tenantId);
    const shop = await Shop.findById(shopId);

    if (!tenant) return res.status(404).json({ success: false, message: "ShopTenant not found" });
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

    // Check if shop is already occupied
    if (shop.isOccupied) {
      return res.status(400).json({ success: false, message: "Shop is already occupied" });
    }

    // Update tenant & shop
    tenant.allottedShop = shop._id;
    await tenant.save();

    shop.tenant = tenant._id;
    shop.isOccupied = true;
    await shop.save();

    res.json({
      success: true,
      message: "Shop allotted successfully",
      data: { tenant, shop },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
