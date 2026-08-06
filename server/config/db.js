import mongoose from "mongoose";
import { config } from "./env.js";
import logger from "../utils/logger.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
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
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    // In development or preview without real DB, don't crash hard, but log error
    if (config.nodeEnv === "production") {
      process.exit(1);
    }
  }
};
