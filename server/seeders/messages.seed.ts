import { connectDB } from "../config/db.js";
import { Message } from "../models/MessageModel.js";
import { Conversation } from "../models/Conversation.js";
import { saveSeededDataToJSON } from "./storage.helper.js";
import fs from "fs";
import path from "path";

const HINGLISH_MESSAGES = [
  "Namaste ji, aap kitne baje tak pahunch jayenge?",
  "Ji sir, main bas 15 minute mein aa raha hoon location par.",
  "Kaam acche se ho jayega na? Koi issue toh nahi aayega?",
  "Don't worry sir, 100% guarantee ke sath kaam karenge.",
  "The payment has been sent via UPI. Please check.",
  "Payment received, thank you ji! Please rate our service.",
  "Bhai ji, ek aur chota kaam tha, wo bhi kar doge kya?",
  "Haan bilkul sir, bataiye kya karna hai."
];

export async function seedMessages() {
  await connectDB();
  
  let customers = [];
  let workers = [];
  const DATA_FILE = path.join(process.cwd(), "server", "data", "kaamsathi_seed_data.json");
  if (fs.existsSync(DATA_FILE)) {
    const all = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    customers = (all.users || []).filter((u: any) => u.role === "customer");
    workers = (all.users || []).filter((u: any) => u.role === "worker");
  }

  const messagesToInsert = [];
  for (let i = 0; i < 3000; i++) {
    const cust = customers[i % customers.length] || { _id: `c_${i}`, name: "Customer" };
    const wrk = workers[i % workers.length] || { _id: `w_${i}`, name: "Worker" };
    const isCustomerSender = i % 2 === 0;

    messagesToInsert.push({
      _id: `msg_${i + 1}`,
      conversationId: "conv_default_1",
      senderId: String(isCustomerSender ? cust._id : wrk._id),
      senderName: isCustomerSender ? cust.name : wrk.name,
      senderRole: isCustomerSender ? "customer" : "worker",
      text: HINGLISH_MESSAGES[i % HINGLISH_MESSAGES.length],
      read: true,
      delivered: true,
      createdAt: new Date()
    });
  }

  try {
    await Message.deleteMany({});
    await Message.insertMany(messagesToInsert);
  } catch (e) {
    console.warn("Mongoose insert messages skipped, using JSON storage.");
  }

  saveSeededDataToJSON("messages", messagesToInsert);
  console.log(`✅ Seeded ${messagesToInsert.length} Realistic Hindi/Hinglish/English Messages.`);
  return messagesToInsert;
}

if (process.argv[1]?.includes("messages.seed")) {
  seedMessages().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
