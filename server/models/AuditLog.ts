import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  adminEmail: string;
  action: string;
  targetType: string;
  targetId?: string;
  details: string;
  ipAddress: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema({
  adminEmail: { type: String, required: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetId: { type: String },
  details: { type: String, required: true },
  ipAddress: { type: String, default: "127.0.0.1" },
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
