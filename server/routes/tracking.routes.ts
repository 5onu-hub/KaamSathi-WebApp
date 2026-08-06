import { Router } from "express";

const router = Router();

// Get active booking tracking state
router.get("/:bookingId", (req, res) => {
  try {
    const { bookingId } = req.params;
    res.json({
      success: true,
      data: {
        bookingId: bookingId || "BK-88921",
        status: "travelling", // accepted, travelling, arrived, working, completed
        worker: {
          id: "w_905",
          name: "Ramesh Kumar",
          category: "Expert Electrician",
          phone: "+91 98765 43210",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
          rating: 4.9,
          currentLocation: { lat: 28.6139, lng: 77.2090 }, // New Delhi coordinates
          speedKmh: 32,
          heading: 145
        },
        customer: {
          name: "Amitabh Sen",
          address: "Flat 402, Sunshine Apartments, Connaught Place, New Delhi",
          location: { lat: 28.6280, lng: 77.2090 }
        },
        route: {
          distanceKm: 2.4,
          etaMins: 7,
          polylinePoints: [
            [28.6139, 77.2090],
            [28.6180, 77.2095],
            [28.6220, 77.2092],
            [28.6280, 77.2090]
          ]
        },
        milestones: [
          { title: "Booking Confirmed", time: "10:15 AM", completed: true },
          { title: "Worker Assigned", time: "10:16 AM", completed: true },
          { title: "Started Journey", time: "10:20 AM", completed: true },
          { title: "Arrived at Location", time: "Pending", completed: false },
          { title: "Service Completed", time: "Pending", completed: false }
        ]
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update worker tracking status or coordinates
router.post("/update-location", (req, res) => {
  try {
    const { bookingId, lat, lng, status, speedKmh } = req.body;
    res.json({
      success: true,
      message: "Location updated successfully",
      data: { bookingId, lat, lng, status, speedKmh, updatedAt: new Date().toISOString() }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
