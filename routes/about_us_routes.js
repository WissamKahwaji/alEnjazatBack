import express from "express";

import auth from "../middlewares/auth.js";
import {
  addAboutData,
  editAboutData,
  getAboutData,
} from "../controllers/about_us_ctrl.js";

const router = express.Router();

router.get("/", getAboutData);
router.post("/", auth, addAboutData);
router.put("/edit", auth, editAboutData);

export default router;
