import { Router } from "express";
import {
  syncUser,
  getMe,
  selectRole,
  completeProfile,
  checkProfile,
  clerkWebhook,
  updateUser
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/sync", syncUser);
router.post("/create", syncUser); // backwards compatibility
router.get("/me", authenticateUser, getMe);
router.put("/role", authenticateUser, selectRole);
router.post("/select-role", authenticateUser, selectRole); // backwards compatibility
router.put("/profile", authenticateUser, completeProfile);
router.post("/complete-profile", authenticateUser, completeProfile); // backwards compatibility
router.get("/check-profile", authenticateUser, checkProfile);
router.post("/webhook", clerkWebhook);
router.put("/update", authenticateUser, updateUser);

export default router;
