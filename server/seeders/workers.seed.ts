import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { WorkerProfile } from "../models/WorkerProfile.js";
import { INDIAN_CITIES_EXTENDED, SKILLS_COMPREHENSIVE } from "./cities.seed.js";
import { saveSeededDataToJSON } from "./storage.helper.js";
import fs from "fs";
import path from "path";

export async function seedWorkers() {
  await connectDB();
  
  let workerUsers = [];
  try {
    workerUsers = await User.find({ role: "worker" });
  } catch (e) {}

  if (workerUsers.length === 0) {
    const DATA_FILE = path.join(process.cwd(), "server", "data", "kaamsathi_seed_data.json");
    if (fs.existsSync(DATA_FILE)) {
      const all = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      workerUsers = (all.users || []).filter((u: any) => u.role === "worker");
    }
  }

  const workerProfilesToInsert = [];
  for (let i = 0; i < workerUsers.length; i++) {
    const wUser = workerUsers[i];
    const cityObj = INDIAN_CITIES_EXTENDED[i % INDIAN_CITIES_EXTENDED.length];
    const primarySkill = SKILLS_COMPREHENSIVE[i % SKILLS_COMPREHENSIVE.length];
    const secondarySkills = [
      SKILLS_COMPREHENSIVE[(i + 1) % SKILLS_COMPREHENSIVE.length], 
      SKILLS_COMPREHENSIVE[(i + 2) % SKILLS_COMPREHENSIVE.length]
    ];
    const hourlyRate = Math.floor(250 + Math.random() * 750);
    const experienceYears = Math.floor(1 + Math.random() * 15);

    workerProfilesToInsert.push({
      _id: `worker_profile_${i + 1}`,
      userId: wUser._id,
      category: primarySkill,
      skills: [primarySkill, ...secondarySkills],
      hourlyRate,
      experienceYears,
      bio: `Experienced ${primarySkill} professional with ${experienceYears}+ years of verified service in ${cityObj.city}. Reliable, punctual, and expert in all repair & maintenance work.`,
      location: {
        address: wUser.address,
        city: cityObj.city,
        state: cityObj.state,
        pincode: cityObj.pincode,
        coordinates: {
          lat: cityObj.lat + (Math.random() - 0.5) * 0.05,
          lng: cityObj.lng + (Math.random() - 0.5) * 0.05
        }
      },
      verified: true,
      rating: Number((3.8 + Math.random() * 1.2).toFixed(1)),
      reviewsCount: Math.floor(10 + Math.random() * 150),
      availabilityStatus: Math.random() > 0.2 ? "available" : "busy",
      idProofUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    });
  }

  try {
    await WorkerProfile.deleteMany({});
    await WorkerProfile.insertMany(workerProfilesToInsert);
  } catch (e) {
    console.warn("Mongoose insert worker profiles skipped, using JSON storage.");
  }

  saveSeededDataToJSON("workerProfiles", workerProfilesToInsert);
  console.log(`✅ Seeded ${workerProfilesToInsert.length} Worker Profiles.`);
  return workerProfilesToInsert;
}

if (process.argv[1]?.includes("workers.seed")) {
  seedWorkers().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
