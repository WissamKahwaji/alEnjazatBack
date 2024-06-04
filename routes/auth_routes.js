import express from "express";
import { addAuth, signin } from "../controllers/auth_ctrl.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/", addAuth);

export default router;
