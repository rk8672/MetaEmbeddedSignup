import express from "express";
import {
  createBuilding,
  getBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
  getBuildingNames,
  getBuildingRooms
} from "../controllers/buildingController.js";

const router = express.Router();

// CRUD Routes
router.post("/", createBuilding);
router.get("/", getBuildings);
router.get("/:id", getBuildingById);
router.put("/:id", updateBuilding);
router.delete("/:id", deleteBuilding);
router.get("/lite/names", getBuildingNames); 
router.get("/lite/:id/rooms", getBuildingRooms);
export default router;
