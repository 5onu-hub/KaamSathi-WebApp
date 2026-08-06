import { connectDB } from "../config/db.js";
import { Review } from "../models/Review.js";
import { saveSeededDataToJSON } from "./storage.helper.js";
import fs from "fs";
import path from "path";

const REVIEW_COMMENTS = [
  "Fantastic service! Arrived right on time and fixed the issue professionally.",
  "Very polite and expert worker. Highly recommended for home repairs.",
  "Good work quality, fair pricing with 0% commission transparency.",
  "Very satisfied with the repair. Will definitely book again.",
  "Punctual, clean, and efficient. Great experience with KaamSathi."
];

const REVIEW_TITLES = ["Outstanding Work", "Very Professional", "Highly Recommended", "Great Service", "Expert & Fast"];

export async function seedReviews() {
  await connectDB();
  
  let bookings = [];
  let customers = [];
  const DATA_FILE = path.join(process.cwd(), "server", "data", "kaamsathi_seed_data.json");
  if (fs.existsSync(DATA_FILE)) {
    const all = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    bookings = all.bookings || [];
    customers = (all.users || []).filter((u: any) => u.role === "customer");
  }

  const reviewsToInsert = [];
  for (let i = 0; i < 3000; i++) {
    const booking = bookings[i % bookings.length] || { _id: `b_${i}`, workerId: `w_${i}` };
    const cust = customers[i % customers.length] || { _id: `c_${i}`, name: "Customer" };
    const rating = Math.floor(3 + Math.random() * 3);

    reviewsToInsert.push({
      _id: `review_${i + 1}`,
      bookingId: String(booking._id),
      customerId: String(cust._id),
      customerName: cust.name || "Customer",
      workerId: String(booking.workerId),
      rating,
      title: REVIEW_TITLES[i % REVIEW_TITLES.length],
      comment: REVIEW_COMMENTS[i % REVIEW_COMMENTS.length],
      reviewImages: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300"],
      helpfulCount: Math.floor(Math.random() * 25)
    });
  }

  try {
    await Review.deleteMany({});
    await Review.insertMany(reviewsToInsert);
  } catch (e) {
    console.warn("Mongoose insert reviews skipped, using JSON storage.");
  }

  saveSeededDataToJSON("reviews", reviewsToInsert);
  console.log(`✅ Seeded ${reviewsToInsert.length} Reviews & Ratings.`);
  return reviewsToInsert;
}

if (process.argv[1]?.includes("reviews.seed")) {
  seedReviews().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
