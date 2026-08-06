import { Router } from "express";
import { getConversations, getConversationMessages, sendMessage, deleteMessage } from "../controllers/message.controller.js";

const router = Router();

router.get("/", getConversations);
router.get("/:conversationId", getConversationMessages);
router.post("/", sendMessage);
router.delete("/:messageId", deleteMessage);

export default router;
