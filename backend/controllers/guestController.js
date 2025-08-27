import mongoose from "mongoose";

import Guest from "../models/GuestModel.js";
import Payment from "../models/PaymentModel.js";
import Room from "../models/RoomModel.js";   // assuming you have a Room model
import Building from "../models/Buildingmodel.js"; // assuming you have a Building model

// ➕ Create Guest
export const createGuest = async (req, res) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    res.status(201).json({ success: true, data: guest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 📖 Get All Guests

// 📖 Get All Guests (List View)
export const getGuests = async (req, res) => {
  try {
    const { status } = req.query; // optional filter: paid/unpaid/partial

    let pipeline = [
      // Lookup Room
      { $lookup: { from: "rooms", localField: "allottedRoom", foreignField: "_id", as: "room" } },
      { $unwind: { path: "$room", preserveNullAndEmptyArrays: true } },

      // Lookup Building
      { $lookup: { from: "buildings", localField: "room.building", foreignField: "_id", as: "building" } },
      { $unwind: { path: "$building", preserveNullAndEmptyArrays: true } },

      // Latest Payment
      {
        $lookup: {
          from: "payments",
          let: { guestId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$payer", "$$guestId"] }, { $eq: ["$payerType", "Guest"] }] } } },
            { $sort: { year: -1, month: -1 } },
            { $limit: 1 },
          ],
          as: "latestPayment",
        },
      },
      { $unwind: { path: "$latestPayment", preserveNullAndEmptyArrays: true } },

      // Computed fields
      {
        $addFields: {
          buildingName: "$building.name",
          roomNumber: "$room.roomNumber",
          expectedRent: "$rentAmount",
          latestStatus: "$latestPayment.status",
          latestPaidAmount: "$latestPayment.paidAmount",
          dueAmount: { $subtract: ["$rentAmount", { $ifNull: ["$latestPayment.paidAmount", 0] }] },
        },
      },
      {
        $project: {
          name: 1,
          mobileNumber: 1,
          buildingName: 1,
          roomNumber: 1,
          expectedRent: 1,
          latestStatus: 1,
          latestPaidAmount: 1,
          dueAmount: 1,
        },
      },
    ];

    const guests = await Guest.aggregate(pipeline);

    // ✅ Apply filter (paid / unpaid / partial)
    let filtered = guests;
    if (status === "paid") {
      filtered = guests.filter((g) => g.latestStatus === "paid" && g.dueAmount <= 0);
    } else if (status === "unpaid") {
      filtered = guests.filter((g) => !g.latestStatus || g.latestStatus === "unpaid" || g.dueAmount > 0);
    } else if (status === "partial") {
      filtered = guests.filter((g) => g.latestStatus === "partial");
    }

    res.json({ success: true, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📖 Get Guest by ID
export const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: "Guest not found" });
    res.json({ success: true, data: guest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📖 Get Guest + Full Payment History
export const getGuestWithHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const guest = await Guest.findById(id)
      .populate("allottedRoom", "roomNumber building")
      .lean();

    if (!guest) return res.status(404).json({ success: false, message: "Guest not found" });

    // Get building info
    let building = null;
    if (guest.allottedRoom?.building) {
      building = await Building.findById(guest.allottedRoom.building).lean();
    }

    // Get all payments
    const payments = await Payment.find({ payer: id, payerType: "Guest" }).sort({ year: -1, month: -1 }).lean();

    res.json({
      success: true,
      data: {
        ...guest,
        buildingName: building?.name || null,
        roomNumber: guest.allottedRoom?.roomNumber || null,
        payments,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// 📖 Get Guests by Room (only _id + name)
export const getGuestsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ success: false, message: "Room ID is required" });
    }

    // Find only guests in that room, return id + name
    const guests = await Guest.find(
      { allottedRoom: new mongoose.Types.ObjectId(roomId) },
      { _id: 1, name: 1 }
    );

    res.json({ success: true, data: guests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// ✏️ Update Guest
export const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!guest) return res.status(404).json({ success: false, message: "Guest not found" });
    res.json({ success: true, data: guest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ❌ Delete Guest
export const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: "Guest not found" });
    res.json({ success: true, message: "Guest deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
