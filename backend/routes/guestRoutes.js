import express from "express";
import {
  createGuest,
  getGuests,
  getGuestById,
  updateGuest,
  deleteGuest,
  getGuestsByRoom,
  getGuestWithHistory
} from "../controllers/guestController.js";

const router = express.Router();

router.post("/", createGuest);
router.get("/", getGuests);
router.get("/:id", getGuestById);
router.put("/:id", updateGuest);
router.delete("/:id", deleteGuest);
router.get("/room/:roomId", getGuestsByRoom);
router.get("/:id/history", getGuestWithHistory);

export default router;
