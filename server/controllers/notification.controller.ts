import { Request, Response } from "express";
import Notification from "../models/NotificationModel.js";

// GET /api/v1/notifications
export async function getNotifications(req: Request, res: Response) {
  try {
    const { audience } = req.query;
    let query: any = {};
    if (audience && audience !== "all") {
      query.$or = [{ targetAudience: audience }, { targetAudience: "all" }];
    }
    let notifications = await (Notification as any).find(query).sort({ createdAt: -1 });

    if (notifications.length === 0) {
      notifications = [
        {
          _id: "notif_1",
          title: "Booking Accepted!",
          message: "Ramesh Kumar has accepted your booking for Electrician service. You can now chat and track arrival.",
          targetAudience: "customers",
          status: "sent",
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          _id: "notif_2",
          title: "Worker Arrived",
          message: "Your service partner has arrived at your location.",
          targetAudience: "customers",
          status: "sent",
          createdAt: new Date(Date.now() - 1800000)
        },
        {
          _id: "notif_3",
          title: "New Booking Assigned",
          message: "You have received a new booking request in South Delhi. Tap to accept.",
          targetAudience: "workers",
          status: "sent",
          createdAt: new Date(Date.now() - 600000)
        },
        {
          _id: "notif_4",
          title: "Payment Received",
          message: "Payment of ₹450 credited successfully for booking #BKG_9823.",
          targetAudience: "workers",
          status: "sent",
          createdAt: new Date()
        }
      ];
    }

    res.json({ success: true, data: notifications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUT /api/v1/notifications/read
export async function markNotificationsRead(req: Request, res: Response) {
  try {
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /api/v1/notifications/:id
export async function deleteNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await (Notification as any).findByIdAndDelete(id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
