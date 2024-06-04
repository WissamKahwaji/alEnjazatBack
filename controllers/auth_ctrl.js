import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authModel } from "../models/auth/auth_model.js";

export const signin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      const error = new Error("Invalid Credentials.");
      error.statusCode = 401;
      throw error;
    }

    const existingUser = await authModel.findOne();
    if (!existingUser) {
      const error = new Error("User doesn't exist.");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("Invalid Credentials.");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1y" }
    );

    res.status(200).json({
      message: "LogIn Successfuled",
      token: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addAuth = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await authModel({
      userName,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1y",
    });
    return res.status(201).json({
      message: "Success",
      token: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
