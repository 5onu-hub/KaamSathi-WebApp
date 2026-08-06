import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  banner?: string;
  active: boolean;
  count: number;
  createdAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String, default: "Wrench" },
  banner: { type: String },
  active: { type: Boolean, default: true },
  count: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
