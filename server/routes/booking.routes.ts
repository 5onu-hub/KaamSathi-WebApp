import { Router } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  addBookingReview,
  getBookingMessages,
  sendBookingMessage
} from "../controllers/booking.controller.js";

const router = Router();

// Booking Routes
router.get("/", getBookings);
router.post("/", createBooking);
router.get("/customer", getBookings); // backwards compatibility
router.post("/create", createBooking); // backwards compatibility

router.get("/:id", getBookingById);
router.put("/:id/status", updateBookingStatus);
router.put("/:id/cancel", cancelBooking);
router.post("/:id/review", addBookingReview);

// Chat Routes
router.get("/:id/messages", getBookingMessages);
router.post("/:id/chat", sendBookingMessage);

export default router;
