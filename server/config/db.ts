import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes("placeholder") || uri.includes("username:password") || !uri.startsWith("mongodb")) {
      console.log("Running in robust JSON/Memory Seed Mode for KaamSathi.");
      return;
    }
    await mongoose.connect(uri);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.warn("MongoDB Connection warning, operating in standalone memory/JSON mode:", error instanceof Error ? error.message : error);
  }
}


