import { propertyModel } from "../models/property/property_model.js";
import fs from "fs";
import path from "path";

export const getAllProperties = async (req, res, next) => {
  try {
    const properties = await propertyModel.find();
    return res.status(200).json(properties);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const property = await propertyModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    return res.status(200).json(property);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getLastSixProperties = async (req, res, next) => {
  try {
    const properties = await propertyModel.find().sort({ _id: -1 }).limit(6);
    return res.status(200).json(properties);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
export const getFourMinPriceProperties = async (req, res, next) => {
  try {
    const properties = await propertyModel.find().sort({ price: 1 }).limit(4);
    return res.status(200).json(properties);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addProperty = async (req, res, next) => {
  try {
    const {
      name,
      bio,
      description,
      location,
      price,
      bedrooms,
      bathrooms,
      space,
      propertyType,
      propertyContent,
      breifDetails,
      locationDetails,
      connectivity,
      paymentPlan,
      floorPlan,
      masterPlan,
      listingNumber,
    } = req.body;

    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const coverImgPath =
      req.files && req.files["coverImg"] ? req.files["coverImg"][0].path : null;

    const img = imgPath
      ? `${process.env.BASE_URL}/${imgPath.replace(/\\/g, "/")}`
      : null;
    const coverImg = coverImgPath
      ? `${process.env.BASE_URL}/${coverImgPath.replace(/\\/g, "/")}`
      : null;

    const qrImgPath =
      req.files && req.files["qrImg"] ? req.files["qrImg"][0].path : null;
    const qrImg = qrImgPath
      ? `${process.env.BASE_URL}/${qrImgPath.replace(/\\/g, "/")}`
      : null;
    const galleryPaths = req.files["gallery"]
      ? req.files["gallery"].map(
          file => `${process.env.BASE_URL}/${file.path.replace(/\\/g, "/")}`
        )
      : [];

    let qrInfo = {};
    if (listingNumber) qrInfo.listingNumber = listingNumber;
    if (qrImg) qrInfo.image = qrImg;

    let propertyContentData = {};
    if (propertyContent) {
      const parsedContent = JSON.parse(propertyContent);
      propertyContentData = {
        ...parsedContent,
        imgs: req.files["propertyContentImgs"]
          ? req.files["propertyContentImgs"].map(
              file => `${process.env.BASE_URL}/${file.path.replace(/\\/g, "/")}`
            )
          : [],
      };
    }

    const newProperty = new propertyModel({
      name,
      img,
      coverImg,
      bio,
      description,
      location,
      price,
      bedrooms,
      bathrooms,
      space,
      propertyType: JSON.parse(propertyType),
      propertyContent: propertyContentData,
      gallery: galleryPaths,
      breifDetails: JSON.parse(breifDetails),
      locationDetails,
      connectivity: JSON.parse(connectivity),
      paymentPlan,
      floorPlan,
      masterPlan,
      qrInfo,
    });

    const savedProperty = await newProperty.save();
    return res.status(201).json(savedProperty);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const editProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const updates = req.body;

    if (req.files && req.files["img"]) {
      const imgPath = req.files["img"][0].path;
      updates.img = `${process.env.BASE_URL}/${imgPath.replace(/\\/g, "/")}`;
    }

    if (req.files && req.files["qrImg"]) {
      const imgPath = req.files["qrImg"][0].path;
      updates.qrInfo.image = `${process.env.BASE_URL}/${imgPath.replace(
        /\\/g,
        "/"
      )}`;
    }

    if (req.files && req.files["coverImg"]) {
      const coverImgPath = req.files["coverImg"][0].path;
      updates.coverImg = `${process.env.BASE_URL}/${coverImgPath.replace(
        /\\/g,
        "/"
      )}`;
    }

    if (req.files && req.files["gallery"]) {
      updates.gallery = req.files["gallery"].map(
        file => `${process.env.BASE_URL}/${file.path.replace(/\\/g, "/")}`
      );
    }

    if (req.files && req.files["propertyContentImgs"]) {
      const propertyContent = JSON.parse(updates.propertyContent || "{}");
      propertyContent.imgs = req.files["propertyContentImgs"].map(
        file => `${process.env.BASE_URL}/${file.path.replace(/\\/g, "/")}`
      );
      updates.propertyContent = propertyContent;
    } else if (updates.propertyContent) {
      updates.propertyContent = JSON.parse(updates.propertyContent);
    }

    if (updates.propertyType)
      updates.propertyType = JSON.parse(updates.propertyType);
    if (updates.breifDetails)
      updates.breifDetails = JSON.parse(updates.breifDetails);
    if (updates.connectivity)
      updates.connectivity = JSON.parse(updates.connectivity);
    if (updates.qrInfo.listingNumber)
      updates.qrInfo.listingNumber = updates.qrInfo.listingNumber;

    const updatedProperty = await propertyModel.findByIdAndUpdate(
      propertyId,
      updates,
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json(updatedProperty);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;

    const property = await propertyModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const deleteImage = imgPath => {
      const fullPath = path.resolve(imgPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    };

    if (property.img)
      deleteImage(property.img.replace(process.env.BASE_URL, ""));
    if (property.coverImg)
      deleteImage(property.coverImg.replace(process.env.BASE_URL, ""));

    if (property.gallery && property.gallery.length > 0) {
      property.gallery.forEach(imgPath =>
        deleteImage(imgPath.replace(process.env.BASE_URL, ""))
      );
    }

    if (property.propertyContent && property.propertyContent.imgs) {
      property.propertyContent.imgs.forEach(imgPath =>
        deleteImage(imgPath.replace(process.env.BASE_URL, ""))
      );
    }

    await propertyModel.findByIdAndRemove(propertyId);

    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
