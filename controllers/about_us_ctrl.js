import dotenv from "dotenv";
import { aboutUsModel } from "../models/about_us/about_us_model.js";

dotenv.config();

export const getAboutData = async (req, res, next) => {
  try {
    const aboutData = await aboutUsModel.findOne();
    return res.status(200).json(aboutData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addAboutData = async (req, res, next) => {
  try {
    const { title, brief, content } = req.body;

    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const imgUrl = imgPath
      ? `${process.env.BASE_URL}/${imgPath.replace(/\\/g, "/")}`
      : null;

    let contentData = [];
    if (content && req.files["contentImgs"]) {
      contentData = JSON.parse(content).map((item, index) => ({
        ...item,
        img: `${process.env.BASE_URL}/${req.files["contentImgs"][
          index
        ].path.replace(/\\/g, "/")}`,
      }));
    }

    const newAboutData = new aboutUsModel({
      title,
      img: imgUrl,
      brief: JSON.parse(brief),
      content: contentData,
    });

    const savedAboutData = await newAboutData.save();
    return res.status(201).json(savedAboutData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const editAboutData = async (req, res, next) => {
  try {
    const { title, brief, content } = req.body;
    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const imgUrl = imgPath
      ? `${process.env.BASE_URL}/${imgPath.replace(/\\/g, "/")}`
      : null;

    // let updatedContent = [];
    // if (content && req.files["contentImgs"]) {
    //   updatedContent = JSON.parse(content).map((item, index) => ({
    //     ...item,
    //     img: `${process.env.BASE_URL}/${req.files["contentImgs"][
    //       index
    //     ].path.replace(/\\/g, "/")}`,
    //   }));
    // } else if (content) {
    //   updatedContent = JSON.parse(content);
    // }
    // updatedContent = content;

    const existingAboutData = await aboutUsModel.findOne();
    if (!existingAboutData) {
      return res.status(404).json({ message: "About Us data not found" });
    }

    if (content && Array.isArray(content)) {
      existingAboutData.content = await Promise.all(
        content.map(async (item, index) => {
          return {
            title: item.title,
            description: item.description,
          };
        })
      );
    }

    if (title) existingAboutData.title = title;
    if (imgUrl) existingAboutData.img = imgUrl;
    if (brief) existingAboutData.brief = brief;
    // if (updatedContent.length > 0) existingAboutData.content = updatedContent;

    const savedAboutData = await existingAboutData.save();
    return res.status(200).json(savedAboutData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
