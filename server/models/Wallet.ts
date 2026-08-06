import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  userId: string;
  userRole: "customer" | "worker";
  balance: number;
  pendingBalance: number;
  withdrawableAmount: number;
  currency: string;
  savedPaymentMethods: Array<{
    id: string;
    type: "card" | "upi" | "bank";
    title: string;
    subtitle: string;
    isDefault?: boolean;
  }>;
  bankAccount?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    verified: boolean;
  };
  upiId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  userRole: { type: String, enum: ["customer", "worker"], required: true },
  balance: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  withdrawableAmount: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  savedPaymentMethods: [
    {
      id: String,
      type: { type: String, enum: ["card", "upi", "bank"] },
      title: String,
      subtitle: String,
      isDefault: Boolean
    }
  ],
  bankAccount: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    verified: { type: Boolean, default: false }
  },
  upiId: String
}, { timestamps: true });

export default mongoose.models.Wallet || mongoose.model<IWallet>("Wallet", WalletSchema);
