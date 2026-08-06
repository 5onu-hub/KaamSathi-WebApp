import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "worker" | "admin";
  text: string;
  mediaUrl?: string;
  mediaType?: "image" | "document" | "location";
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  read: boolean;
  delivered: boolean;
  replyTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ["customer", "worker", "admin"], required: true },
  text: { type: String, default: "" },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ["image", "document", "location"] },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  read: { type: Boolean, default: false },
  delivered: { type: Boolean, default: true },
  replyTo: { type: Schema.Types.ObjectId, ref: "Message" }
}, { timestamps: true });

export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
