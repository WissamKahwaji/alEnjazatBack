import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  title: String,
  img: String,
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contactContent",
  },
});

export const contactModel = mongoose.model("Contact", contactSchema);
