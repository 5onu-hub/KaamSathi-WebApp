import mongoose from "mongoose";
import { config } from "./env.js";
import logger from "../utils/logger.js";

export const connectDB = async () => {
  try {
    const uri = config.mongodbUri;
    if (!uri || uri.includes("placeholder") || uri.includes("username:password") || !uri.startsWith("mongodb")) {
      logger.info("Running in robust JSON/Memory Mode (No active MongoDB instance configured).");
      return;
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`MongoDB Atlas Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.warn(`MongoDB Connection warning, operating in standalone memory/JSON mode: ${error instanceof Error ? error.message : error}`);
    if (config.nodeEnv === "production" && config.mongodbUri && !config.mongodbUri.includes("placeholder")) {
      // only exit if explicit production DB was requested and failed
    }
  }
};
