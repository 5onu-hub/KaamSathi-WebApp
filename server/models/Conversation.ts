import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  bookingId: mongoose.Types.ObjectId;
  participants: {
    userId: string;
    role: "customer" | "worker";
    name: string;
    avatar?: string;
  }[];
  serviceCategory: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Map<string, number>;
  status: "active" | "read-only";
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  participants: [{
    userId: { type: String, required: true },
    role: { type: String, enum: ["customer", "worker"], required: true },
    name: { type: String, required: true },
    avatar: { type: String }
  }],
  serviceCategory: { type: String, required: true },
  lastMessage: { type: String, default: "" },
  lastMessageAt: { type: Date, default: Date.now },
  unreadCount: { type: Map, of: Number, default: {} },
  status: { type: String, enum: ["active", "read-only"], default: "active" }
}, { timestamps: true });

export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
