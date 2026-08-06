import mongoose, { Schema, Document } from "mongoose";

export interface IReferral extends Document {
  referrerId: string;
  referrerName: string;
  referrerRole: "customer" | "worker";
  refereeId?: string;
  refereeName?: string;
  referralCode: string;
  status: "pending" | "completed";
  rewardAmount: number;
  createdAt: Date;
}

const ReferralSchema: Schema = new Schema({
  referrerId: { type: String, required: true },
  referrerName: { type: String, required: true },
  referrerRole: { type: String, enum: ["customer", "worker"], required: true },
  refereeId: String,
  refereeName: String,
  referralCode: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  rewardAmount: { type: Number, default: 100 }
}, { timestamps: true });

export default mongoose.models.Referral || mongoose.model<IReferral>("Referral", ReferralSchema);
