import mongoose from "mongoose";

const contactContentSchema = new mongoose.Schema({
  titleOne: String,
  titleTwo: String,
  phoneNumber: String,
  mobileOne: String,
  mobileTwo: String,
  location: String,
  email: String,
  emailOne: String,
  poBox: String,
  whatsApp: String,
  faceBook: String,
  linkedIn: String,
  instagram: String,
  threads: String,
  snapChat: String,
  googleMap: String,
  youtube: String,
  tiktok: String,
});

export const contactContentModel = mongoose.model(
  "contactContent",
  contactContentSchema
);
