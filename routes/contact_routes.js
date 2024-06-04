import express from "express";
import {
  addContactData,
  deleteContactData,
  editContactData,
  getContactData,
} from "../controllers/contact_ctrl.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getContactData);
router.post("/add-contact-data", auth, addContactData);
router.put("/edit-contact-data/:id", auth, editContactData);
router.delete("/delete-contact-data/:id", auth, deleteContactData);

export default router;
