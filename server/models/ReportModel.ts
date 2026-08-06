import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  reportType: "users" | "workers" | "bookings" | "payments" | "complaints" | "analytics";
  format: "pdf" | "csv" | "excel";
  generatedBy: string;
  fileUrl: string;
  status: "completed" | "processing";
  createdAt: Date;
}

const ReportSchema: Schema = new Schema({
  reportType: { type: String, enum: ["users", "workers", "bookings", "payments", "complaints", "analytics"], required: true },
  format: { type: String, enum: ["pdf", "csv", "excel"], required: true },
  generatedBy: { type: String, default: "Admin" },
  fileUrl: { type: String, required: true },
  status: { type: String, default: "completed" },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
