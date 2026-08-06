import { Router } from "express";
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

// Public / Customer / Worker routes
router.get("/", getServices);
router.get("/:slug", getServiceBySlug);

// Admin Management routes
router.post("/admin/services", createService);
router.put("/admin/services/:id", updateService);
router.delete("/admin/services/:id", deleteService);
router.patch("/admin/services/status", updateServiceStatus);
router.post("/admin/services/duplicate/:id", duplicateService);

export default router;
