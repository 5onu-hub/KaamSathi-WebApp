import { Schema, model } from "mongoose";

const searchHistorySchema = new Schema({
  userId: { type: String },
  query: { type: String, required: true },
  category: { type: String },
  filters: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export const SearchHistory = model("SearchHistory", searchHistorySchema);
