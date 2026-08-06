import { Router } from "express";

const router = Router();

// Get emergency categories and active nearby workers
router.get("/nearby", (req, res) => {
  try {
    const { category = "electrician", radiusKm = "5" } = req.query;
    res.json({
      success: true,
      emergencyCategories: [
        { id: "electrician", name: "Electric Short Circuit", icon: "Zap", avgEtaMins: 12, count: 8 },
        { id: "plumber", name: "Water Leakage / Pipe Burst", icon: "Droplet", avgEtaMins: 15, count: 6 },
        { id: "locksmith", name: "Door Lock Issue", icon: "Key", avgEtaMins: 10, count: 5 },
        { id: "driver", name: "Emergency Driver Needed", icon: "Car", avgEtaMins: 18, count: 4 },
        { id: "cleaner", name: "Emergency Cleaner (Spillage)", icon: "Sparkles", avgEtaMins: 20, count: 7 },
        { id: "medical", name: "Medical Attendant", icon: "Activity", avgEtaMins: 25, count: 3 }
      ],
      nearbyWorkers: [
        {
          id: "ew_1",
          name: "Ramesh Kumar",
          category: category,
          categoryName: "Expert Electrician",
          rating: 4.9,
          distanceKm: 1.2,
          etaMins: 8,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
          phone: "+91 98765 43210",
          emergencyReady: true,
          completedEmergencies: 42
        },
        {
          id: "ew_2",
          name: "Suresh Sharma",
          category: category,
          categoryName: "Senior Plumber",
          rating: 4.8,
          distanceKm: 2.4,
          etaMins: 14,
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
          phone: "+91 98765 43211",
          emergencyReady: true,
          completedEmergencies: 38
        },
        {
          id: "ew_3",
          name: "Amit Verma",
          category: category,
          categoryName: "Master Locksmith",
          rating: 4.95,
          distanceKm: 3.1,
          etaMins: 18,
          avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200",
          phone: "+91 98765 43212",
          emergencyReady: true,
          completedEmergencies: 55
        }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Broadcast Emergency SOS Request
router.post("/broadcast", (req, res) => {
  try {
    const { category, description, location, contactPhone } = req.body;
    res.json({
      success: true,
      emergencyId: "SOS-EMG-" + Math.floor(100000 + Math.random() * 900000),
      status: "Searching...",
      message: "Emergency broadcast sent to all nearby workers within 5km radius with high-priority siren and vibration.",
      assignedWorker: {
        name: "Ramesh Kumar",
        etaMins: 8,
        distanceKm: 1.2,
        phone: "+91 98765 43210"
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Emergency Analytics
router.get("/analytics", (req, res) => {
  try {
    res.json({
      success: true,
      totalEmergencyRequests: 1420,
      fastestResponseMins: 4.2,
      averageArrivalTimeMins: 12.5,
      successRatePercentage: 99.2,
      topEmergencyWorkers: [
        { name: "Ramesh Kumar", emergencies: 64, rating: 4.9 },
        { name: "Suresh Sharma", emergencies: 52, rating: 4.8 }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
