import { Router } from "express";
import { 
  getProfile, updateProfile, getSettings, updateSettings, 
  getActivityLogs, deleteAccount, manageAddresses 
} from "../controllers/profile.controller.ts";

const router = Router();

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);
router.get("/activity", getActivityLogs);
router.post("/account/delete", deleteAccount);
router.all("/addresses", manageAddresses);

export default router;
