import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  workerId: { type: Schema.Types.ObjectId, ref: "WorkerProfile", required: true },
  category: { type: String, required: true },
  problemDescription: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "in-progress", "completed", "cancelled"], 
    default: "pending" 
  },
  agreedPrice: { type: Number, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Booking = model("Booking", bookingSchema);
