import { Router } from "express";
import { getNotifications, markNotificationsRead, deleteNotification } from "../controllers/notification.controller.js";

const router = Router();

router.get("/", getNotifications);
router.put("/read", markNotificationsRead);
router.delete("/:id", deleteNotification);

export default router;
