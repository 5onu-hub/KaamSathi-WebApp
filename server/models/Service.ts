import { Schema, model, Document } from "mongoose";

export interface ISubService {
  name: string;
  slug: string;
  description?: string;
  price: number;
  duration: string;
}

export interface IService extends Document {
  name: string;
  slug: string;
  category: string;
  subCategory?: string;
  description: string;
  shortDescription: string;
  serviceIcon: string;
  bannerImage?: string;
  thumbnail?: string;
  gallery: string[];
  basePrice: number;
  hourlyPrice: number;
  estimatedDuration: string;
  emergencyAvailable: boolean;
  popularBadge: boolean;
  trendingBadge: boolean;
  featuredBadge: boolean;
  minExperienceRequired: number;
  requiredSkills: string[];
  requiredTools: string[];
  seoTitle?: string;
  seoDescription?: string;
  keywords: string[];
  status: "active" | "inactive" | "archived";
  subServices: ISubService[];
  termsAndConditions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subServiceSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  duration: { type: String, default: "1 hour" }
});

const serviceSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, lowercase: true },
  category: { type: String, required: true, index: true },
  subCategory: { type: String },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  serviceIcon: { type: String, required: true, default: "Wrench" },
  bannerImage: { type: String },
  thumbnail: { type: String },
  gallery: [String],
  basePrice: { type: Number, required: true, default: 299 },
  hourlyPrice: { type: Number, required: true, default: 250 },
  estimatedDuration: { type: String, default: "1-2 Hours" },
  emergencyAvailable: { type: Boolean, default: false },
  popularBadge: { type: Boolean, default: false },
  trendingBadge: { type: Boolean, default: false },
  featuredBadge: { type: Boolean, default: false, index: true },
  minExperienceRequired: { type: Number, default: 1 },
  requiredSkills: [String],
  requiredTools: [String],
  seoTitle: { type: String },
  seoDescription: { type: String },
  keywords: [String],
  status: { type: String, enum: ["active", "inactive", "archived"], default: "active", index: true },
  subServices: [subServiceSchema],
  termsAndConditions: { type: String }
}, { timestamps: true });

serviceSchema.index({ name: "text", description: "text", keywords: "text" });

export const Service = model<IService>("Service", serviceSchema);
