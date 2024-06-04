import express from "express";

import auth from "../middlewares/auth.js";
import {
  addProperty,
  deleteProperty,
  editProperty,
  getAllProperties,
  getFourMinPriceProperties,
  getLastSixProperties,
  getPropertyById,
} from "../controllers/property_ctrl.js";

const router = express.Router();

router.get("/", getAllProperties);
router.get("/last-properties", getLastSixProperties);
router.get("/min-price-properties", getFourMinPriceProperties);

router.get("/:id", getPropertyById);

router.post("/add", auth, addProperty);
router.put("/edit/:propertyId", auth, editProperty);
router.delete("/delete/:id", auth, deleteProperty);

export default router;
