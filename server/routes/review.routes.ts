import { Router } from "express";
import {
  createReview,
  getWorkerReviews,
  updateReview,
  voteHelpful,
  reportReview,
  replyReview,
  getAdminReviews,
  adminModerateReview
} from "../controllers/review.controller.js";

const router = Router();

router.post("/", createReview);
router.get("/worker/:id", getWorkerReviews);
router.put("/:id", updateReview);
router.post("/:id/helpful", voteHelpful);
router.post("/:id/report", reportReview);
router.post("/:id/reply", replyReview);

// Admin moderation
router.get("/admin/all", getAdminReviews);
router.patch("/admin/:id", adminModerateReview);

export default router;
