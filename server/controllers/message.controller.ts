import { Request, Response } from "express";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/MessageModel.js";
import { Booking } from "../models/Booking.js";

// GET /api/v1/messages (List conversations for current user or all if query param)
export async function getConversations(req: Request, res: Response) {
  try {
    const { userId, role } = req.query;
    let filter: any = {};
    if (userId) {
      filter["participants.userId"] = userId;
    }
    if (role) {
      filter["participants.role"] = role;
    }

    let conversations = await (Conversation as any).find(filter).sort({ updatedAt: -1 });

    // Fallback mock conversations if none in DB
    if (conversations.length === 0) {
      conversations = [
        {
          _id: "conv_1",
          bookingId: "bkg_101",
          participants: [
            { userId: "cust_1", role: "customer", name: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
            { userId: "w1", role: "worker", name: "Ramesh Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" }
          ],
          serviceCategory: "Electrician",
          lastMessage: "I am on my way, will reach in 10 mins.",
          lastMessageAt: new Date(),
          unreadCount: { cust_1: 1, w1: 0 },
          status: "active"
        },
        {
          _id: "conv_2",
          bookingId: "bkg_102",
          participants: [
            { userId: "cust_1", role: "customer", name: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
            { userId: "w2", role: "worker", name: "Suresh Sharma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" }
          ],
          serviceCategory: "Plumber",
          lastMessage: "Service completed successfully. Please check the tap.",
          lastMessageAt: new Date(Date.now() - 3600000),
          unreadCount: { cust_1: 0, w2: 0 },
          status: "active"
        }
      ];
    }

    res.json({ success: true, data: conversations });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/v1/messages/:conversationId
export async function getConversationMessages(req: Request, res: Response) {
  try {
    const { conversationId } = req.params;
    let messages = await (Message as any).find({ conversationId }).sort({ createdAt: 1 });

    if (messages.length === 0 && (conversationId === "conv_1" || conversationId === "conv_2")) {
      messages = [
        {
          _id: "m_1",
          conversationId,
          senderId: "cust_1",
          senderName: "Rahul Verma",
          senderRole: "customer",
          text: "Hi Ramesh, when will you arrive for the switchboard repair?",
          read: true,
          delivered: true,
          createdAt: new Date(Date.now() - 7200000)
        },
        {
          _id: "m_2",
          conversationId,
          senderId: "w1",
          senderName: "Ramesh Kumar",
          senderRole: "worker",
          text: "I am on my way, will reach in 10 mins.",
          read: true,
          delivered: true,
          createdAt: new Date(Date.now() - 3600000)
        }
      ];
    }

    res.json({ success: true, data: messages });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/v1/messages
export async function sendMessage(req: Request, res: Response) {
  try {
    const { conversationId, senderId, senderName, senderRole, text, mediaUrl, mediaType, location } = req.body;

    // Verify booking status if conversation is linked to a booking
    const conversation = await (Conversation as any).findById(conversationId);
    if (conversation && conversation.bookingId) {
      const booking = await (Booking as any).findById(conversation.bookingId);
      if (booking && ["cancelled", "completed"].includes(booking.status)) {
        return res.status(403).json({ success: false, message: "Chat is read-only because the booking is completed or cancelled." });
      }
    }

    const newMessage = await (Message as any).create({
      conversationId,
      senderId,
      senderName,
      senderRole,
      text: text || "",
      mediaUrl,
      mediaType,
      location,
      read: false,
      delivered: true
    });

    // Update conversation last message
    if (conversation) {
      conversation.lastMessage = text || (mediaType ? `[${mediaType}]` : "New message");
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /api/v1/messages/:messageId
export async function deleteMessage(req: Request, res: Response) {
  try {
    const { messageId } = req.params;
    await (Message as any).findByIdAndDelete(messageId);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
