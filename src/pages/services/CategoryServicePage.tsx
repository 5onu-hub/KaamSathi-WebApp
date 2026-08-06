import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, Zap, Hammer, Paintbrush, Home, Sparkles, Building2, Trees, 
  Truck, Flame, Wind, Tv, Car, UserCheck, Users, Search, X, Star, 
  ChevronRight, ShieldCheck, Clock, ArrowRight, Filter, MapPin, Phone, 
  MessageSquare, Bookmark, Heart, CheckCircle2, AlertCircle, Sparkle,
  SlidersHorizontal, Check, RefreshCw, ThumbsUp, DollarSign, Calendar
} from "lucide-react";

import { WORKER_CATEGORIES, CITIES_LIST } from "../../constants";
import { NewBookingModal } from "../../components/booking/NewBookingModal";
import { AiRateEstimatorModal } from "../../components/services/AiRateEstimatorModal";
import { CallWorkerModal } from "../../components/services/CallWorkerModal";

// Expanded Worker Dataset for Service Discovery
const CATEGORY_WORKERS_DATA = [
  // Plumbing Workers
  {
    id: "w-plumb-1",
    name: "Suresh Sharma",
    category: "plumbing",
    skill: "Master Plumber & Pipe Specialist",
    rating: 4.9,
    reviewsCount: 184,
    experienceYears: 10,
    hourlyRate: 300,
    dailyRate: 1800,
    distanceKm: 1.8,
    responseTime: "< 15 Mins",
    languages: ["Hindi", "English"],
    verified: true,
    emergencyAvailable: true,
    availableToday: true,
    city: "Connaught Place, Delhi",
    pincode: "110001",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    bio: "Specialized in high-pressure pipe leakages, bathroom fitting installations, concealed plumbing, and water tank cleaning."
  },
  {
    id: "w-plumb-2",
    name: "Rajesh Kumar",
    category: "plumbing",
    skill: "Senior Hydraulic & Sanitary Plumber",
    rating: 4.8,
    reviewsCount: 142,
    experienceYears: 8,
    hourlyRate: 250,
    dailyRate: 1500,
    distanceKm: 2.5,
    responseTime: "< 20 Mins",
    languages: ["Hindi", "Punjabi"],
    verified: true,
    emergencyAvailable: true,
    availableToday: true,
    city: "South Extension, Delhi",
    pincode: "110049",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    bio: "100% precision plumbing for kitchen sinks, clogged drains, geyser fitting, and water meter installation."
  },
  {
    id: "w-plumb-3",
    name: "Deepak Verma",
    category: "plumbing",
    skill: "Commercial & Home Plumber",
    rating: 4.9,
    reviewsCount: 210,
    experienceYears: 12,
    hourlyRate: 320,
    dailyRate: 2000,
    distanceKm: 3.8,
    responseTime: "< 10 Mins",
    languages: ["Hindi", "English"],
    verified: true,
    emergencyAvailable: true,
    availableToday: true,
    city: "Noida Sector 62, UP",
    pincode: "201301",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    bio: "24/7 Emergency response plumber with complete pipe fitting kit and digital camera pipe inspection."
  },
  {
    id: "w-plumb-4",
    name: "Mohan Lal",
    category: "plumbing",
    skill: "Tap & Fitting Technician",
    rating: 4.7,
    reviewsCount: 96,
    experienceYears: 6,
    hourlyRate: 220,
    dailyRate: 1400,
    distanceKm: 4.2,
    responseTime: "< 30 Mins",
    languages: ["Hindi"],
    verified: true,
    emergencyAvailable: false,
    availableToday: true,
    city: "Lajpat Nagar, Delhi",
    pincode: "110024",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200",
    bio: "Affordable and fast tap repairs, flush valve replacement, and shower panel mounting."
  },

  // Electrical Workers
  {
    id: "w-elec-1",
    name: "Ramesh Kumar",
    category: "electrical",
    skill: "Expert Electrician & Wireman",
    rating: 4.9,
    reviewsCount: 230,
    experienceYears: 9,
    hourlyRate: 250,
    dailyRate: 1500,
    distanceKm: 1.2,
    responseTime: "< 15 Mins",
    languages: ["Hindi", "English"],
    verified: true,
    emergencyAvailable: true,
    availableToday: true,
    city: "Hauz Khas, Delhi",
    pincode: "110016",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    bio: "Short circuit repair, MCB tripping fix, chandelier installation, and full building wiring."
  },
  {
    id: "w-elec-2",
    name: "Vikram Malhotra",
    category: "electrical",
    skill: "Inverter & Heavy Appliance Specialist",
    rating: 4.8,
    reviewsCount: 165,
    experienceYears: 11,
    hourlyRate: 300,
    dailyRate: 1800,
    distanceKm: 2.9,
    responseTime: "< 25 Mins",
    languages: ["Hindi", "English"],
    verified: true,
    emergencyAvailable: true,
    availableToday: true,
    city: "Gurugram Phase 1",
    pincode: "122002",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200",
    bio: "Government certified wireman for high-voltage industrial & home electrical systems."
  },

  // Carpentry Workers
  {
    id: "w-carp-1",
    name: "Mohammad Aslam",
    category: "carpentry",
    skill: "Master Carpenter & Modular Furniture",
    rating: 4.9,
    reviewsCount: 154,
    experienceYears: 14,
    hourlyRate: 350,
    dailyRate: 2100,
    distanceKm: 2.1,
    responseTime: "< 30 Mins",
    languages: ["Hindi", "Urdu"],
    verified: true,
    emergencyAvailable: false,
    availableToday: true,
    city: "Okhla, Delhi",
    pincode: "110025",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    bio: "Custom woodwork, door lock fitting, modular kitchen assembly, and bed/wardrobe repairs."
  },

  // Painting Workers
  {
    id: "w-paint-1",
    name: "Vijay Singh",
    category: "painting",
    skill: "Wall Painter & Waterproofing Specialist",
    rating: 4.8,
    reviewsCount: 112,
    experienceYears: 7,
    hourlyRate: 280,
    dailyRate: 1600,
    distanceKm: 3.1,
    responseTime: "< 45 Mins",
    languages: ["Hindi"],
    verified: true,
    emergencyAvailable: false,
    availableToday: true,
    city: "Karol Bagh, Delhi",
    pincode: "110005",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200",
    bio: "Asian Paints certified interior & exterior painter, texture designer, and damp proof coating expert."
  },

  // Cleaning Workers
  {
    id: "w-clean-1",
    name: "Pooja Devi",
    category: "cleaning",
    skill: "Deep House Cleaning Lead",
    rating: 4.9,
    reviewsCount: 280,
    experienceYears: 6,
    hourlyRate: 200,
    dailyRate: 1200,
    distanceKm: 1.5,
    responseTime: "< 20 Mins",
    languages: ["Hindi", "English"],
    verified: true,
    emergencyAvailable: true,
    availableToday: true,
    city: "Dwarka Sector 10, Delhi",
    pincode: "110075",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    bio: "Equipped with industrial vacuum cleaners, eco-friendly chemicals for sofa, kitchen & bathroom deep sanitization."
  }
];

// Customer Reviews per Category
const REVIEWS_DATA = [
  {
    id: "rev-1",
    name: "Aakash Gupta",
    city: "South Delhi",
    rating: 5,
    date: "2 days ago",
    serviceUsed: "Emergency Tap & Pipe Burst",
    comment: "Suresh arrived within 25 minutes during a night pipe leakage emergency! He brought all necessary brass fittings and fixed the leak seamlessly. Unbelievable response time and zero hidden charges.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120",
    verified: true,
    helpfulCount: 24
  },
  {
    id: "rev-2",
    name: "Meenakshi Sundaram",
    city: "Noida Sector 50",
    rating: 5,
    date: "1 week ago",
    serviceUsed: "Full Bathroom Sanitary Fitting",
    comment: "Booked Deepak through KaamSathi for installing our whole new bathroom shower panel and mixer taps. Very polite worker, brought clean tools, and completed the job well ahead of schedule.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
    verified: true,
    helpfulCount: 18
  },
  {
    id: "rev-3",
    name: "Rohan Kapoor",
    city: "Gurugram Phase 3",
    rating: 5,
    date: "2 weeks ago",
    serviceUsed: "Water Tank Leakage Check",
    comment: "Transparent rate card made it so easy to estimate costs before calling. The worker was fully Aadhaar verified which gave us complete safety at home.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120",
    verified: true,
    helpfulCount: 12
  }
];

export function CategoryServicePage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  // Matched category metadata
  const categorySlug = (categoryId || "plumbing").toLowerCase();

  const currentCategory = useMemo(() => {
    const matched = WORKER_CATEGORIES.find(c => 
      c.id.toLowerCase() === categorySlug || 
      c.id.toLowerCase().replace("-", "") === categorySlug.replace("-", "") ||
      c.name.toLowerCase().includes(categorySlug) || 
      categorySlug.includes(c.id.toLowerCase())
    );

    if (matched) return matched;

    const formattedName = categorySlug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      id: categorySlug,
      name: formattedName,
      description: `Hire trusted and verified ${formattedName.toLowerCase()} professionals for home and commercial repair, maintenance, and installation services across India.`,
      startPrice: "₹250/hr",
      count: "9,800+ Workers",
      rating: 4.9,
      reviewsCount: "2,400+",
      icon: "Wrench",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1000",
      tags: ["Popular", "Emergency Available", "Verified Workers"]
    };
  }, [categorySlug]);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "featured" | "nearby" | "top_rated" | "emergency">("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "price_asc" | "price_desc" | "experience">("rating");

  // Bookmarks state
  const [savedWorkerIds, setSavedWorkerIds] = useState<string[]>([]);

  // Modals state
  const [bookingWorker, setBookingWorker] = useState<any | null>(null);
  const [callingWorker, setCallingWorker] = useState<any | null>(null);
  const [isAiEstimatorOpen, setIsAiEstimatorOpen] = useState(false);

  // Filter Workers List
  const filteredWorkers = useMemo(() => {
    let list = CATEGORY_WORKERS_DATA.filter(w => {
      // Category match (or fallback to showing workers for discovery)
      const matchesCategory = 
        w.category.toLowerCase().includes(categorySlug) || 
        categorySlug.includes(w.category.toLowerCase()) ||
        w.skill.toLowerCase().includes(currentCategory.name.toLowerCase());

      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        !query ||
        w.name.toLowerCase().includes(query) ||
        w.skill.toLowerCase().includes(query) ||
        w.city.toLowerCase().includes(query) ||
        w.pincode.includes(query);

      // Rating filter
      const matchesRating = w.rating >= minRating;

      // Price filter
      const matchesPrice = w.hourlyRate <= maxPrice;

      // Distance filter
      const matchesDistance = w.distanceKm <= maxDistance;

      // Verified filter
      const matchesVerified = !verifiedOnly || w.verified;

      // Emergency filter
      const matchesEmergency = !emergencyOnly || w.emergencyAvailable;

      // Language filter
      const matchesLanguage = selectedLanguage === "All" || w.languages.includes(selectedLanguage);

      return (matchesCategory || true) && matchesSearch && matchesRating && matchesPrice && matchesDistance && matchesVerified && matchesEmergency && matchesLanguage;
    });

    // Tab Filter
    if (selectedTab === "featured") {
      list = list.filter(w => w.rating >= 4.8 && w.reviewsCount > 100);
    } else if (selectedTab === "nearby") {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (selectedTab === "top_rated") {
      list = list.filter(w => w.rating >= 4.8);
    } else if (selectedTab === "emergency") {
      list = list.filter(w => w.emergencyAvailable);
    }

    // Sort
    if (sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "distance") {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === "price_asc") {
      list = [...list].sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === "price_desc") {
      list = [...list].sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (sortBy === "experience") {
      list = [...list].sort((a, b) => b.experienceYears - a.experienceYears);
    }

    return list;
  }, [categorySlug, currentCategory, searchQuery, selectedTab, minRating, maxPrice, maxDistance, verifiedOnly, emergencyOnly, selectedLanguage, sortBy]);

  const toggleSaveWorker = (workerId: string) => {
    setSavedWorkerIds(prev => 
      prev.includes(workerId) ? prev.filter(id => id !== workerId) : [...prev, workerId]
    );
  };

  // Popular rate cards breakdown for current category
  const rateCards = [
    { title: "Standard Leak & Repair", duration: "1 - 2 hrs", estPrice: currentCategory.startPrice, icon: Wrench, popular: true },
    { title: "Emergency Tap & Fitting Burst", duration: "30 - 45 mins", estPrice: "₹300/hr", icon: Zap, popular: true },
    { title: "Bathroom Sanitary & Tank Cleaning", duration: "3 - 4 hrs", estPrice: "₹800/service", icon: ShieldCheck, popular: false },
    { title: "Full Contractor & System Inspection", duration: "Full Day (8 hrs)", estPrice: "₹1,800/day", icon: CheckCircle2, popular: false }
  ];

  // FAQs
  const categoryFaqs = [
    {
      q: `How much does a ${currentCategory.name} worker charge on KaamSathi?`,
      a: `Charges on KaamSathi start at transparent hourly rates (e.g. ${currentCategory.startPrice}). Workers list their standard hourly and daily rates upfront with zero hidden fees or middleman commissions.`
    },
    {
      q: "How fast can an emergency worker arrive at my location?",
      a: "Our Emergency Dispatch feature matches you with verified nearby workers who can arrive at your address within 30 to 45 minutes."
    },
    {
      q: "Can I schedule a future booking for a specific date and time?",
      a: "Yes! You can choose any convenient date and morning/afternoon time slot up to 30 days in advance."
    },
    {
      q: "How are workers verified for safety and security?",
      a: "All workers undergo mandatory 100% Aadhaar identity verification, local police background verification, and skill capability checks before receiving their verified badge."
    },
    {
      q: "What payment options are supported?",
      a: "You can pay securely via UPI, Credit/Debit card, KaamSathi Wallet, or directly in Cash after the work is completed to your satisfaction."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Category Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-gray-900 text-white relative overflow-hidden">
        {/* Subtle background glow elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-blue-200/90 tracking-wide">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-orange-400 font-bold capitalize">{currentCategory.name}</span>
          </nav>

          {/* Banner Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Aadhaar Verified & Police Checked Workers</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight capitalize">
                Verified <span className="text-orange-400">{currentCategory.name}</span> Services
              </h1>

              <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                {currentCategory.description} Hire experienced local professionals with transparent rate cards, instant emergency dispatch, and direct contact.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => {
                    if (filteredWorkers.length > 0) {
                      setBookingWorker(filteredWorkers[0]);
                    } else {
                      setBookingWorker({ id: "default", name: `Assigned ${currentCategory.name} Specialist`, skill: currentCategory.name, hourlyRate: 300, city: "Delhi NCR", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" });
                    }
                  }}
                  className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Now</span>
                </button>

                <button
                  onClick={() => {
                    setEmergencyOnly(true);
                    setSelectedTab("emergency");
                  }}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Emergency Hiring (30-Min Arrival)</span>
                </button>

                <button
                  onClick={() => setIsAiEstimatorOpen(true)}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-blue-100 font-bold text-xs rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span>AI Rate Estimator</span>
                </button>
              </div>
            </div>

            {/* Right Banner Stats Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
                  <div className="text-[11px] font-semibold text-blue-200">Total Workers</div>
                  <div className="text-2xl font-black text-white mt-1">{currentCategory.count}</div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Active in 120+ Cities</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
                  <div className="text-[11px] font-semibold text-blue-200">Avg Rating</div>
                  <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{currentCategory.rating}</span>
                  </div>
                  <div className="text-[10px] text-gray-300 font-bold mt-0.5">{currentCategory.reviewsCount} Reviews</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
                  <div className="text-[11px] font-semibold text-blue-200">Starting Price</div>
                  <div className="text-2xl font-black text-orange-400 mt-1">{currentCategory.startPrice}</div>
                  <div className="text-[10px] text-gray-300 font-bold mt-0.5">0% Hidden Charges</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
                  <div className="text-[11px] font-semibold text-blue-200">Available Today</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">1,240+</div>
                  <div className="text-[10px] text-emerald-300 font-bold mt-0.5">Ready for Dispatch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* 2. Rate Cards & Popular Tasks Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Standard Rate Cards & Task Estimates</h2>
              <p className="text-xs text-gray-500">Transparent market pricing for common {currentCategory.name.toLowerCase()} tasks</p>
            </div>
            <button 
              onClick={() => setIsAiEstimatorOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-orange-500" /> Calculate Custom Estimate &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rateCards.map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <CardIcon className="w-5 h-5" />
                      </div>
                      {card.popular && (
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold">Popular</span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">{card.title}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Est. duration: {card.duration}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="font-black text-blue-600">{card.estPrice}</span>
                    <button 
                      onClick={() => setIsAiEstimatorOpen(true)}
                      className="text-[11px] font-bold text-orange-600 hover:underline"
                    >
                      Estimate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Search & Comprehensive Filter Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Live Search Input */}
            <div className="w-full md:w-96 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${currentCategory.name.toLowerCase()} workers by name, area, pincode...`}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: "all", label: "All Plumbers" },
                { id: "featured", label: "Featured" },
                { id: "nearby", label: "Nearby (< 3km)" },
                { id: "top_rated", label: "Top Rated (4.8+ ⭐)" },
                { id: "emergency", label: "Emergency 30m" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedTab(tab.id as any);
                    if (tab.id === "emergency") setEmergencyOnly(true);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedTab === tab.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-gray-100 hover:bg-gray-200/80 text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Filters Drawer Row */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* Sort Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-800 text-xs focus:outline-hidden"
              >
                <option value="rating">Highest Rated</option>
                <option value="distance">Nearest Distance</option>
                <option value="price_asc">Lowest Price</option>
                <option value="price_desc">Highest Price</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>

            {/* Min Rating */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-800 text-xs focus:outline-hidden"
              >
                <option value={0}>All Ratings</option>
                <option value={4.0}>4.0+ ⭐</option>
                <option value={4.5}>4.5+ ⭐</option>
                <option value={4.8}>4.8+ ⭐ (Top)</option>
              </select>
            </div>

            {/* Max Distance */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Distance Limit</label>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-800 text-xs focus:outline-hidden"
              >
                <option value={10}>Within 10 km</option>
                <option value={5}>Within 5 km</option>
                <option value={3}>Within 3 km</option>
                <option value={1.5}>Within 1.5 km</option>
              </select>
            </div>

            {/* Language */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-800 text-xs focus:outline-hidden"
              >
                <option value="All">All Languages</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="col-span-2 flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 accent-blue-600"
                />
                <span>Verified Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500 accent-emerald-600"
                />
                <span className="text-emerald-700">Emergency (30m)</span>
              </label>
            </div>
          </div>
        </div>

        {/* 4. Worker Grid Showcase */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Available {currentCategory.name} Professionals
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredWorkers.length} verified workers available in your area
              </p>
            </div>
          </div>

          {filteredWorkers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">No Workers Matched Filters</h3>
              <p className="text-xs text-gray-500">Try broadening your distance, price range, or clearing search keywords.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setMinRating(0);
                  setMaxPrice(1000);
                  setMaxDistance(10);
                  setVerifiedOnly(false);
                  setEmergencyOnly(false);
                  setSelectedLanguage("All");
                  setSelectedTab("all");
                }}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((worker) => {
                const isSaved = savedWorkerIds.includes(worker.id);

                return (
                  <motion.div
                    key={worker.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all p-6 flex flex-col justify-between space-y-5 relative group"
                  >
                    {/* Header: Photo, Name, Rating & Bookmark */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={worker.avatar} 
                              alt={worker.name} 
                              className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-100 shadow-xs"
                            />
                            {/* Online green indicator */}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Online now"></div>
                          </div>

                          <div className="space-y-0.5">
                            <h3 className="font-black text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                              {worker.name}
                            </h3>
                            <p className="text-xs font-semibold text-blue-600 line-clamp-1">{worker.skill}</p>

                            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Aadhaar Verified</span>
                            </div>
                          </div>
                        </div>

                        {/* Heart Bookmark */}
                        <button
                          onClick={() => toggleSaveWorker(worker.id)}
                          className={`p-2 rounded-xl transition-all ${
                            isSaved 
                              ? "bg-red-50 text-red-500" 
                              : "bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                          }`}
                          title={isSaved ? "Saved" : "Save worker"}
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500" : ""}`} />
                        </button>
                      </div>

                      {/* Micro Stats Row */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                        <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] text-gray-500">Rating</span>
                          <span className="font-black text-amber-600 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {worker.rating} ({worker.reviewsCount})
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] text-gray-500">Distance</span>
                          <span className="font-bold text-gray-800 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            {worker.distanceKm} km
                          </span>
                        </div>
                      </div>

                      {/* Bio & Details */}
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {worker.bio}
                      </p>

                      {/* Pricing & Response Time */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Hourly Charge</span>
                          <span className="text-base font-black text-blue-600">₹{worker.hourlyRate}/hr</span>
                          <span className="text-[10px] text-gray-500 block">₹{worker.dailyRate}/day</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                            ⚡ {worker.responseTime}
                          </span>
                          <div className="text-[10px] text-gray-400 font-medium mt-1">
                            {worker.languages.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="space-y-2 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setCallingWorker(worker)}
                          className="py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" /> Direct Call
                        </button>

                        <button
                          onClick={() => navigate(`/messages/${worker.id}`)}
                          className="py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Chat
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigate(`/workers/${worker.id}`)}
                          className="py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold text-xs transition-colors"
                        >
                          Full Profile
                        </button>

                        <button
                          onClick={() => setBookingWorker(worker)}
                          className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Emergency Hiring Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-gray-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>30-Minute Priority Local Dispatch</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Got a Plumbing Emergency?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Immediate tap bursts, severe pipe leaks, or drain blockages? Our nearest emergency verified workers are dispatched to your doorstep in under 30 minutes.
            </p>
          </div>

          <button
            onClick={() => {
              setEmergencyOnly(true);
              setSelectedTab("emergency");
            }}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-2xl shadow-xl shadow-orange-500/30 transition-all shrink-0 flex items-center gap-2 relative z-10"
          >
            <span>Dispatch Emergency Plumber</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6. Customer Reviews Section */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200 pb-4">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                Verified Reviews
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-2">
                What Customers Say About Our {currentCategory.name} Workers
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS_DATA.map((rev) => (
              <div key={rev.id} className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover border border-orange-200" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{rev.name}</h4>
                        <p className="text-[11px] text-gray-500">{rev.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                    {rev.serviceUsed}
                  </span>

                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                  <span>{rev.date}</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Customer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Category FAQ Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-500">Everything you need to know about hiring {currentCategory.name.toLowerCase()} workers on KaamSathi</p>
          </div>

          <div className="space-y-3">
            {categoryFaqs.map((faq, idx) => (
              <details key={idx} className="group p-4 rounded-2xl bg-gray-50 border border-gray-200/80 [&_summary::-webkit-details-marker]:none">
                <summary className="flex items-center justify-between font-bold text-gray-900 text-xs sm:text-sm cursor-pointer list-none">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </span>
                </summary>

                <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal border-t border-gray-200/60 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {bookingWorker && (
        <NewBookingModal
          isOpen={!!bookingWorker}
          onClose={() => setBookingWorker(null)}
          defaultWorker={{
            id: bookingWorker.id,
            name: bookingWorker.name,
            skill: bookingWorker.skill || currentCategory.name,
            hourlyRate: bookingWorker.hourlyRate || 300,
            city: bookingWorker.city || "Delhi NCR",
            avatar: bookingWorker.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
          }}
          onSuccess={(bookingId) => {
            setBookingWorker(null);
            navigate(`/bookings/${bookingId}`);
          }}
        />
      )}

      {/* Direct Call Modal */}
      {callingWorker && (
        <CallWorkerModal
          isOpen={!!callingWorker}
          onClose={() => setCallingWorker(null)}
          worker={callingWorker}
        />
      )}

      {/* AI Rate Estimator Modal */}
      <AiRateEstimatorModal
        isOpen={isAiEstimatorOpen}
        onClose={() => setIsAiEstimatorOpen(false)}
        categoryName={currentCategory.name}
        onProceedToBooking={(estData) => {
          setIsAiEstimatorOpen(false);
          setBookingWorker({
            id: "ai-est-worker",
            name: `Assigned ${currentCategory.name} Pro`,
            skill: estData.serviceName,
            hourlyRate: Math.round(estData.estCost / estData.estHours),
            city: "Delhi NCR",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
          });
        }}
      />
    </div>
  );
}
