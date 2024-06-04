import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

export const authModel = mongoose.model("auth", authSchema);
