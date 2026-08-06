import React, { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, Zap, Hammer, Paintbrush, Home, Sparkles, Building2, Trees, 
  Truck, Flame, Wind, Tv, Car, UserCheck, Users, Search, ChevronRight, 
  Star, ShieldCheck, Clock, ArrowLeft, Filter, Phone, MessageSquare, 
  Bookmark, MapPin, CheckCircle2, ChevronDown, ChevronUp, SparklesIcon, 
  Calculator, AlertTriangle, Shield, Calendar, DollarSign, Award
} from "lucide-react";
import { getServiceBySlug, searchAllServices, SERVICE_GROUPS_DATA } from "../../data/servicesMasterData";
import { SEOHead } from "../../components/common/SEOHead";
import { AiRateEstimatorModal } from "../../components/services/AiRateEstimatorModal";
import { CallWorkerModal } from "../../components/services/CallWorkerModal";
import { NewBookingModal } from "../../components/services/NewBookingModal";

interface Worker {
  id: string;
  name: string;
  skill: string;
  rating: number;
  reviewsCount: number;
  experience: string;
  hourlyRate: string;
  hourlyRateNumber: number;
  dailyRate: string;
  dailyRateNumber: number;
  city: string;
  phone: string;
  verified: boolean;
  emergencyAvailable: boolean;
  distanceKm: number;
  responseTime: string;
  languages: string[];
  gender: "Male" | "Female";
  avatar: string;
  about: string;
}

export function DynamicServiceDetailsPage() {
  const { categorySlug, serviceSlug } = useParams<{ categorySlug?: string; serviceSlug?: string }>();
  const navigate = useNavigate();

  // Determine active service slug and group slug
  const activeServiceSlug = serviceSlug || categorySlug || "plumbing";
  const activeGroupSlug = serviceSlug ? categorySlug : undefined;

  const match = getServiceBySlug(activeServiceSlug, activeGroupSlug);

  // Modal States
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [selectedCallWorker, setSelectedCallWorker] = useState<Worker | null>(null);
  const [selectedBookWorker, setSelectedBookWorker] = useState<Worker | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Nearby" | "Featured" | "Verified" | "Recommended" | "Emergency">("All");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "price" | "experience">("rating");
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [selectedGender, setSelectedGender] = useState<"Any" | "Male" | "Female">("Any");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [savedWorkerIds, setSavedWorkerIds] = useState<string[]>([]);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4 border border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl font-black">
            404
          </div>
          <h2 className="text-xl font-black text-gray-900">Service Page Not Found</h2>
          <p className="text-xs text-gray-500">
            We couldn't find any service matching "{activeServiceSlug}". Please explore our categories.
          </p>
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Browse All Service Categories
          </Link>
        </div>
      </div>
    );
  }

  const { service, group } = match;

  // Mock Workers Dataset
  const mockWorkers: Worker[] = [
    {
      id: "w1",
      name: "Ramesh Kumar",
      skill: `Master ${service.name} Specialist`,
      rating: 4.9,
      reviewsCount: 142,
      experience: "8 Years",
      hourlyRate: service.startPrice,
      hourlyRateNumber: service.startingPriceNumber,
      dailyRate: "₹1,800/day",
      dailyRateNumber: 1800,
      city: "South Delhi, Delhi NCR",
      phone: "+91 98765 43210",
      verified: true,
      emergencyAvailable: true,
      distanceKm: 1.2,
      responseTime: "15 Mins",
      languages: ["Hindi", "English"],
      gender: "Male",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      about: `Expert certified in residential and commercial ${service.name} services with over 8 years of field experience.`
    },
    {
      id: "w2",
      name: "Suresh Sharma",
      skill: `Senior ${service.name} Technician`,
      rating: 4.8,
      reviewsCount: 98,
      experience: "10 Years",
      hourlyRate: `₹${service.startingPriceNumber + 50}/hr`,
      hourlyRateNumber: service.startingPriceNumber + 50,
      dailyRate: "₹2,000/day",
      dailyRateNumber: 2000,
      city: "Connaught Place, Delhi",
      phone: "+91 98765 43211",
      verified: true,
      emergencyAvailable: true,
      distanceKm: 2.8,
      responseTime: "20 Mins",
      languages: ["Hindi"],
      gender: "Male",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      about: `Specialized in complex ${service.name} fittings, trouble diagnostics, and fast local dispatch.`
    },
    {
      id: "w3",
      name: "Vijay Singh",
      skill: `Lead ${service.name} Contractor`,
      rating: 4.7,
      reviewsCount: 84,
      experience: "6 Years",
      hourlyRate: service.startPrice,
      hourlyRateNumber: service.startingPriceNumber,
      dailyRate: "₹1,600/day",
      dailyRateNumber: 1600,
      city: "Noida Sector 62, UP",
      phone: "+91 98765 43213",
      verified: true,
      emergencyAvailable: false,
      distanceKm: 4.5,
      responseTime: "30 Mins",
      languages: ["Hindi", "English"],
      gender: "Male",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
      about: `Reliable ${service.name} professional with complete toolkit and 100% Aadhaar verification.`
    },
    {
      id: "w4",
      name: "Sunita Devi",
      skill: `Certified ${service.name} Expert`,
      rating: 4.9,
      reviewsCount: 112,
      experience: "7 Years",
      hourlyRate: service.startPrice,
      hourlyRateNumber: service.startingPriceNumber,
      dailyRate: "₹1,700/day",
      dailyRateNumber: 1700,
      city: "Gurugram Phase 4, Haryana",
      phone: "+91 98765 43214",
      verified: true,
      emergencyAvailable: true,
      distanceKm: 3.1,
      responseTime: "15 Mins",
      languages: ["Hindi", "Punjabi"],
      gender: "Female",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      about: `Punctual and detail-oriented ${service.name} professional with top customer ratings.`
    }
  ];

  // Filter & Sort Logic
  const filteredWorkers = useMemo(() => {
    return mockWorkers.filter(w => {
      // Search
      const matchesSearch = 
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.city.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter Tabs
      if (activeTab === "Nearby" && w.distanceKm > 3) return false;
      if (activeTab === "Emergency" && !w.emergencyAvailable) return false;
      if (activeTab === "Verified" && !w.verified) return false;
      if (activeTab === "Featured" && w.rating < 4.8) return false;

      // Distance Slider
      if (w.distanceKm > maxDistance) return false;

      // Gender
      if (selectedGender !== "Any" && w.gender !== selectedGender) return false;

      // Language
      if (selectedLanguage !== "All" && !w.languages.includes(selectedLanguage)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      if (sortBy === "price") return a.hourlyRateNumber - b.hourlyRateNumber;
      if (sortBy === "experience") return parseInt(b.experience) - parseInt(a.experience);
      return 0;
    });
  }, [mockWorkers, searchQuery, activeTab, sortBy, maxDistance, selectedGender, selectedLanguage]);

  const toggleSaveWorker = (id: string) => {
    setSavedWorkerIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Related Services in same group
  const relatedServices = group.services.filter(s => s.slug !== service.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20 font-sans selection:bg-blue-600 selection:text-white">
      {/* SEO Head */}
      <SEOHead 
        title={service.seoTitle}
        description={service.seoDescription}
        keywords={service.keywords}
        ogImage={service.bannerImage}
      />

      {/* 1. Category / Service Parallax Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-gray-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-blue-200/90 tracking-wide flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            <Link to={`/services/${group.slug}`} className="hover:text-white transition-colors">{group.name}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-orange-400 font-bold">{service.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-xs shadow-md">
                  {group.name}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Aadhaar Verified
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 border border-blue-700/50 font-bold text-xs">
                  0% Commission
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {service.name} <span className="text-orange-400">Services</span>
              </h1>

              <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed font-normal">
                {service.description}
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Total Workers</span>
                  <span className="text-lg font-black text-white">{service.totalWorkers}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Average Rating</span>
                  <span className="text-lg font-black text-amber-300 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-300" /> {service.avgRating}
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Starting Rate</span>
                  <span className="text-lg font-black text-emerald-400">{service.startPrice}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Available Today</span>
                  <span className="text-lg font-black text-orange-400">{service.availableToday}</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xl shadow-orange-500/20 transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book {service.name} Now
                </button>

                <button
                  onClick={() => setIsEstimatorOpen(true)}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-orange-400" /> AI Rate Estimator
                </button>
              </div>
            </div>

            {/* Banner Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl h-64 sm:h-80 group">
                <img 
                  src={service.bannerImage} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">Emergency Dispatch</p>
                  <p className="text-sm font-black">Verified nearby workers arrive within 30-45 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* 2. Popular Tasks & Transparent Rate Cards */}
        {service.popularTasks && service.popularTasks.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  Transparent Standard Rates
                </span>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-2">
                  Popular {service.name} Tasks & Pricing
                </h2>
              </div>
              <button 
                onClick={() => setIsEstimatorOpen(true)} 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
              >
                Estimate custom job cost &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {service.popularTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-2 hover:border-blue-300 transition-colors"
                >
                  <h4 className="font-black text-gray-900 text-sm">{task.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-600" /> {task.duration}</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{task.estPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Search & Workers Filter Bar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Available Verified {service.name} Workers
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Browse workers near your location, compare rates, check reviews, and hire directly.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full lg:w-80 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search worker by name, skill, area, city..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            {/* Filter Tabs & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {(["All", "Nearby", "Featured", "Verified", "Emergency"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 hover:bg-gray-200/80 text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Sorting & Additional Filters */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Nearest Distance</option>
                  <option value="price">Lowest Price</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Worker Cards Grid */}
          {filteredWorkers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3 max-w-md mx-auto">
              <Search className="w-8 h-8 text-orange-500 mx-auto" />
              <h3 className="font-bold text-gray-900 text-base">No Workers Found</h3>
              <p className="text-xs text-gray-500">No worker matched your search filters. Try resetting search criteria.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveTab("All"); setMaxDistance(15); }} 
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWorkers.map((worker) => {
                const isSaved = savedWorkerIds.includes(worker.id);

                return (
                  <motion.div
                    key={worker.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all space-y-5 flex flex-col justify-between"
                  >
                    {/* Top Row: Avatar + Info + Bookmark */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={worker.avatar} 
                            alt={worker.name} 
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" 
                          />
                          <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Online & Available"></span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-gray-900 hover:text-blue-600 transition-colors">
                              {worker.name}
                            </h3>
                            {worker.verified && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Aadhaar Verified
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-blue-600 font-bold mt-0.5">{worker.skill}</p>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" /> {worker.rating} ({worker.reviewsCount})
                            </span>
                            <span>•</span>
                            <span className="font-medium text-gray-600">{worker.experience} Experience</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveWorker(worker.id)}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          isSaved 
                            ? "bg-rose-50 text-rose-600 border-rose-200" 
                            : "bg-gray-50 text-gray-400 hover:text-gray-600 border-gray-200"
                        }`}
                        title={isSaved ? "Saved" : "Save worker"}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-rose-600" : ""}`} />
                      </button>
                    </div>

                    {/* Location & Response stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-600 truncate">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{worker.city} ({worker.distanceKm} km away)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Dispatch: {worker.responseTime}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Hourly Rate</span>
                        <span className="text-base font-black text-blue-900">{worker.hourlyRate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Daily Wage</span>
                        <span className="text-base font-black text-emerald-700">{worker.dailyRate}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedCallWorker(worker)}
                        className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </button>

                      <button
                        onClick={() => navigate(`/messages/conv-${worker.id}`)}
                        className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Chat
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBookWorker(worker);
                          setIsBookModalOpen(true);
                        }}
                        className="py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              Verified Feedback
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-2">
              Customer Reviews for {service.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: "rev1",
                name: "Ananya Deshmukh",
                rating: 5,
                date: "2 days ago",
                comment: `Booked ${service.name} service for my apartment in Mumbai. Ramesh arrived on time, was polite, fixed the problem quickly, and charged exact rate without middleman fee!`,
                verified: true,
                helpfulCount: 14
              },
              {
                id: "rev2",
                name: "Rajesh Malhotra",
                rating: 5,
                date: "1 week ago",
                comment: `Very smooth experience. The Aadhaar verification badge gave me complete peace of mind. Highly recommended!`,
                verified: true,
                helpfulCount: 8
              }
            ].map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {rev.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{rev.name}</h4>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {rev.rating}.0
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Customer
                  </span>
                  <span>{rev.helpfulCount} people found this helpful</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Safety Tips & Guidelines */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-gray-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-blue-800 shadow-xl">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-5 h-5 text-orange-400" /> Safety & Quality Guarantee
          </div>
          <h3 className="text-xl font-black text-white">Your Safety is Our Top Priority</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="font-bold text-emerald-400 block">100% Aadhaar Verified</span>
              <p className="text-blue-100/80">Every worker undergoes mandatory identity and police background check.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="font-bold text-orange-400 block">Zero Advance Cash</span>
              <p className="text-blue-100/80">Never pay any money upfront before work inspection and completion.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="font-bold text-amber-400 block">Direct Rate Cards</span>
              <p className="text-blue-100/80">Transparent hourly and daily rate cards with 0% platform commission.</p>
            </div>
          </div>
        </div>

        {/* 7. FAQs Accordion */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Frequently Asked Questions about {service.name}
              </h2>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq, index) => {
                const isExpanded = expandedFaqIndex === index;

                return (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                      className="w-full text-left p-4 bg-gray-50/50 hover:bg-gray-100/80 font-bold text-gray-900 text-xs flex items-center justify-between gap-3 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {isExpanded && (
                      <div className="p-4 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. Related Services Cards */}
        {relatedServices.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Related Services in {group.name}
                </h3>
              </div>
              <Link to={`/services/${group.slug}`} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View all {group.name} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedServices.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/services/${group.slug}/${rel.slug}`)}
                  className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group space-y-3"
                >
                  <div className="h-28 rounded-2xl overflow-hidden bg-gray-100 relative">
                    <img src={rel.bannerImage} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                      Starting {rel.startPrice}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-xs group-hover:text-blue-600 transition-colors">{rel.name}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{rel.shortDesc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <AiRateEstimatorModal 
        isOpen={isEstimatorOpen} 
        onClose={() => setIsEstimatorOpen(false)} 
        categoryName={service.name} 
        onProceedToBooking={() => {
          setIsEstimatorOpen(false);
          setIsBookModalOpen(true);
        }}
      />

      <CallWorkerModal
        isOpen={!!selectedCallWorker}
        onClose={() => setSelectedCallWorker(null)}
        worker={selectedCallWorker ? {
          id: selectedCallWorker.id,
          name: selectedCallWorker.name,
          phone: selectedCallWorker.phone,
          avatar: selectedCallWorker.avatar,
          skill: selectedCallWorker.skill,
          rating: selectedCallWorker.rating,
          city: selectedCallWorker.city
        } : { id: "", name: "", phone: "", avatar: "", skill: "", rating: 5, city: "" }}
      />

      <NewBookingModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedBookWorker(null);
        }}
        serviceTitle={service.name}
        workerName={selectedBookWorker?.name}
        startingPrice={selectedBookWorker?.hourlyRate || service.startPrice}
      />
    </div>
  );
}
