import express from "express";
import {
  createShopTenant,
  getShopTenants,
  getShopTenantById,
  updateShopTenant,
  deleteShopTenant,
} from "../controllers/shopTenantController.js";

const router = express.Router();

router.post("/", createShopTenant);
router.get("/", getShopTenants);
router.get("/:id", getShopTenantById);
router.put("/:id", updateShopTenant);
router.delete("/:id", deleteShopTenant);

export default router;
