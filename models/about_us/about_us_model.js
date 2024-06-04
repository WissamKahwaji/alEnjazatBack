import mongoose from "mongoose";

const aboutContentSchema = new mongoose.Schema({
  title: String,
  description: String,
  img: String,
});

const aboutUsSchema = new mongoose.Schema({
  title: String,
  img: String,
  brief: {
    title: String,
    description: String,
  },
  content: [aboutContentSchema.obj],
});

export const aboutUsModel = mongoose.model("aboutUs", aboutUsSchema);
