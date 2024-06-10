import mongoose from "mongoose";

const propertyContentSchema = new mongoose.Schema({
  description: String,
  details: [
    {
      title: String,
    },
  ],
  imgs: [String],
});

const propertySchema = new mongoose.Schema({
  name: String,
  img: String,
  coverImg: String,
  bio: String,
  description: String,
  location: String,
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  space: String,

  propertyType: {
    mainType: String,
    subType: String,
  },
  propertyContent: [propertyContentSchema.obj],
  gallery: [String],
  breifDetails: [
    {
      title: String,
      value: String,
    },
  ],
  qrInfo: {
    image: String,
    listingNumber: String,
  },
  locationDetails: String,
  connectivity: [
    {
      title: String,
      value: String,
    },
  ],
  paymentPlan: [
    {
      title: String,
      value: String,
    },
  ],
  floorPlan: String,
  masterPlan: String,
});

export const propertyModel = mongoose.model("property", propertySchema);
