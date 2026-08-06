import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";
import { saveSeededDataToJSON } from "./storage.helper.js";

const CATEGORIES_DATA = [
  { name: "Home Services", slug: "home-services", description: "Plumbing, electrical, carpentry, and home maintenance.", icon: "Wrench" },
  { name: "Construction", slug: "construction", description: "Masons, daily wage labourers, tile work, and false ceilings.", icon: "Building" },
  { name: "Appliance Repair", slug: "appliance", description: "AC repair, TV repair, RO purification, and home appliances.", icon: "Cpu" },
  { name: "Cleaning & Pest", slug: "cleaning", description: "Deep cleaning, sofa cleaning, and pest control services.", icon: "Sparkles" },
  { name: "Drivers & Transport", slug: "transport", description: "Personal drivers, delivery executives, and packers & movers.", icon: "Car" },
  { name: "Cooking & Catering", slug: "cooking", description: "Home chefs, daily cooks, and event caterers.", icon: "Utensils" },
  { name: "Gardening & Outdoor", slug: "outdoor", description: "Landscaping, garden maintenance, and plant care.", icon: "Flower2" },
  { name: "Digital & IT", slug: "digital", description: "Computer repair, mobile repair, CCTV installation, and tech support.", icon: "Laptop" },
  { name: "Care & Support", slug: "care", description: "Babysitters, elderly care, and patient attendants.", icon: "HeartHandshake" },
  { name: "Security Services", slug: "security", description: "Security guards, bouncers, and watchmen.", icon: "ShieldCheck" },
  { name: "Vehicle Services", slug: "vehicle", description: "Car washing, mechanic support, and bike repair.", icon: "Wrench" },
  { name: "Event Services", slug: "event", description: "Photographers, videographers, decorators, and event helpers.", icon: "Sparkles" }
];

export async function seedServices() {
  await connectDB();
  try {
    await Category.deleteMany({});
    await Category.insertMany(CATEGORIES_DATA as any);
  } catch (e) {
    console.warn("Mongoose insert skipped, using JSON storage.");
  }
  saveSeededDataToJSON("categories", CATEGORIES_DATA);
  console.log(`✅ Seeded ${CATEGORIES_DATA.length} Service Categories.`);
  return CATEGORIES_DATA;
}

if (process.argv[1]?.includes("services.seed")) {
  seedServices().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
