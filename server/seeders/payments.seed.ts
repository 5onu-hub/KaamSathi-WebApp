import { connectDB } from "../config/db.js";
import Payment from "../models/Payment.js";
import { saveSeededDataToJSON } from "./storage.helper.js";
import fs from "fs";
import path from "path";

export async function seedPayments() {
  await connectDB();
  
  let bookings = [];
  const DATA_FILE = path.join(process.cwd(), "server", "data", "kaamsathi_seed_data.json");
  if (fs.existsSync(DATA_FILE)) {
    const all = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    bookings = all.bookings || [];
  }

  const paymentMethods = ["UPI", "Card", "Cash", "Wallet"];
  const paymentsToInsert = [];

  for (let i = 0; i < 3000; i++) {
    const booking = bookings[i % bookings.length] || { _id: `b_${i}`, customerId: `c_${i}`, workerId: `w_${i}`, agreedPrice: 500 };
    const method = paymentMethods[i % paymentMethods.length];
    const amount = booking.agreedPrice || 500;
    const commission = 0; // 0% commission guarantee

    paymentsToInsert.push({
      _id: `payment_${i + 1}`,
      transactionId: `TXN_KAAM_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      bookingId: String(booking._id),
      customerId: String(booking.customerId),
      customerName: "Valued Customer",
      workerId: String(booking.workerId),
      workerName: "Verified Professional",
      amount,
      commission,
      workerEarnings: amount,
      status: i % 10 === 0 ? "pending" : "success",
      paymentMethod: method,
      createdAt: new Date()
    });
  }

  try {
    await Payment.deleteMany({});
    await Payment.insertMany(paymentsToInsert);
  } catch (e) {
    console.warn("Mongoose insert payments skipped, using JSON storage.");
  }

  saveSeededDataToJSON("payments", paymentsToInsert);
  console.log(`✅ Seeded ${paymentsToInsert.length} Payments & Transactions with 0% Commission.`);
  return paymentsToInsert;
}

if (process.argv[1]?.includes("payments.seed")) {
  seedPayments().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
