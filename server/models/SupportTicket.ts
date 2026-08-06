import { Schema, model, Document } from "mongoose";

export interface ISupportReply {
  senderId: string;
  senderName: string;
  senderRole: "customer" | "worker" | "admin" | "support";
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  ticketId: string;
  userId: string;
  userName: string;
  userRole: "customer" | "worker" | "admin";
  category: string;
  subject: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "Assigned" | "In Progress" | "Waiting for User" | "Resolved" | "Closed";
  bookingId?: string;
  attachments: string[];
  assignedAgent?: string;
  replies: ISupportReply[];
  createdAt: Date;
  updatedAt: Date;
}

const supportReplySchema = new Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ["customer", "worker", "admin", "support"], required: true },
  message: { type: String, required: true },
  attachments: [String],
  createdAt: { type: Date, default: Date.now }
});

const supportTicketSchema = new Schema({
  ticketId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  userRole: { type: String, enum: ["customer", "worker", "admin"], required: true },
  category: { type: String, required: true, index: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  status: { type: String, enum: ["Open", "Assigned", "In Progress", "Waiting for User", "Resolved", "Closed"], default: "Open", index: true },
  bookingId: { type: String },
  attachments: [String],
  assignedAgent: { type: String, default: "Unassigned" },
  replies: [supportReplySchema]
}, { timestamps: true });

export const SupportTicket = model<ISupportTicket>("SupportTicket", supportTicketSchema);
