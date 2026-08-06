import { Schema, model } from "mongoose";

const workerProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  skills: [String],
  hourlyRate: { type: Number, required: true },
  experienceYears: { type: Number, required: true },
  bio: { type: String },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  idProofUrl: { type: String },
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  availabilityStatus: { type: String, enum: ["available", "busy", "offline"], default: "available" },
  createdAt: { type: Date, default: Date.now }
});

export const WorkerProfile = model("WorkerProfile", workerProfileSchema);
