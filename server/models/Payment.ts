import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  transactionId: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  amount: number;
  commission: number;
  workerEarnings: number;
  status: "success" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  bookingId: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  workerId: { type: String, required: true },
  workerName: { type: String, required: true },
  amount: { type: Number, required: true },
  commission: { type: Number, required: true },
  workerEarnings: { type: Number, required: true },
  status: { type: String, enum: ["success", "pending", "failed", "refunded"], default: "success" },
  paymentMethod: { type: String, default: "UPI / Razorpay" },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
