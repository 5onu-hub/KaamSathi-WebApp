import mongoose, { Schema, Document } from "mongoose";

export interface ICommission extends Document {
  platformRatePercentage: number;
  updatedBy: string;
  updatedAt: Date;
}

const CommissionSchema: Schema = new Schema({
  platformRatePercentage: { type: Number, default: 10 },
  updatedBy: { type: String, default: "admin@kaamsathi.com" }
}, { timestamps: true });

export default mongoose.models.Commission || mongoose.model<ICommission>("Commission", CommissionSchema);
