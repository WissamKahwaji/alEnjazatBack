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
      propertyContent,

      locationDetails,
      connectivity,
      paymentPlan,
      floorPlan,
      masterPlan,
      qrInfo,
    } = req.body;

    let parsedPropertyContent = [];
    if (propertyContent) {
      parsedPropertyContent = Array.isArray(propertyContent)
        ? propertyContent.map(item =>
            typeof item === "string" ? JSON.parse(item) : item
          )
        : [
            typeof propertyContent === "string"
              ? JSON.parse(propertyContent)
              : propertyContent,
          ];
    }

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

    let qrInfoProps = {};
    if (qrInfo.listingNumber) qrInfoProps.listingNumber = qrInfo.listingNumber;
    if (qrImg) qrInfoProps.image = qrImg;

    // Process propertyContent images
    const propertyContentData = parsedPropertyContent.map((content, index) => {
      const contentImgs = req.files[`propertyContentImgs`]
        ? req.files[`propertyContentImgs`].map(
            file => `${process.env.BASE_URL}/${file.path.replace(/\\/g, "/")}`
          )
        : [];
      return {
        ...content,
        imgs: contentImgs,
      };
    });

    const newProperty = new propertyModel({
      name,
      img,
      coverImg,
      bio,
      description,
      location,
      price,

      gallery: galleryPaths,
      propertyContent: propertyContentData,

      locationDetails,
      connectivity: connectivity,
      paymentPlan: paymentPlan,
      floorPlan,
      masterPlan,
      qrInfo: qrInfoProps,
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
    const { propertyId } = req.params;
    const updates = req.body;

    const property = await propertyModel.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    console.log("edits");
    if (req.files && req.files["img"]) {
      const imgPath = req.files["img"][0].path;
      property.img = `${process.env.BASE_URL}/${imgPath.replace(/\\/g, "/")}`;
    }

    if (req.files && req.files["qrImg"]) {
      const imgPath = req.files["qrImg"][0].path;
      property.qrInfo.image = `${process.env.BASE_URL}/${imgPath.replace(
        /\\/g,
        "/"
      )}`;
    }

    if (req.files && req.files["coverImg"]) {
      const coverImgPath = req.files["coverImg"][0].path;
      property.coverImg = `${process.env.BASE_URL}/${coverImgPath.replace(
        /\\/g,
        "/"
      )}`;
    }

    if (req.files && req.files["gallery"]) {
      property.gallery = req.files["gallery"].map(
        file => `${process.env.BASE_URL}/${file.path.replace(/\\/g, "/")}`
      );
    }

    // if (req.files && req.files["propertyContentImgs"]) {
    //   const propertyContent = JSON.parse(updates.propertyContent || "{}");
    //   propertyContent.imgs = req.files["propertyContentImgs"].map(
    //     file => `${process.env.BASE_URL}/${file.path.replace(/\\/g, "/")}`
    //   );
    //   updates.propertyContent = propertyContent;
    // } else if (updates.propertyContent) {
    //   updates.propertyContent = JSON.parse(updates.propertyContent);
    // }
    let parsedPropertyContent = [];
    const propertyContent = updates.propertyContent;
    if (propertyContent) {
      parsedPropertyContent = Array.isArray(propertyContent)
        ? propertyContent.map(item =>
            typeof item === "string" ? JSON.parse(item) : item
          )
        : [
            typeof propertyContent === "string"
              ? JSON.parse(propertyContent)
              : propertyContent,
          ];
    }
    const propertyContentData = parsedPropertyContent.map((content, index) => {
      const contentImgs = req.files[`propertyContentImgs`]
        ? req.files[`propertyContentImgs`].map(
            file => `${process.env.BASE_URL}/${file.path.replace(/\\/g, "/")}`
          )
        : property.propertyContent[index].imgs;
      return {
        ...content,
        imgs: contentImgs,
      };
    });
    if (updates.name) {
      property.name = updates.name;
    }

    if (updates.bio) {
      property.bio = updates.bio;
    }

    if (updates.description) {
      property.description = updates.description;
    }

    if (updates.location) {
      property.location = updates.location;
    }

    if (updates.price) {
      property.price = updates.price;
    }

    if (updates.paymentPlan) {
      property.paymentPlan = updates.paymentPlan;
    }
    if (updates.floorPlan) {
      property.floorPlan = updates.floorPlan;
    }
    if (updates.masterPlan) {
      property.masterPlan = updates.masterPlan;
    }

    if (updates.locationDetails) {
      property.locationDetails = updates.locationDetails;
    }
    if (propertyContentData) property.propertyContent = propertyContentData;

    if (updates.connectivity) property.connectivity = updates.connectivity;
    // if (updates.qrInfo.listingNumber)
    //   updates.qrInfo.listingNumber = updates.qrInfo.listingNumber;

    // const updatedProperty = await propertyModel.findByIdAndUpdate(
    //   propertyId,
    //   updates,
    //   { new: true }
    // );

    // if (!updatedProperty) {
    //   return res.status(404).json({ message: "Property not found" });
    // }

    const updatedProperty = await property.save();
    return res.status(200).json(updatedProperty);
  } catch (err) {
    console.log(err);
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

    // const deleteImage = imgPath => {
    //   const fullPath = path.resolve(imgPath);
    //   if (fs.existsSync(fullPath)) {
    //     fs.unlinkSync(fullPath);
    //   }
    // };

    // if (property.img)
    //   deleteImage(property.img.replace(process.env.BASE_URL, ""));
    // if (property.coverImg)
    //   deleteImage(property.coverImg.replace(process.env.BASE_URL, ""));

    // if (property.gallery && property.gallery.length > 0) {
    //   property.gallery.forEach(imgPath =>
    //     deleteImage(imgPath.replace(process.env.BASE_URL, ""))
    //   );
    // }

    // if (property.propertyContent && property.propertyContent.imgs) {
    //   property.propertyContent.imgs.forEach(imgPath =>
    //     deleteImage(imgPath.replace(process.env.BASE_URL, ""))
    //   );
    // }

    const deletedProperty = await propertyModel.findByIdAndDelete(propertyId);
    if (!deletedProperty) {
      return res.status(500).json({ message: "Can't delete property" });
    }
    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
