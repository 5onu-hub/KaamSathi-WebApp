import { Router, Request, Response } from "express";
import { 
  SERVICE_GROUPS_DATA, 
  getAllServiceGroups, 
  getServiceGroup, 
  getServiceBySlug, 
  searchAllServices 
} from "../../src/data/servicesMasterData.js";

const router = Router();

// 1. GET /api/v1/services/groups OR /api/v1/service-groups
router.get("/groups", (req: Request, res: Response) => {
  try {
    const groups = getAllServiceGroups().map(g => ({
      id: g.id,
      slug: g.slug,
      name: g.name,
      icon: g.icon,
      emoji: g.emoji,
      description: g.description,
      bannerImage: g.bannerImage,
      serviceCount: g.services.length,
      active: g.active,
      order: g.order
    }));

    res.json({
      success: true,
      data: groups
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Alias for /api/v1/service-groups
router.get("/service-groups", (req: Request, res: Response) => {
  try {
    const groups = getAllServiceGroups();
    res.json({ success: true, data: groups });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET /api/v1/services/search
router.get("/search", (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";
    const results = searchAllServices(q);

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. GET /api/v1/services - All Services across all groups
router.get("/", (req: Request, res: Response) => {
  try {
    const allServices = SERVICE_GROUPS_DATA.flatMap(g => 
      g.services.map(s => ({ ...s, groupName: g.name, groupSlug: g.slug }))
    );

    res.json({
      success: true,
      count: allServices.length,
      data: allServices
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. GET /api/v1/services/groups/:groupSlug
router.get("/groups/:groupSlug", (req: Request, res: Response) => {
  try {
    const { groupSlug } = req.params;
    const group = getServiceGroup(groupSlug);

    if (!group) {
      return res.status(404).json({ success: false, message: `Service group '${groupSlug}' not found` });
    }

    res.json({
      success: true,
      data: group
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. GET /api/v1/services/:groupSlug/:serviceSlug OR /api/v1/services/:serviceSlug
router.get("/:param1/:param2?", (req: Request, res: Response) => {
  try {
    const { param1, param2 } = req.params;

    let match;
    if (param2) {
      match = getServiceBySlug(param2, param1);
    } else {
      match = getServiceBySlug(param1);
      if (!match) {
        // Try checking if param1 is actually a service group
        const groupMatch = getServiceGroup(param1);
        if (groupMatch) {
          return res.json({
            success: true,
            isGroup: true,
            data: groupMatch
          });
        }
      }
    }

    if (!match) {
      return res.status(404).json({ 
        success: false, 
        message: `Service '${param2 || param1}' not found.` 
      });
    }

    const { service, group } = match;

    const fullDetails = {
      ...service,
      groupName: group.name,
      groupSlug: group.slug,
      stats: {
        totalWorkers: service.totalWorkers,
        averageRating: service.avgRating,
        startingPrice: service.startPrice,
        availableToday: service.availableToday
      },
      nearbyWorkers: [
        {
          id: "w101",
          name: "Ramesh Kumar",
          skill: `Expert ${service.name} Specialist`,
          rating: 4.9,
          reviewsCount: 142,
          experience: "8 Years",
          hourlyRate: service.startPrice,
          dailyRate: "₹1,800/day",
          city: "Delhi NCR",
          phone: "+91 98765 43210",
          verified: true,
          emergencyAvailable: true,
          distance: "1.2 km away",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        },
        {
          id: "w102",
          name: "Suresh Sharma",
          skill: `Master ${service.name} Technician`,
          rating: 4.8,
          reviewsCount: 98,
          experience: "10 Years",
          hourlyRate: service.startPrice,
          dailyRate: "₹2,000/day",
          city: "Mumbai",
          phone: "+91 98765 43211",
          verified: true,
          emergencyAvailable: true,
          distance: "2.4 km away",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
        },
        {
          id: "w103",
          name: "Vijay Singh",
          skill: `${service.name} Pro Contractor`,
          rating: 4.7,
          reviewsCount: 84,
          experience: "7 Years",
          hourlyRate: service.startPrice,
          dailyRate: "₹1,600/day",
          city: "Bangalore",
          phone: "+91 98765 43213",
          verified: true,
          emergencyAvailable: false,
          distance: "3.1 km away",
          avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
        }
      ],
      reviews: [
        {
          id: "r1",
          customerName: "Ananya Deshmukh",
          rating: 5,
          date: "2 days ago",
          comment: `Booked ${service.name} service for my apartment. The worker arrived within 25 minutes and fixed everything seamlessly!`,
          verifiedBooking: true,
          helpfulCount: 14
        },
        {
          id: "r2",
          customerName: "Rajesh Malhotra",
          rating: 5,
          date: "1 week ago",
          comment: "Very professional service, zero middleman commission, transparent pricing as promised.",
          verifiedBooking: true,
          helpfulCount: 9
        }
      ]
    };

    res.json({
      success: true,
      data: fullDetails
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Management APIs
router.post("/admin/groups", (req: Request, res: Response) => {
  res.json({ success: true, message: "Group created successfully", data: req.body });
});

router.put("/admin/groups/:id", (req: Request, res: Response) => {
  res.json({ success: true, message: `Group ${req.params.id} updated successfully` });
});

router.delete("/admin/groups/:id", (req: Request, res: Response) => {
  res.json({ success: true, message: `Group ${req.params.id} deleted successfully` });
});

export default router;
