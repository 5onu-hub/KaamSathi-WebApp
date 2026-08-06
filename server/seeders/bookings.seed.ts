import { connectDB } from "../config/db.js";
import { Booking } from "../models/Booking.js";
import { saveSeededDataToJSON } from "./storage.helper.js";
import fs from "fs";
import path from "path";

export async function seedBookings() {
  await connectDB();
  
  let customers = [];
  let workers = [];

  const DATA_FILE = path.join(process.cwd(), "server", "data", "kaamsathi_seed_data.json");
  if (fs.existsSync(DATA_FILE)) {
    const all = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    customers = (all.users || []).filter((u: any) => u.role === "customer");
    workers = all.workerProfiles || [];
  }

  const statuses = ["pending", "accepted", "in-progress", "completed", "cancelled"];
  const bookingsToInsert = [];

  for (let i = 0; i < 1000; i++) {
    const cust = customers[i % customers.length] || { _id: `cust_${i}`, address: "Delhi" };
    const wrk = workers[i % workers.length] || { _id: `wrk_${i}`, category: "Plumber", hourlyRate: 400 };
    const status = statuses[i % statuses.length];
    const price = (wrk.hourlyRate || 400) * (1 + Math.floor(Math.random() * 3));

    bookingsToInsert.push({
      _id: `booking_${i + 1}`,
      customerId: cust._id,
      workerId: wrk._id,
      category: wrk.category || "Plumbing",
      problemDescription: `Need urgent ${wrk.category || "Plumbing"} assistance at home. Please check and fix properly.`,
      scheduledDate: new Date(Date.now() + (i - 500) * 3600000 * 12),
      status: status === "in-progress" ? "accepted" : status,
      agreedPrice: price,
      address: cust.address || "Main Street, India"
    });
  }

  try {
    await Booking.deleteMany({});
    await Booking.insertMany(bookingsToInsert);
  } catch (e) {
    console.warn("Mongoose insert bookings skipped, using JSON storage.");
  }

  saveSeededDataToJSON("bookings", bookingsToInsert);
  console.log(`✅ Seeded ${bookingsToInsert.length} Bookings.`);
  return bookingsToInsert;
}

if (process.argv[1]?.includes("bookings.seed")) {
  seedBookings().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
