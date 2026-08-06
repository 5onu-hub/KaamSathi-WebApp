import { Schema, model } from "mongoose";

const savedLocationSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

export const SavedLocation = model("SavedLocation", savedLocationSchema);
