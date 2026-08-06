import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  reviewImages: string[];
  helpfulCount: number;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  bookingId: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  workerId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  reviewImages: [{ type: String }],
  helpfulCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
