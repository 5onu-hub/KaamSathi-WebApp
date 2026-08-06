import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.get("/", (req, res) => {
  const healthData = {
    success: true,
    message: "KaamSathi API is running successfully",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  };
  res.status(200).json(healthData);
});

export default router;
