import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  type: "percentage" | "flat";
  discountValue: number;
  minBookingAmount: number;
  maxDiscount?: number;
  expiryDate: Date;
  usageCount: number;
  maxUsage: number;
  active: boolean;
  category?: string;
  description: string;
  createdAt: Date;
}

const CouponSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ["percentage", "flat"], required: true },
  discountValue: { type: Number, required: true },
  minBookingAmount: { type: Number, default: 0 },
  maxDiscount: Number,
  expiryDate: { type: Date, required: true },
  usageCount: { type: Number, default: 0 },
  maxUsage: { type: Number, default: 1000 },
  active: { type: Boolean, default: true },
  category: String,
  description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
