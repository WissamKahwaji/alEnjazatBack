import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import contactRouter from "./routes/contact_routes.js";
import authRouter from "./routes/auth_routes.js";
import aboutUsRouter from "./routes/about_us_routes.js";
import propertyRouter from "./routes/property_routes.js";

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    const filename = `${file.originalname.split(".")[0]}-${Date.now()}${ext}`;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).fields([
    { name: "img", maxCount: 10 },
    { name: "coverImg", maxCount: 1 },
    { name: "contentImgs", maxCount: 10 },
    { name: "propertyContentImgs", maxCount: 10 },
    { name: "profile", maxCount: 1 },
    { name: "imgs", maxCount: 15 },
    { name: "imgs[1]", maxCount: 15 },
    { name: "imgs[0]", maxCount: 15 },
    { name: "landingImg", maxCount: 1 },
    { name: "logoImg", maxCount: 1 },
    { name: "mainLogoImg", maxCount: 1 },
    { name: "imgHeading", maxCount: 1 },
  ])
);

app.use("/contact", contactRouter);
app.use("/auth", authRouter);
app.use("/about-us", aboutUsRouter);
app.use("/property", propertyRouter);

app.get("/", (req, res) => res.send("Server is Ready"));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server Running on ${PORT}`);
    })
  )
  .catch(error => console.log(error.message));

mongoose.set("strictQuery", true);
