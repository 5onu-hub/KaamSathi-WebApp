import { connectDB } from "../config/db.js";
import { seedServices } from "./services.seed.js";
import { seedUsers } from "./users.seed.js";
import { seedWorkers } from "./workers.seed.js";
import { seedBookings } from "./bookings.seed.js";
import { seedReviews } from "./reviews.seed.js";
import { seedPayments } from "./payments.seed.js";
import { seedNotifications } from "./notifications.seed.js";
import { seedMessages } from "./messages.seed.js";

async function runMasterSeeder() {
  console.log("🚀 Starting KaamSathi Comprehensive Database Seeder System...");
  await connectDB();

  await seedServices();
  await seedUsers();
  await seedWorkers();
  await seedBookings();
  await seedReviews();
  await seedPayments();
  await seedNotifications();
  await seedMessages();

  console.log("🎉 All KaamSathi Demo Data Successfully Seeded!");
  console.log("✨ Platform is fully populated with 200 Customers, 500 Workers, 20 Admins, 1000 Bookings, 3000 Reviews, 5000 Notifications, 3000 Messages, and 3000 Payments with 0% commission.");
  process.exit(0);
}

runMasterSeeder().catch(err => {
  console.error("❌ Master Seeder Failed:", err);
  process.exit(1);
});
