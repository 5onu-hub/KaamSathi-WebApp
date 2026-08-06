import mongoose, { Schema, Document } from "mongoose";

export interface IComplaint extends Document {
  complainantType: "customer" | "worker";
  complainantId: string;
  complainantName: string;
  targetId: string;
  targetName: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "investigating" | "resolved" | "closed";
  assignedAgent?: string;
  conversation: { sender: string; message: string; timestamp: Date }[];
  createdAt: Date;
}

const ComplaintSchema: Schema = new Schema({
  complainantType: { type: String, enum: ["customer", "worker"], required: true },
  complainantId: { type: String, required: true },
  complainantName: { type: String, required: true },
  targetId: { type: String, required: true },
  targetName: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  status: { type: String, enum: ["open", "investigating", "resolved", "closed"], default: "open" },
  assignedAgent: { type: String, default: "Support Team A" },
  conversation: [{
    sender: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", ComplaintSchema);
