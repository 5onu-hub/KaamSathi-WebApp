import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  transactionId: string;
  walletId?: string;
  userId: string;
  userRole: "customer" | "worker" | "admin";
  type: "credit" | "debit" | "refund" | "withdrawal" | "commission" | "referral_bonus";
  amount: number;
  description: string;
  referenceId?: string; // bookingId or withdrawalId
  status: "completed" | "pending" | "failed";
  paymentMethod?: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  walletId: String,
  userId: { type: String, required: true },
  userRole: { type: String, enum: ["customer", "worker", "admin"], required: true },
  type: { type: String, enum: ["credit", "debit", "refund", "withdrawal", "commission", "referral_bonus"], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  referenceId: String,
  status: { type: String, enum: ["completed", "pending", "failed"], default: "completed" },
  paymentMethod: { type: String, default: "Wallet / Gateway" }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
