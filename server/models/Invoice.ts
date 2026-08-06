import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
  invoiceNumber: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  serviceCategory: string;
  date: Date;
  address: string;
  subtotal: number;
  platformFee: number;
  discount: number;
  taxAmount: number;
  total: number;
  paymentStatus: "paid" | "pending" | "refunded";
  paymentMethod: string;
  createdAt: Date;
}

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  bookingId: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  workerId: { type: String, required: true },
  workerName: { type: String, required: true },
  serviceCategory: { type: String, required: true },
  date: { type: Date, default: Date.now },
  address: { type: String, required: true },
  subtotal: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["paid", "pending", "refunded"], default: "paid" },
  paymentMethod: { type: String, default: "Online / Wallet" }
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
