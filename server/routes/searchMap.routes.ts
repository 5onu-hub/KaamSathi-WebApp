import { Router } from "express";
import { WorkerProfile } from "../models/WorkerProfile.js";
import { SavedLocation } from "../models/SavedLocation.js";
import { SearchHistory } from "../models/SearchHistory.js";

const router = Router();

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

router.get("/search", async (req, res) => {
  try {
    const { q, category, service, skill, city, locality, pincode, minPrice, maxPrice, rating, verified, emergency, sort } = req.query;
    
    let query: any = {};
    if (q) {
      const regex = new RegExp(String(q), "i");
      query.$or = [
        { category: regex },
        { skills: regex },
        { "location.address": regex },
        { "location.city": regex },
        { "location.pincode": regex },
        { bio: regex }
      ];
    }
    if (category) query.category = new RegExp(String(category), "i");
    if (service) query.skills = new RegExp(String(service), "i");
    if (skill) query.skills = new RegExp(String(skill), "i");
    if (city) query["location.city"] = new RegExp(String(city), "i");
    if (locality) query["location.address"] = new RegExp(String(locality), "i");
    if (pincode) query["location.pincode"] = String(pincode);
    if (verified === "true") query.verified = true;
    if (minPrice || maxPrice) {
      query.hourlyRate = {};
      if (minPrice) query.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) query.hourlyRate.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };

    let workers = await WorkerProfile.find(query).populate("userId", "name email phone avatar").lean();

    if (!workers || workers.length === 0) {
      workers = [
        {
          _id: "w1",
          userId: { name: "Rajesh Kumar", email: "rajesh@example.com", phone: "+91 98765 43210", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
          category: "Electrician",
          skills: ["Wiring", "Inverter", "MCB Repair", "AC Installation"],
          hourlyRate: 350,
          experienceYears: 6,
          bio: "Certified senior electrician with 6+ years experience in residential and commercial wiring.",
          location: { address: "Connaught Place, Block A", city: "New Delhi", pincode: "110001", coordinates: { lat: 28.6139, lng: 77.2090 } },
          verified: true,
          rating: 4.8,
          reviewsCount: 142,
          availabilityStatus: "available"
        },
        {
          _id: "w2",
          userId: { name: "Sunil Sharma", email: "sunil@example.com", phone: "+91 98765 43211", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
          category: "Plumber",
          skills: ["Pipe Leakage", "Bathroom Fitting", "Geyser Repair", "Water Tank"],
          hourlyRate: 300,
          experienceYears: 8,
          bio: "Expert plumber specializing in high-pressure leak detection and bathroom remodeling.",
          location: { address: "Sector 18, Noida", city: "Noida", pincode: "201301", coordinates: { lat: 28.5700, lng: 77.3200 } },
          verified: true,
          rating: 4.9,
          reviewsCount: 198,
          availabilityStatus: "available"
        },
        {
          _id: "w3",
          userId: { name: "Amit Verma", email: "amit@example.com", phone: "+91 98765 43212", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150" },
          category: "Carpenter",
          skills: ["Furniture Assembly", "Door Lock", "Modular Kitchen", "Wood Polishing"],
          hourlyRate: 400,
          experienceYears: 10,
          bio: "Master carpenter with extensive experience in custom furniture and architectural woodwork.",
          location: { address: "DLF Phase 3, Gurugram", city: "Gurugram", pincode: "122002", coordinates: { lat: 28.4950, lng: 77.0890 } },
          verified: true,
          rating: 4.7,
          reviewsCount: 96,
          availabilityStatus: "available"
        },
        {
          _id: "w4",
          userId: { name: "Pooja Gupta", email: "pooja@example.com", phone: "+91 98765 43213", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
          category: "Painter",
          skills: ["Wall Painting", "Waterproofing", "Texture Design", "Stenciling"],
          hourlyRate: 280,
          experienceYears: 5,
          bio: "Professional interior and exterior painter bringing vibrant, clean finishes to your spaces.",
          location: { address: "Lajpat Nagar Part 2", city: "New Delhi", pincode: "110024", coordinates: { lat: 28.5680, lng: 77.2430 } },
          verified: true,
          rating: 4.6,
          reviewsCount: 84,
          availabilityStatus: "available"
        },
        {
          _id: "w5",
          userId: { name: "Manoj Singh", email: "manoj@example.com", phone: "+91 98765 43214", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150" },
          category: "Appliance Repair",
          skills: ["Refrigerator", "Washing Machine", "Microwave", "RO Water Purifier"],
          hourlyRate: 450,
          experienceYears: 7,
          bio: "Multi-brand appliance technician with rapid doorstep diagnosis and genuine spare parts.",
          location: { address: "Greater Kailash 1", city: "New Delhi", pincode: "110048", coordinates: { lat: 28.5480, lng: 77.2410 } },
          verified: true,
          rating: 4.9,
          reviewsCount: 230,
          availabilityStatus: "available"
        }
      ] as any;
    }

    const userLat = req.query.lat ? Number(req.query.lat) : 28.6139;
    const userLng = req.query.lng ? Number(req.query.lng) : 77.2090;

    const enrichedWorkers = workers.map((w: any) => {
      const wLat = w.location?.coordinates?.lat || 28.61;
      const wLng = w.location?.coordinates?.lng || 77.21;
      const distance = calculateDistance(userLat, userLng, wLat, wLng);
      const travelTimeMinutes = Math.round(distance * 3.5 + 5);
      return {
        ...w,
        distance,
        travelTime: `${travelTimeMinutes} mins`,
        charges: w.hourlyRate || 350
      };
    });

    if (sort === "nearest") {
      enrichedWorkers.sort((a, b) => a.distance - b.distance);
    } else if (sort === "rating") {
      enrichedWorkers.sort((a, b) => b.rating - a.rating);
    } else if (sort === "price-low") {
      enrichedWorkers.sort((a, b) => a.charges - b.charges);
    } else if (sort === "experience") {
      enrichedWorkers.sort((a, b) => b.experienceYears - a.experienceYears);
    }

    res.json({
      success: true,
      count: enrichedWorkers.length,
      data: enrichedWorkers,
      customerLocation: { lat: userLat, lng: userLng }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/workers/nearby", async (req, res) => {
  try {
    const lat = Number(req.query.lat) || 28.6139;
    const lng = Number(req.query.lng) || 77.2090;
    const radius = Number(req.query.radius) || 10;
    const category = req.query.category;

    const workers = await WorkerProfile.find(category ? { category: new RegExp(String(category), "i") } : {}).populate("userId", "name email phone avatar").lean();
    
    const list = (workers.length > 0 ? workers : [
      {
        _id: "w1",
        userId: { name: "Rajesh Kumar", email: "rajesh@example.com", phone: "+91 98765 43210", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
        category: "Electrician",
        skills: ["Wiring", "Inverter", "MCB Repair", "AC Installation"],
        hourlyRate: 350,
        experienceYears: 6,
        bio: "Certified senior electrician with 6+ years experience in residential and commercial wiring.",
        location: { address: "Connaught Place, Block A", city: "New Delhi", pincode: "110001", coordinates: { lat: 28.6139, lng: 77.2090 } },
        verified: true,
        rating: 4.8,
        reviewsCount: 142,
        availabilityStatus: "available"
      },
      {
        _id: "w2",
        userId: { name: "Sunil Sharma", email: "sunil@example.com", phone: "+91 98765 43211", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
        category: "Plumber",
        skills: ["Pipe Leakage", "Bathroom Fitting", "Geyser Repair", "Water Tank"],
        hourlyRate: 300,
        experienceYears: 8,
        bio: "Expert plumber specializing in high-pressure leak detection and bathroom remodeling.",
        location: { address: "Sector 18, Noida", city: "Noida", pincode: "201301", coordinates: { lat: 28.5700, lng: 77.3200 } },
        verified: true,
        rating: 4.9,
        reviewsCount: 198,
        availabilityStatus: "available"
      },
      {
        _id: "w3",
        userId: { name: "Amit Verma", email: "amit@example.com", phone: "+91 98765 43212", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150" },
        category: "Carpenter",
        skills: ["Furniture Assembly", "Door Lock", "Modular Kitchen", "Wood Polishing"],
        hourlyRate: 400,
        experienceYears: 10,
        bio: "Master carpenter with extensive experience in custom furniture and architectural woodwork.",
        location: { address: "DLF Phase 3, Gurugram", city: "Gurugram", pincode: "122002", coordinates: { lat: 28.4950, lng: 77.0890 } },
        verified: true,
        rating: 4.7,
        reviewsCount: 96,
        availabilityStatus: "available"
      }
    ] as any).map((w: any) => {
      const wLat = w.location?.coordinates?.lat || 28.61;
      const wLng = w.location?.coordinates?.lng || 77.21;
      const distance = calculateDistance(lat, lng, wLat, wLng);
      return {
        ...w,
        distance,
        travelTime: `${Math.round(distance * 3.5 + 5)} mins`,
        charges: w.hourlyRate || 350
      };
    }).filter((w: any) => w.distance <= radius);

    res.json({
      success: true,
      radius,
      customerLocation: { lat, lng },
      count: list.length,
      data: list
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/maps/location", async (req, res) => {
  try {
    const { pincode, address } = req.query;
    const locationData = {
      address: address || "Connaught Place, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      pincode: pincode || "110001",
      coordinates: { lat: 28.6139, lng: 77.2090 }
    };
    res.json({ success: true, data: locationData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/maps/distance", async (req, res) => {
  try {
    const { origin, destination } = req.body;
    const lat1 = origin?.lat || 28.6139;
    const lng1 = origin?.lng || 77.2090;
    const lat2 = destination?.lat || 28.5700;
    const lng2 = destination?.lng || 77.3200;

    const distanceKm = calculateDistance(lat1, lng1, lat2, lng2);
    const durationMinutes = Math.round(distanceKm * 3.5 + 8);

    res.json({
      success: true,
      distance: { text: `${distanceKm} km`, value: distanceKm * 1000 },
      duration: { text: `${durationMinutes} mins`, value: durationMinutes * 60 },
      routeOverview: "Via Ring Road & Noida Expressway"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/saved-locations", async (req, res) => {
  try {
    const userId = String(req.query.userId || "guest_user");
    const locations = await SavedLocation.find({ userId }).lean();
    if (!locations || locations.length === 0) {
      return res.json({
        success: true,
        data: [
          { _id: "sl1", title: "Home", address: "A-42, Connaught Place", city: "New Delhi", pincode: "110001", coordinates: { lat: 28.6139, lng: 77.2090 } },
          { _id: "sl2", title: "Office", address: "Cyber City, Phase 2", city: "Gurugram", pincode: "122002", coordinates: { lat: 28.4950, lng: 77.0890 } }
        ]
      });
    }
    res.json({ success: true, data: locations });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/saved-locations", async (req, res) => {
  try {
    const { userId = "guest_user", title, address, city, pincode, coordinates } = req.body;
    const saved = await SavedLocation.create({ userId, title, address, city, pincode, coordinates });
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/saved-locations/:id", async (req, res) => {
  try {
    await SavedLocation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/search-history", async (req, res) => {
  try {
    const history = await SearchHistory.find().sort({ createdAt: -1 }).limit(10).lean();
    res.json({
      success: true,
      data: history.length > 0 ? history : [
        { _id: "sh1", query: "Plumber near Noida", createdAt: new Date() },
        { _id: "sh2", query: "Electrician under ₹500", createdAt: new Date() },
        { _id: "sh3", query: "AC Repair Delhi", createdAt: new Date() }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/search-history", async (req, res) => {
  try {
    const { query, category, filters } = req.body;
    const item = await SearchHistory.create({ query, category, filters });
    res.json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
