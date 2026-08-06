import { Request, Response } from "express";
import { Service, IService } from "../models/Service.js";

// In-memory fallback if MongoDB connection is pending/offline
let memoryServices: any[] = [
  {
    _id: "srv_1",
    name: "Advanced Electrical & Wiring",
    slug: "advanced-electrical",
    category: "Electrical",
    subCategory: "Wiring & Installations",
    description: "Complete electrical maintenance, switch board repair, MCB replacement, fan installation, and heavy load wiring by certified electricians.",
    shortDescription: "Certified electrician services for home and office wiring, repairs & installations.",
    serviceIcon: "Zap",
    bannerImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600"
    ],
    basePrice: 299,
    hourlyPrice: 350,
    estimatedDuration: "1-2 Hours",
    emergencyAvailable: true,
    popularBadge: true,
    trendingBadge: true,
    featuredBadge: true,
    minExperienceRequired: 3,
    requiredSkills: ["Wire Testing", "MCB Installation", "Multimeter Operation"],
    requiredTools: ["Wire Stripper", "Insulated Screwdriver", "Digital Multimeter"],
    seoTitle: "Best Electrician & Wiring Services Near You | KaamSathi",
    seoDescription: "Book verified expert electricians instantly for wiring, switchboards, MCB, and electrical repairs with transparent pricing.",
    keywords: ["electrician", "wiring", "mcb", "fan installation", "switchboard"],
    status: "active",
    subServices: [
      { name: "Fan Installation & Repair", slug: "fan-installation", price: 249, duration: "45 mins" },
      { name: "Switchboard Repair & Replacement", slug: "switchboard-repair", price: 199, duration: "30 mins" },
      { name: "MCB & Fuse Replacement", slug: "mcb-replacement", price: 299, duration: "1 hour" },
      { name: "Complete House Wiring", slug: "house-wiring", price: 1499, duration: "4 hours" }
    ],
    termsAndConditions: "All electrical work guaranteed for 30 days. Safety gear required.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "srv_2",
    name: "Professional Plumbing & Leak Repair",
    slug: "professional-plumbing",
    category: "Plumbing",
    subCategory: "Pipe Repair & Fixtures",
    description: "Expert plumbers for pipe leakage, tap installation, geyser fitting, water tank cleaning, and bathroom sanitary repairs.",
    shortDescription: "Instant plumbing repair, tap fitting, and water leakage solutions.",
    serviceIcon: "Wrench",
    bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
    thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"
    ],
    basePrice: 249,
    hourlyPrice: 300,
    estimatedDuration: "1 Hour",
    emergencyAvailable: true,
    popularBadge: true,
    trendingBadge: false,
    featuredBadge: true,
    minExperienceRequired: 2,
    requiredSkills: ["Pipe Threading", "Leak Detection", "Sanitary Fitting"],
    requiredTools: ["Pipe Wrench", "Teflon Tape", "Plier Set"],
    seoTitle: "Emergency Plumber Services | KaamSathi",
    seoDescription: "Book certified plumbers for pipe leakage, tap fixing, and sanitary installations in 30 minutes.",
    keywords: ["plumber", "leak repair", "tap installation", "pipe fitting"],
    status: "active",
    subServices: [
      { name: "Tap & Faucet Repair", slug: "tap-repair", price: 199, duration: "30 mins" },
      { name: "Pipe Leakage Fix", slug: "pipe-leak", price: 349, duration: "1 hour" },
      { name: "Western Toilet Installation", slug: "toilet-install", price: 899, duration: "2 hours" },
      { name: "Water Tank Cleaning", slug: "tank-cleaning", price: 1199, duration: "3 hours" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "srv_3",
    name: "AC Repair & Maintenance Service",
    slug: "ac-repair-maintenance",
    category: "Appliance Repair",
    subCategory: "Cooling Appliances",
    description: "Comprehensive AC servicing, gas filling, compressor repair, and installation for Split and Window AC units.",
    shortDescription: "Expert AC servicing, gas charging, and cooling repair by certified technicians.",
    serviceIcon: "Cpu",
    bannerImage: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
    thumbnail: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600"
    ],
    basePrice: 499,
    hourlyPrice: 400,
    estimatedDuration: "1.5 Hours",
    emergencyAvailable: true,
    popularBadge: true,
    trendingBadge: true,
    featuredBadge: true,
    minExperienceRequired: 3,
    requiredSkills: ["Gas Charging", "Compressor Testing", "Coil Cleaning"],
    requiredTools: ["Manifold Gauge", "Vacuum Pump", "Hex Keys"],
    seoTitle: "AC Repair & Servicing Near You | KaamSathi",
    seoDescription: "Get fast AC repair, gas filling, and jet cleaning at unbeatable prices.",
    keywords: ["ac repair", "gas filling", "split ac service", "cooling"],
    status: "active",
    subServices: [
      { name: "AC General Servicing & Jet Clean", slug: "ac-service", price: 499, duration: "1 hour" },
      { name: "AC Gas Charging (R32/R410)", slug: "ac-gas-charging", price: 1999, duration: "1 hour" },
      { name: "AC Installation & Uninstallation", slug: "ac-install", price: 1299, duration: "2 hours" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "srv_4",
    name: "Deep Home Cleaning & Sanitation",
    slug: "deep-home-cleaning",
    category: "Cleaning & Pest",
    subCategory: "Full House Deep Clean",
    description: "Professional deep cleaning for kitchen, bathrooms, sofa, carpets, and complete apartment sanitation with industrial machines.",
    shortDescription: "Top-rated deep cleaning services for sparkling clean homes and offices.",
    serviceIcon: "Sparkles",
    bannerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600"
    ],
    basePrice: 1499,
    hourlyPrice: 350,
    estimatedDuration: "4-6 Hours",
    emergencyAvailable: false,
    popularBadge: true,
    trendingBadge: false,
    featuredBadge: true,
    minExperienceRequired: 2,
    requiredSkills: ["Machine Scrubbing", "Chemical Safety", "Upholstery Care"],
    requiredTools: ["Single Disc Scrubbing Machine", "Wet/Dry Vacuum", "Microfiber Cloths"],
    seoTitle: "Professional Deep Home Cleaning Services | KaamSathi",
    seoDescription: "Book expert cleaners for 1 BHK, 2 BHK, villa deep cleaning and sofa shampooing.",
    keywords: ["cleaning", "deep cleaning", "sofa cleaning", "pest control"],
    status: "active",
    subServices: [
      { name: "1 BHK Deep Cleaning", slug: "1bhk-cleaning", price: 1999, duration: "4 hours" },
      { name: "2 BHK Deep Cleaning", slug: "2bhk-cleaning", price: 2999, duration: "6 hours" },
      { name: "Sofa & Cushion Shampooing", slug: "sofa-cleaning", price: 799, duration: "2 hours" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, search, featured, popular, trending, status } = req.query;
    
    let query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (featured === "true") query.featuredBadge = true;
    if (popular === "true") query.popularBadge = true;
    if (trending === "true") query.trendingBadge = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { keywords: { $in: [new RegExp(search as string, "i")] } }
      ];
    }

    let services = await Service.find(query).sort({ createdAt: -1 });
    
    // If DB is empty, fallback to memory
    if ((!services || services.length === 0) && memoryServices.length > 0) {
      let filtered = memoryServices;
      if (category) filtered = filtered.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
      if (search) {
        const q = (search as string).toLowerCase();
        filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }
      services = filtered as any;
    }

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    let service = await Service.findOne({ slug });

    if (!service) {
      const memMatch = memoryServices.find(s => s.slug === slug || s._id === slug);
      if (memMatch) {
        service = memMatch as any;
      } else {
        return res.status(404).json({ success: false, message: `Service with slug '${slug}' not found` });
      }
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload.slug && payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    let newService;
    try {
      newService = await Service.create(payload);
    } catch (dbErr) {
      // Fallback to memory
      newService = {
        _id: `srv_${Date.now()}`,
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryServices.unshift(newService);
    }

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    let updated;
    try {
      updated = await Service.findByIdAndUpdate(id, updates, { new: true });
    } catch (e) {
      // ignore db error
    }

    const memIndex = memoryServices.findIndex(s => s._id === id || s.slug === id);
    if (memIndex !== -1) {
      memoryServices[memIndex] = { ...memoryServices[memIndex], ...updates };
      updated = memoryServices[memIndex];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      data: updated
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    try {
      await Service.findByIdAndDelete(id);
    } catch (e) {}

    memoryServices = memoryServices.filter(s => s._id !== id && s.slug !== id);

    res.json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateServiceStatus = async (req: Request, res: Response) => {
  try {
    const { ids, status, action } = req.body;
    
    if (action === "bulk-delete") {
      try {
        await Service.deleteMany({ _id: { $in: ids } });
      } catch (e) {}
      memoryServices = memoryServices.filter(s => !ids.includes(s._id));
      return res.json({ success: true, message: "Bulk delete successful" });
    }

    if (action === "bulk-status" && status) {
      try {
        await Service.updateMany({ _id: { $in: ids } }, { status, updatedAt: new Date() });
      } catch (e) {}
      memoryServices = memoryServices.map(s => ids.includes(s._id) ? { ...s, status, updatedAt: new Date() } : s);
      return res.json({ success: true, message: `Bulk status updated to ${status}` });
    }

    res.json({ success: true, message: "Action processed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let source = await Service.findById(id).lean();
    if (!source) {
      source = memoryServices.find(s => s._id === id || s.slug === id);
    }

    if (!source) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const copy: any = { ...source };
    delete copy._id;
    delete copy.__v;
    copy.name = `${copy.name} (Copy)`;
    copy.slug = `${copy.slug}-copy-${Date.now()}`;
    copy.createdAt = new Date();
    copy.updatedAt = new Date();

    let newDoc = await Service.create(copy).catch(() => null);
    if (!newDoc) {
      newDoc = { _id: `srv_${Date.now()}`, ...copy };
      memoryServices.unshift(newDoc);
    }

    res.status(201).json({
      success: true,
      message: "Service duplicated successfully",
      data: newDoc
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
