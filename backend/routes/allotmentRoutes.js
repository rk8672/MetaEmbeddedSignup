import express from "express";
import { allotRoomToGuest, allotShopToTenant } from "../controllers/allotmentController.js";

const router = express.Router();

// Allot a Room to a Guest
router.patch("/allot-room/:guestId/:roomId", allotRoomToGuest);

// Allot a Shop to a ShopTenant
router.patch("/allot-shop/:tenantId/:shopId", allotShopToTenant);

export default router;
