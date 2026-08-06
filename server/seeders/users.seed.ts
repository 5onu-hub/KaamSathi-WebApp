import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { INDIAN_CITIES_EXTENDED, FIRST_NAMES, LAST_NAMES } from "./cities.seed.js";
import { saveSeededDataToJSON } from "./storage.helper.js";

export async function seedUsers() {
  await connectDB();
  const usersToInsert = [];

  // 20 Admins
  for (let i = 1; i <= 20; i++) {
    usersToInsert.push({
      _id: `user_admin_${i}`,
      clerkId: `admin_clerk_${i}`,
      email: `admin${i}@kaamsathi.com`,
      name: `Admin ${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
      role: "admin",
      phone: `+919876543${String(i).padStart(2, '0')}`,
      city: "Delhi",
      address: "Connaught Place, New Delhi",
      profileCompleted: true
    });
  }

  // 200 Customers
  for (let i = 1; i <= 200; i++) {
    const cityObj = INDIAN_CITIES_EXTENDED[i % INDIAN_CITIES_EXTENDED.length];
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    usersToInsert.push({
      _id: `user_customer_${i}`,
      clerkId: `customer_clerk_${i}`,
      email: `customer${i}@gmail.com`,
      name: `${firstName} ${lastName}`,
      role: "customer",
      phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
      city: cityObj.city,
      address: `House #${i}, Main Road, ${cityObj.city}`,
      profileCompleted: true
    });
  }

  // 500 Workers
  for (let i = 1; i <= 500; i++) {
    const cityObj = INDIAN_CITIES_EXTENDED[i % INDIAN_CITIES_EXTENDED.length];
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    usersToInsert.push({
      _id: `user_worker_${i}`,
      clerkId: `worker_clerk_${i}`,
      email: `worker${i}@kaamsathi.com`,
      name: `${firstName} ${lastName}`,
      role: "worker",
      phone: `+9197${Math.floor(10000000 + Math.random() * 90000000)}`,
      city: cityObj.city,
      address: `Shop #${i}, Market Area, ${cityObj.city}`,
      profileCompleted: true
    });
  }

  try {
    await User.deleteMany({});
    await User.insertMany(usersToInsert);
  } catch (e) {
    console.warn("Mongoose insert users skipped, using JSON storage.");
  }

  saveSeededDataToJSON("users", usersToInsert);
  console.log(`✅ Seeded ${usersToInsert.length} Users (20 Admins, 200 Customers, 500 Workers).`);
  return usersToInsert;
}

if (process.argv[1]?.includes("users.seed")) {
  seedUsers().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
