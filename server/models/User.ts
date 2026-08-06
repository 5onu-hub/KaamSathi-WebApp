import { Schema, model } from "mongoose";

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["customer", "worker", "admin"], default: "customer" },
  phone: { type: String },
  avatar: { type: String },
  city: { type: String },
  address: { type: String },
  profileCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = model("User", userSchema);
