import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "server", "data");
const DATA_FILE = path.join(DATA_DIR, "kaamsathi_seed_data.json");

export function saveSeededDataToJSON(key: string, data: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let allData: Record<string, any> = {};
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
      try {
        allData = JSON.parse(fileContent);
      } catch (e) {
        allData = {};
      }
    }
    allData[key] = data;
    fs.writeFileSync(DATA_FILE, JSON.stringify(allData, null, 2), "utf-8");
    console.log(`💾 Saved ${data.length} records to local seed storage (${key}).`);
  } catch (error) {
    console.warn(`Could not save JSON seed data for ${key}:`, error);
  }
}
