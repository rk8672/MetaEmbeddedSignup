import Building from "../models/Buildingmodel.js";
import Room from "../models/RoomModel.js";
import Guest from "../models/GuestModel.js";
import Payment from "../models/PaymentModel.js";
import Shop from "../models/ShopModel.js";
import mongoose from "mongoose";

export const getDashboardOverview = async (req, res) => {
  try {
    // Total buildings
    const totalBuildings = await Building.countDocuments();

    // Total rooms and occupied vs vacant
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ isOccupied: true });
    const vacantRooms = totalRooms - occupiedRooms;

    // Total shops and occupied vs vacant
    const totalShops = await Shop.countDocuments();
    const occupiedShops = await Shop.countDocuments({ isOccupied: true });
    const vacantShops = totalShops - occupiedShops;

    // Total guests and active guests
    const totalGuests = await Guest.countDocuments();
    const activeGuests = await Guest.countDocuments({ status: "active" });

    // Rent summary for current month
    const today = new Date();
    const month = today.getMonth() + 1; // Jan=0
    const year = today.getFullYear();

    const payments = await Payment.aggregate([
      { $match: { month, year } },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$paidAmount" },
          expectedAmount: { $sum: "$rentAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Format payment summary
    const paymentSummary = {
      paid: 0,
      partial: 0,
      unpaid: 0,
      overdue: 0,
      totalExpected: 0,
    };
    payments.forEach((p) => {
      paymentSummary[p._id] = p.totalAmount;
      paymentSummary.totalExpected += p.expectedAmount;
    });

    // Build response
    const dashboardData = {
      buildings: totalBuildings,
      rooms: {
        total: totalRooms,
        occupied: occupiedRooms,
        vacant: vacantRooms,
      },
      shops: {
        total: totalShops,
        occupied: occupiedShops,
        vacant: vacantShops,
      },
      guests: {
        total: totalGuests,
        active: activeGuests,
      },
      payments: paymentSummary,
    };

    return res.status(200).json({
      responseCode: "00",
      responseMessage: "Dashboard data fetched successfully",
      response: dashboardData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      responseCode: "99",
      responseMessage: "Server Error",
      error: error.message,
    });
  }
};
