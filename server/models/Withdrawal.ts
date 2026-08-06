import mongoose, { Schema, Document } from "mongoose";

export interface IWithdrawal extends Document {
  withdrawalId: string;
  workerId: string;
  workerName: string;
  amount: number;
  payoutMethod: "bank" | "upi";
  accountDetails: string;
  status: "pending" | "approved" | "rejected" | "completed";
  notes?: string;
  processedAt?: Date;
  createdAt: Date;
}

const WithdrawalSchema: Schema = new Schema({
  withdrawalId: { type: String, required: true, unique: true },
  workerId: { type: String, required: true },
  workerName: { type: String, required: true },
  amount: { type: Number, required: true },
  payoutMethod: { type: String, enum: ["bank", "upi"], required: true },
  accountDetails: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" },
  notes: String,
  processedAt: Date
}, { timestamps: true });

export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>("Withdrawal", WithdrawalSchema);
