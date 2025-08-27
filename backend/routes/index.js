import express from "express";

// Import all route modules
import buildingRoutes from "./buildingRoutes.js";
import adminRoutes from "./adminRoutes.js";
import roomRoutes from "./roomRoutes.js";
import shopRoutes from "./shopRoutes.js";
import guestRoutes from "./guestRoutes.js";
import shopTenantRoutes from "./shopTenantRoutes.js"
import allotmentRoutes from "./allotmentRoutes.js";
import paymentRoutes from "./paymentRoutes.js";


const router = express.Router();



router.use("/admin", adminRoutes);
router.use("/buildings", buildingRoutes);
router.use("/rooms", roomRoutes);
router.use("/shops", shopRoutes);
router.use("/guests", guestRoutes);
router.use("/shoptenants", shopTenantRoutes);
router.use("/allotment", allotmentRoutes);
router.use("/payments", paymentRoutes);



export default router;
