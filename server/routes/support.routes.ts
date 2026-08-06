import { Router } from "express";
import {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  addReply,
  getFAQs,
  getKnowledgeBase,
  aiHelpQuery
} from "../controllers/support.controller.js";

const router = Router();

router.get("/tickets", getTickets);
router.post("/tickets", createTicket);
router.get("/tickets/:id", getTicketById);
router.put("/tickets/:id", updateTicket);
router.post("/tickets/:id/reply", addReply);

router.get("/faqs", getFAQs);
router.get("/knowledge-base", getKnowledgeBase);
router.post("/ai-help", aiHelpQuery);

export default router;
