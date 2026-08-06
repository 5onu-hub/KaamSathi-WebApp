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
import {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  updateServiceStatus,
  duplicateService
} from "../controllers/service.controller.js";

const router = Router();

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAdminUsers);
router.get("/workers", getAdminWorkers);
router.get("/bookings", getAdminBookings);
router.get("/payments", getAdminPayments);
router.get("/analytics", getAdminAnalytics);
router.get("/reports", getAdminReports);

// Service Management Admin APIs
router.get("/services", getServices);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);
router.patch("/services/status", updateServiceStatus);
router.post("/services/duplicate/:id", duplicateService);

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.put("/worker/:id/approve", approveWorker);
router.put("/worker/:id/reject", rejectWorker);
router.put("/user/:id/ban", banUser);

export default router;
