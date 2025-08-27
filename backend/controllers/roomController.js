import mongoose from "mongoose";
import Room from "../models/RoomModel.js";
import Building from "../models/Buildingmodel.js";
import Guest from "../models/GuestModel.js";

// ➕ Create Room
export const createRoom = async (req, res) => {
  try {
    const { building, roomNumber, floor, type, capacity, rentAmount, securityDeposit, notes } = req.body;

    const room = new Room({ building, roomNumber, floor, type, capacity, rentAmount, securityDeposit, notes });
    await room.save();

    res.status(201).json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 📖 Get all Rooms (with Building info + tenants dynamically)
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.aggregate([
      {
        $lookup: {
          from: "buildings",
          localField: "building",
          foreignField: "_id",
          as: "buildingInfo",
        },
      },
      { $unwind: "$buildingInfo" },
      {
        $lookup: {
          from: "guests",
          localField: "_id",
          foreignField: "allottedRoom",
          as: "tenants",
        },
      },
    ]);

    res.status(200).json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📖 Get single Room by ID (with Building + tenants)
export const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await Room.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(roomId) } },
      {
        $lookup: {
          from: "buildings",
          localField: "building",
          foreignField: "_id",
          as: "buildingInfo",
        },
      },
      { $unwind: "$buildingInfo" },
      {
        $lookup: {
          from: "guests",
          localField: "_id",
          foreignField: "allottedRoom",
          as: "tenants",
        },
      },
    ]);

    if (!room.length) return res.status(404).json({ success: false, message: "Room not found" });
    res.status(200).json({ success: true, data: room[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Room
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });
    res.status(200).json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ❌ Delete Room
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });
    res.status(200).json({ success: true, message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
