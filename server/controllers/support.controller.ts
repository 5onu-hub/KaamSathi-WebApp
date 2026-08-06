import { Request, Response } from "express";
import { SupportTicket } from "../models/SupportTicket.js";
import { FAQArticle, KnowledgeBaseArticle } from "../models/FAQ.js";
import { GoogleGenAI } from "@google/genai";

let memoryTickets: any[] = [
  {
    _id: "tkt_101",
    ticketId: "TCK-8924",
    userId: "cust_1",
    userName: "Aarav Sharma",
    userRole: "customer",
    category: "Booking Issue",
    subject: "Electrician arrived late for scheduled appointment",
    description: "The assigned electrician was 45 minutes late without prior notification.",
    priority: "Medium",
    status: "In Progress",
    bookingId: "bk_101",
    attachments: [],
    assignedAgent: "Pooja Support Lead",
    replies: [
      {
        senderId: "agent_1",
        senderName: "Pooja Support Lead",
        senderRole: "support",
        message: "Hello Aarav, we sincerely apologize for the delay. We are investigating with the worker.",
        createdAt: new Date(Date.now() - 3600000)
      }
    ],
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000)
  },
  {
    _id: "tkt_102",
    ticketId: "TCK-8925",
    userId: "worker_1",
    userName: "Rajesh Kumar",
    userRole: "worker",
    category: "Payment Issue",
    subject: "Payout settlement pending for completed job",
    description: "Job #bk_102 was completed yesterday but UPI transfer has not reflected.",
    priority: "High",
    status: "Open",
    bookingId: "bk_102",
    attachments: [],
    assignedAgent: "Unassigned",
    replies: [],
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 1800000)
  }
];

let memoryFAQs: any[] = [
  { _id: "faq_1", question: "How to book a worker?", answer: "Browse services on the home or search map, select your required service slot, and confirm booking via secure payment.", category: "Bookings", helpfulCount: 45, views: 320 },
  { _id: "faq_2", question: "How to become a worker?", answer: "Sign up as a professional in the Worker Portal, complete KYC identity verification, and submit your skill certificates.", category: "Workers", helpfulCount: 38, views: 240 },
  { _id: "faq_3", question: "How are payments handled?", answer: "All payments are processed securely via escrow. Funds are released to workers only upon successful job completion and customer verification.", category: "Payments", helpfulCount: 52, views: 410 },
  { _id: "faq_4", question: "How to cancel a booking?", answer: "Go to My Bookings, select the active booking, and tap 'Cancel Booking'. Free cancellation is available up to 2 hours before the scheduled slot.", category: "Bookings", helpfulCount: 60, views: 512 },
  { _id: "faq_5", question: "How to update my profile?", answer: "Navigate to Account Settings in your profile tab to update your phone number, saved addresses, and profile photo.", category: "Getting Started", helpfulCount: 22, views: 180 },
  { _id: "faq_6", question: "How to reset password?", answer: "Tap 'Forgot Password' on the login screen, enter your registered email/phone, and follow the OTP verification steps.", category: "Account Issue", helpfulCount: 31, views: 290 }
];

let memoryKB: any[] = [
  { _id: "kb_1", title: "Getting Started Guide", slug: "getting-started", category: "Getting Started", readTime: "4 min read", content: "Welcome to KaamSathi! This guide covers account setup, booking your first home service professional, and exploring emergency dispatch features." },
  { _id: "kb_2", title: "Booking & Scheduling Policies", slug: "booking-policies", category: "Bookings", readTime: "3 min read", content: "Learn about appointment rescheduling, advance notice requirements, and rescheduling fees for late changes." },
  { _id: "kb_3", title: "Secure Escrow & Refunds", slug: "payments-escrow", category: "Payments", readTime: "5 min read", content: "KaamSathi uses secure escrow protection. Read how refunds are processed instantly to your original payment method upon cancellation." },
  { _id: "kb_4", title: "Worker Verification & Safety Standards", slug: "worker-safety", category: "Safety", readTime: "6 min read", content: "Every KaamSathi professional undergoes strict government ID background checks, police verification, and in-person skill testing." }
];

export const getTickets = async (req: Request, res: Response) => {
  try {
    const { userId, role, status, priority, category } = req.query;
    const Model = SupportTicket as any;
    let query: any = {};

    if (userId && role !== "admin") {
      query.userId = userId;
    }
    if (status && status !== "all") query.status = status;
    if (priority && priority !== "all") query.priority = priority;
    if (category && category !== "all") query.category = category;

    let tickets = await Model.find(query).sort({ updatedAt: -1 }).catch(() => null);
    if (!tickets || tickets.length === 0) {
      tickets = memoryTickets.filter(t => {
        if (userId && role !== "admin" && t.userId !== userId) return false;
        if (status && status !== "all" && t.status !== status) return false;
        if (priority && priority !== "all" && t.priority !== priority) return false;
        if (category && category !== "all" && t.category !== category) return false;
        return true;
      });
    }

    // Calculate statistics
    const allCount = tickets.length;
    const openCount = tickets.filter((t: any) => t.status === "Open" || t.status === "Assigned").length;
    const pendingCount = tickets.filter((t: any) => t.status === "In Progress" || t.status === "Waiting for User").length;
    const closedCount = tickets.filter((t: any) => t.status === "Resolved" || t.status === "Closed").length;

    res.json({
      success: true,
      stats: {
        total: allCount,
        open: openCount,
        pending: pendingCount,
        closed: closedCount,
        avgResponseTime: "14 mins",
        supportStatus: "Online & Fully Operational"
      },
      data: tickets
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { userId, userName, userRole, category, subject, description, priority, bookingId, attachments } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({ success: false, message: "Missing required ticket fields" });
    }

    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicketData = {
      _id: `tkt_${Date.now()}`,
      ticketId,
      userId: userId || "cust_guest",
      userName: userName || "Valued User",
      userRole: userRole || "customer",
      category,
      subject,
      description,
      priority: priority || "Medium",
      status: "Open",
      bookingId: bookingId || "",
      attachments: attachments || [],
      assignedAgent: "Unassigned",
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const Model = SupportTicket as any;
    let saved;
    try {
      saved = await Model.create(newTicketData);
    } catch (e) {
      memoryTickets.unshift(newTicketData);
      saved = newTicketData;
    }

    res.status(201).json({
      success: true,
      message: `Support ticket ${ticketId} created successfully. Our team will respond shortly.`,
      data: saved
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const Model = SupportTicket as any;
    let ticket = await Model.findOne({ $or: [{ _id: id }, { ticketId: id }] }).catch(() => null);
    if (!ticket) {
      ticket = memoryTickets.find(t => t._id === id || t.ticketId === id);
    }

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Support ticket not found" });
    }

    res.json({ success: true, data: ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    const Model = SupportTicket as any;
    let updated = await Model.findOneAndUpdate({ $or: [{ _id: id }, { ticketId: id }] }, updates, { new: true }).catch(() => null);
    let memIdx = memoryTickets.findIndex(t => t._id === id || t.ticketId === id);
    if (memIdx !== -1) {
      memoryTickets[memIdx] = { ...memoryTickets[memIdx], ...updates };
      updated = memoryTickets[memIdx];
    }

    res.json({ success: true, message: "Ticket updated successfully", data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { senderId, senderName, senderRole, message, attachments } = req.body;

    const Model = SupportTicket as any;
    let ticket = await Model.findOne({ $or: [{ _id: id }, { ticketId: id }] }).catch(() => null);
    let memTicket = memoryTickets.find(t => t._id === id || t.ticketId === id);

    const target = ticket || memTicket;
    if (!target) return res.status(404).json({ success: false, message: "Ticket not found" });

    const newReply = {
      senderId: senderId || "user_anon",
      senderName: senderName || "User",
      senderRole: senderRole || "customer",
      message,
      attachments: attachments || [],
      createdAt: new Date()
    };

    target.replies.push(newReply);
    target.updatedAt = new Date();
    if (senderRole === 'admin' || senderRole === 'support') {
      target.status = "Waiting for User";
    } else {
      target.status = "In Progress";
    }

    if (ticket && typeof ticket.save === 'function') {
      await ticket.save();
    }

    res.json({ success: true, message: "Reply added successfully", data: target });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFAQs = async (_req: Request, res: Response) => {
  try {
    const Model = FAQArticle as any;
    let faqs = await Model.find().catch(() => null);
    if (!faqs || faqs.length === 0) faqs = memoryFAQs;
    res.json({ success: true, data: faqs });
  } catch (e: any) {
    res.json({ success: true, data: memoryFAQs });
  }
};

export const getKnowledgeBase = async (_req: Request, res: Response) => {
  try {
    const Model = KnowledgeBaseArticle as any;
    let kb = await Model.find().catch(() => null);
    if (!kb || kb.length === 0) kb = memoryKB;
    res.json({ success: true, data: kb });
  } catch (e: any) {
    res.json({ success: true, data: memoryKB });
  }
};

export const aiHelpQuery = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: "Query required" });

    // Try Gemini if apiKey exists
    let aiResponse = "";
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are KaamSathi AI Help Assistant. Answer the user's support question concisely and helpfully, and suggest relevant FAQ articles. User query: "${query}"`
        });
        aiResponse = response.text || "";
      } catch (err) {
        // fallback
      }
    }

    if (!aiResponse) {
      // Intelligent keyword fallback matching
      const lower = query.toLowerCase();
      let matchedFaq = memoryFAQs.find(f => f.question.toLowerCase().includes(lower) || f.answer.toLowerCase().includes(lower));
      if (!matchedFaq && memoryFAQs.length > 0) matchedFaq = memoryFAQs[0];

      aiResponse = `Here is what you need to know regarding "${query}": ${matchedFaq ? matchedFaq.answer : "Please browse our Knowledge Base or submit a support ticket for personalized assistance."}`;
    }

    // Find top matching FAQ articles
    const matchingFaqs = memoryFAQs.filter(f => 
      f.question.toLowerCase().includes(query.toLowerCase()) || 
      f.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    res.json({
      success: true,
      answer: aiResponse,
      suggestedArticles: matchingFaqs.length > 0 ? matchingFaqs : memoryFAQs.slice(0, 2)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
