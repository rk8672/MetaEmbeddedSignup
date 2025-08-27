import mongoose from "mongoose";
import Building from "../models/Buildingmodel.js";
import Room from "../models/RoomModel.js";

// ➕ Create Building
export const createBuilding = async (req, res) => {
  try {
    const building = new Building(req.body);
    await building.save();
    res.status(201).json({ success: true, data: building });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 📖 Get all Buildings
export const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find();
    res.status(200).json({ success: true, data: buildings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📖 Get Building by ID with Rooms (Aggregation)
export const getBuildingById = async (req, res) => {
  try {
    const buildingId = req.params.id;

    const building = await Building.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(buildingId) } },

      // Lookup rooms of this building
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "building",
          as: "rooms",
        },
      },

      // Populate tenants inside each room
      {
        $lookup: {
          from: "guests",
          localField: "rooms._id",
          foreignField: "allottedRoom",
          as: "allGuests",
        },
      },
      {
        $addFields: {
          rooms: {
            $map: {
              input: "$rooms",
              as: "room",
              in: {
                $mergeObjects: [
                  "$$room",
                  {
                    tenants: {
                      $filter: {
                        input: "$allGuests",
                        as: "g",
                        cond: { $eq: ["$$g.allottedRoom", "$$room._id"] },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          allGuests: 0, // remove helper field
        },
      },
    ]);

    if (!building.length) {
      return res
        .status(404)
        .json({ success: false, message: "Building not found" });
    }

    res.status(200).json({ success: true, data: building[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📖 Get only building names
export const getBuildingNames = async (req, res) => {
  try {
    const buildings = await Building.find({}, { _id: 1, name: 1 });
    res.status(200).json({ success: true, data: buildings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📖 Get rooms of a building with available capacity
export const getBuildingRooms = async (req, res) => {
  try {
    const buildingId = req.params.id;

    const rooms = await Room.aggregate([
      { $match: { building: new mongoose.Types.ObjectId(buildingId) } },

      // Lookup guests allotted in this room
      {
        $lookup: {
          from: "guests",
          localField: "_id",
          foreignField: "allottedRoom",
          as: "guests",
        },
      },

      // Project available capacity
      {
        $project: {
          _id: 1,
          roomNumber: 1,
          capacity: 1,
          available: { $subtract: ["$capacity", { $size: "$guests" }] },
        },
      },
    ]);

    res.status(200).json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Building
export const updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!building) return res.status(404).json({ success: false, message: "Building not found" });
    res.status(200).json({ success: true, data: building });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ❌ Delete Building
export const deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndDelete(req.params.id);
    if (!building) return res.status(404).json({ success: false, message: "Building not found" });
    res.status(200).json({ success: true, message: "Building deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
