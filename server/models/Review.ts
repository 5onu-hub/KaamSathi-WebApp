import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  rating: number; // Overall 1-5
  categoryRatings: {
    punctuality: number;
    professionalism: number;
    qualityOfWork: number;
    communication: number;
    valueForMoney: number;
    cleanliness: number;
  };
  title: string;
  comment: string;
  reviewImages: string[];
  anonymous: boolean;
  wouldRecommend: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  helpfulUsers: string[];
  unhelpfulUsers: string[];
  status: "approved" | "hidden" | "deleted" | "pending";
  isPinned: boolean;
  reply?: {
    comment: string;
    createdAt: Date;
  };
  reports: Array<{
    userId: string;
    reason: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  bookingId: { type: String, required: true, index: true },
  customerId: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  workerId: { type: String, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  categoryRatings: {
    punctuality: { type: Number, default: 5, min: 1, max: 5 },
    professionalism: { type: Number, default: 5, min: 1, max: 5 },
    qualityOfWork: { type: Number, default: 5, min: 1, max: 5 },
    communication: { type: Number, default: 5, min: 1, max: 5 },
    valueForMoney: { type: Number, default: 5, min: 1, max: 5 },
    cleanliness: { type: Number, default: 5, min: 1, max: 5 }
  },
  title: { type: String, default: "Great Service" },
  comment: { type: String, required: true },
  reviewImages: [{ type: String }],
  anonymous: { type: Boolean, default: false },
  wouldRecommend: { type: Boolean, default: true },
  helpfulCount: { type: Number, default: 0 },
  unhelpfulCount: { type: Number, default: 0 },
  helpfulUsers: [{ type: String }],
  unhelpfulUsers: [{ type: String }],
  status: { type: String, enum: ["approved", "hidden", "deleted", "pending"], default: "approved", index: true },
  isPinned: { type: Boolean, default: false },
  reply: {
    comment: { type: String },
    createdAt: { type: Date }
  },
  reports: [{
    userId: { type: String },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

ReviewSchema.index({ workerId: 1, status: 1 });

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
