import { connectDB } from "../config/db.js";
import Notification from "../models/NotificationModel.js";
import { saveSeededDataToJSON } from "./storage.helper.js";

export async function seedNotifications() {
  await connectDB();
  const notificationsToInsert = [];
  const types = ["Booking Update", "Payment Successful", "Review Alert", "New Message", "Verification Approved", "Special Offer"];

  for (let i = 0; i < 5000; i++) {
    const type = types[i % types.length];
    notificationsToInsert.push({
      _id: `notif_${i + 1}`,
      title: type,
      message: `KaamSathi alert: Your recent ${type.toLowerCase()} has been processed successfully.`,
      targetAudience: "all",
      status: "sent",
      sentBy: "Admin System",
      createdAt: new Date()
    });
  }

  try {
    await Notification.deleteMany({});
    await Notification.insertMany(notificationsToInsert);
  } catch (e) {
    console.warn("Mongoose insert notifications skipped, using JSON storage.");
  }

  saveSeededDataToJSON("notifications", notificationsToInsert);
  console.log(`✅ Seeded ${notificationsToInsert.length} Notifications.`);
  return notificationsToInsert;
}

if (process.argv[1]?.includes("notifications.seed")) {
  seedNotifications().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
