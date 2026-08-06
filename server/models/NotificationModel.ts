import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  targetAudience: "all" | "customers" | "workers" | "admin" | "city" | "category";
  targetFilter?: string; // e.g. city name or category id
  scheduledFor?: Date;
  status: "sent" | "scheduled" | "draft";
  sentBy: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  targetAudience: { type: String, enum: ["all", "customers", "workers", "admin", "city", "category"], default: "all" },
  targetFilter: { type: String },
  scheduledFor: { type: Date },
  status: { type: String, enum: ["sent", "scheduled", "draft"], default: "sent" },
  sentBy: { type: String, default: "Admin System" },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
