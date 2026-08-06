import { Router } from "express";
import {
  getWorkers,
  getWorkerById,
  registerWorkerProfile,
  getWorkerDashboard,
  getWorkerJobs,
  updateWorkerProfile,
  updateWorkerAvailability,
  addWorkerPortfolio,
  getWorkerEarnings,
  getWorkerReviews,
  getWorkerAnalytics
} from "../controllers/worker.controller.js";

const router = Router();

router.get("/", getWorkers);
router.get("/dashboard", getWorkerDashboard);
router.get("/jobs", getWorkerJobs);
router.put("/profile", updateWorkerProfile);
router.put("/availability", updateWorkerAvailability);
router.post("/portfolio", addWorkerPortfolio);
router.get("/earnings", getWorkerEarnings);
router.get("/reviews", getWorkerReviews);
router.get("/analytics", getWorkerAnalytics);
router.get("/:id", getWorkerById);
router.post("/register", registerWorkerProfile);

export default router;

