import { Router } from "express";
import healthRoutes from "./health.routes.js";
import workerRoutes from "./worker.routes.js";
import bookingRoutes from "./booking.routes.js";
import adminRoutes from "./admin.routes.js";
import messageRoutes from "./message.routes.js";
import notificationRoutes from "./notification.routes.js";
import paymentRoutes from "./payment.routes.js";
import serviceRoutes from "./service.routes.js";
import aiRoutes from "./ai.routes.js";
import searchMapRoutes from "./searchMap.routes.js";
import gamificationRoutes from "./gamification.routes.js";
import emergencyRoutes from "./emergency.routes.js";
import trackingRoutes from "./tracking.routes.ts";
import reviewRoutes from "./review.routes.ts";
import supportRoutes from "./support.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/services", serviceRoutes);
router.use("/worker", workerRoutes);
router.use("/workers", workerRoutes);
router.use("/bookings", bookingRoutes);
router.use("/admin", adminRoutes);
router.use("/reviews", reviewRoutes);
router.use("/support", supportRoutes);
router.use("/messages", messageRoutes);
router.use("/notifications", notificationRoutes);
router.use("/payments", paymentRoutes);
router.use("/wallet", paymentRoutes);
router.use("/coupons", paymentRoutes);
router.use("/invoices", paymentRoutes);
router.use("/referrals", paymentRoutes);
router.use("/ai", aiRoutes);
router.use("/gamification", gamificationRoutes);
router.use("/emergency", emergencyRoutes);
router.use("/tracking", trackingRoutes);
router.use("/", searchMapRoutes);

export default router;



