import { Router } from "express";
import {
  getAdminDashboard,
  getAdminUsers,
  getAdminWorkers,
  getAdminBookings,
  getAdminPayments,
  getAdminAnalytics,
  getAdminReports,
  createCategory,
  updateCategory,
  deleteCategory,
  approveWorker,
  rejectWorker,
  banUser
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAdminUsers);
router.get("/workers", getAdminWorkers);
router.get("/bookings", getAdminBookings);
router.get("/payments", getAdminPayments);
router.get("/analytics", getAdminAnalytics);
router.get("/reports", getAdminReports);

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.put("/worker/:id/approve", approveWorker);
router.put("/worker/:id/reject", rejectWorker);
router.put("/user/:id/ban", banUser);

export default router;
