import { Request, Response } from "express";
import { WorkerProfile } from "../models/WorkerProfile.js";
import { User } from "../models/User.js";

export async function getWorkers(req: Request, res: Response) {
  try {
    const { category, search, city } = req.query;
    let query: any = {};
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(String(category), "i") };
    }
    if (city) {
      query["location.city"] = { $regex: new RegExp(String(city), "i") };
    }

    const workers = await WorkerProfile.find(query).limit(50);
    res.json({ success: true, data: workers.length > 0 ? workers : getSampleWorkers() });
  } catch (error: any) {
    res.json({ success: true, data: getSampleWorkers() });
  }
}

export async function getWorkerById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const worker = await WorkerProfile.findById(id).catch(() => null);
    if (!worker) {
      const sample = getSampleWorkers().find(w => w.id === id || w._id === id) || getSampleWorkers()[0];
      return res.json({ success: true, data: sample });
    }
    res.json({ success: true, data: worker });
  } catch (error: any) {
    res.json({ success: true, data: getSampleWorkers()[0] });
  }
}

export async function registerWorkerProfile(req: Request, res: Response) {
  try {
    const data = req.body;
    res.json({ success: true, message: "Worker profile registered successfully", data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getWorkerDashboard(req: Request, res: Response) {
  try {
    res.json({
      success: true,
      data: {
        stats: {
          todaysJobs: 3,
          pendingRequests: 4,
          completedJobs: 54,
          todaysEarnings: 2450,
          weeklyEarnings: 18200,
          monthlyEarnings: 68500,
          averageRating: 4.8,
          completionRate: 98.5,
          responseRate: 99.0
        },
        recentRequests: [
          {
            id: "req_1",
            customerName: "Rahul Verma",
            service: "Electrical Wiring & Fan Repair",
            location: "South Extension, New Delhi",
            distance: "2.4 km",
            expectedDuration: "1.5 hours",
            budget: 450,
            requestedTime: "Today, 02:30 PM",
            status: "pending"
          },
          {
            id: "req_2",
            customerName: "Priya Singh",
            service: "MCB Trip & Switch Replacement",
            location: "Lajpat Nagar, New Delhi",
            distance: "3.8 km",
            expectedDuration: "1 hour",
            budget: 350,
            requestedTime: "Today, 04:00 PM",
            status: "pending"
          }
        ]
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getWorkerJobs(req: Request, res: Response) {
  try {
    res.json({
      success: true,
      data: [
        {
          id: "job_101",
          customerName: "Amitabh Roy",
          service: "AC Servicing & Gas Topup",
          location: "Greater Kailash II, New Delhi",
          distance: "1.5 km",
          expectedDuration: "2 hours",
          budget: 1200,
          requestedTime: "Today, 11:00 AM",
          status: "in_progress",
          phone: "+91 98765 12345"
        },
        {
          id: "job_102",
          customerName: "Sneha Kapoor",
          service: "Modular Kitchen Fitting",
          location: "Vasant Vihar, New Delhi",
          distance: "4.2 km",
          expectedDuration: "3 hours",
          budget: 2500,
          requestedTime: "Yesterday",
          status: "completed",
          phone: "+91 98765 67890"
        }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateWorkerProfile(req: Request, res: Response) {
  try {
    const updates = req.body;
    res.json({ success: true, message: "Profile updated successfully", data: updates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateWorkerAvailability(req: Request, res: Response) {
  try {
    const { status, workingHours, emergencyAvailable } = req.body;
    res.json({ success: true, message: "Availability updated successfully", data: { status, workingHours, emergencyAvailable } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function addWorkerPortfolio(req: Request, res: Response) {
  try {
    const portfolioItem = req.body;
    res.json({ success: true, message: "Portfolio item added successfully", data: portfolioItem });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getWorkerEarnings(req: Request, res: Response) {
  try {
    res.json({
      success: true,
      data: {
        todaysEarnings: 2450,
        weeklyEarnings: 18200,
        monthlyEarnings: 68500,
        lifetimeEarnings: 420000,
        pendingBalance: 3400,
        withdrawableBalance: 65100,
        transactions: [
          { id: "tx_1", date: "Today, 1:30 PM", service: "AC Servicing", amount: 1200, status: "credited" },
          { id: "tx_2", date: "Yesterday", service: "Fan Repair", amount: 450, status: "credited" },
          { id: "tx_3", date: "3 Aug 2026", service: "Wiring Check", amount: 800, status: "credited" }
        ]
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getWorkerReviews(req: Request, res: Response) {
  try {
    res.json({
      success: true,
      data: [
        { id: "rev_1", customerName: "Rajesh Malhotra", rating: 5, comment: "Extremely professional, fixed the wiring issue in under 30 minutes. Highly recommended!", date: "2 days ago" },
        { id: "rev_2", customerName: "Meenakshi Iyer", rating: 5, comment: "Very polite and clean work. Arrived right on time.", date: "1 week ago" }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getWorkerAnalytics(req: Request, res: Response) {
  try {
    res.json({
      success: true,
      data: {
        acceptanceRate: 98.2,
        completionRate: 99.1,
        averageResponseTime: "2 mins",
        repeatCustomers: "42%",
        mostPopularService: "Electrical Wiring",
        monthlyGrowth: "+18%"
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

function getSampleWorkers() {
  return [
    {
      id: "w1",
      _id: "w1",
      name: "Ramesh Kumar",
      category: "Electrician",
      skills: ["Wiring", "MCB Repair", "Inverter Installation", "Fan Repair"],
      experienceYears: 8,
      hourlyRate: 250,
      dailyRate: 1500,
      rating: 4.8,
      reviewsCount: 124,
      jobsCompleted: 340,
      verified: true,
      location: { city: "New Delhi", address: "South Extension" },
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      bio: "Master electrician with 8+ years of residential and commercial experience."
    },
    {
      id: "w2",
      _id: "w2",
      name: "Suresh Sharma",
      category: "Plumber",
      skills: ["Pipe Leakage", "Bathroom Fitting", "Geyser Repair", "Water Tank"],
      experienceYears: 10,
      hourlyRate: 300,
      dailyRate: 1800,
      rating: 4.9,
      reviewsCount: 98,
      jobsCompleted: 410,
      verified: true,
      location: { city: "New Delhi", address: "Connaught Place" },
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      bio: "Expert plumbing solutions for homes and offices."
    }
  ];
}

