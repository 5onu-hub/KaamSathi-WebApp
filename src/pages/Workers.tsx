import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Star, ShieldCheck, Filter, X, CheckCircle2, 
  Sparkles, Calendar, MessageSquare, Phone, Bookmark, BookmarkCheck, 
  SlidersHorizontal, Clock, DollarSign, Award, ChevronDown, RotateCcw,
  Zap, Navigation, Check
} from "lucide-react";
import { WORKER_CATEGORIES, CITIES_LIST } from "../constants";

export interface WorkerProfile {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  rating: number;
  reviewsCount: number;
  jobsCompleted: number;
  hourlyRate: number;
  dailyRate: number;
  location: string;
  city: string;
  experienceYears: number;
  verified: boolean;
  policeVerified: boolean;
  aiRecommended?: boolean;
  onlineStatus: "online" | "busy" | "offline";
  avatar: string;
  bio: string;
  languages: string[];
  distance: string;
  responseTime: string;
  availability: "Available Today" | "Available Tomorrow" | "Booked";
  gender: "Male" | "Female" | "Other";
  emergencyAvailable: boolean;
}

const MOCK_WORKERS_CATALOG: WorkerProfile[] = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    category: "electrician",
    categoryName: "Electrician",
    rating: 4.9,
    reviewsCount: 142,
    jobsCompleted: 320,
    hourlyRate: 250,
    dailyRate: 1800,
    location: "Hazratganj, Lucknow",
    city: "Lucknow",
    experienceYears: 8,
    verified: true,
    policeVerified: true,
    aiRecommended: true,
    onlineStatus: "online",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    bio: "Expert in residential & commercial wiring, MCB troubleshooting, inverter repair, and LED lighting setup.",
    languages: ["Hindi", "English"],
    distance: "1.2 km away",
    responseTime: "Under 15 mins",
    availability: "Available Today",
    gender: "Male",
    emergencyAvailable: true
  },
  {
    id: "w2",
    name: "Suresh Sharma",
    category: "plumber",
    categoryName: "Plumber",
    rating: 4.8,
    reviewsCount: 98,
    jobsCompleted: 215,
    hourlyRate: 300,
    dailyRate: 2200,
    location: "Connaught Place, Delhi",
    city: "Delhi",
    experienceYears: 10,
    verified: true,
    policeVerified: true,
    aiRecommended: false,
    onlineStatus: "online",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    bio: "Specialized in pipe leakage fixing, bathroom sanitary fittings, water tank cleaning, and geyser installation.",
    languages: ["Hindi", "English", "Punjabi"],
    distance: "2.5 km away",
    responseTime: "Under 30 mins",
    availability: "Available Today",
    gender: "Male",
    emergencyAvailable: true
  },
  {
    id: "w3",
    name: "Amit Verma",
    category: "carpenter",
    categoryName: "Carpenter",
    rating: 4.7,
    reviewsCount: 76,
    jobsCompleted: 180,
    hourlyRate: 350,
    dailyRate: 2500,
    location: "Sector 62, Noida",
    city: "Noida",
    experienceYears: 6,
    verified: true,
    policeVerified: true,
    aiRecommended: true,
    onlineStatus: "busy",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80",
    bio: "Custom modular furniture design, door/window repairs, bed and wardrobe assembly with precision tools.",
    languages: ["Hindi"],
    distance: "3.8 km away",
    responseTime: "Under 45 mins",
    availability: "Available Tomorrow",
    gender: "Male",
    emergencyAvailable: false
  },
  {
    id: "w4",
    name: "Pooja Devi",
    category: "cleaner",
    categoryName: "House Cleaner",
    rating: 4.9,
    reviewsCount: 210,
    jobsCompleted: 450,
    hourlyRate: 200,
    dailyRate: 1500,
    location: "Phase 4, Gurugram",
    city: "Gurugram",
    experienceYears: 5,
    verified: true,
    policeVerified: true,
    aiRecommended: true,
    onlineStatus: "online",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    bio: "Deep home cleaning, dusting, kitchen chimney degreasing, bathroom sanitization, and sofa shampooing.",
    languages: ["Hindi", "English"],
    distance: "1.9 km away",
    responseTime: "Under 20 mins",
    availability: "Available Today",
    gender: "Female",
    emergencyAvailable: true
  },
  {
    id: "w5",
    name: "Rajesh Painter",
    category: "painter",
    categoryName: "Painter",
    rating: 4.6,
    reviewsCount: 64,
    jobsCompleted: 130,
    hourlyRate: 280,
    dailyRate: 2000,
    location: "Alambagh, Lucknow",
    city: "Lucknow",
    experienceYears: 12,
    verified: true,
    policeVerified: true,
    aiRecommended: false,
    onlineStatus: "offline",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    bio: "Royal paint textures, waterproofing, wall putty, interior & exterior emulsion painting with clean finish.",
    languages: ["Hindi"],
    distance: "4.1 km away",
    responseTime: "Within 1 hour",
    availability: "Available Tomorrow",
    gender: "Male",
    emergencyAvailable: false
  },
  {
    id: "w6",
    name: "Sunita Chauhan",
    category: "cleaner",
    categoryName: "House Cleaner",
    rating: 4.8,
    reviewsCount: 115,
    jobsCompleted: 240,
    hourlyRate: 220,
    dailyRate: 1600,
    location: "Indirapuram, Ghaziabad",
    city: "Noida",
    experienceYears: 7,
    verified: true,
    policeVerified: true,
    aiRecommended: false,
    onlineStatus: "online",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    bio: "Reliable housekeeping, kitchen deep cleaning, and daily maid services for apartments and villas.",
    languages: ["Hindi"],
    distance: "2.1 km away",
    responseTime: "Under 25 mins",
    availability: "Available Today",
    gender: "Female",
    emergencyAvailable: true
  }
];

export function Workers() {
  const navigate = useNavigate();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  
  // Advanced Filter sidebar states
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [policeVerifiedOnly, setPoliceVerifiedOnly] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [savedWorkers, setSavedWorkers] = useState<string[]>([]);
  
  // Pagination / Load More state
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSaveWorker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedWorkers(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedCity("");
    setSearchQuery("");
    setMaxPrice(500);
    setMinRating(0);
    setVerifiedOnly(false);
    setPoliceVerifiedOnly(false);
    setEmergencyOnly(false);
    setSelectedGender("");
    setSelectedLanguage("");
    setSortBy("recommended");
  };

  // Filter & Sort Logic
  const filteredWorkers = useMemo(() => {
    return MOCK_WORKERS_CATALOG.filter(worker => {
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = worker.name.toLowerCase().includes(query);
        const matchSkill = worker.categoryName.toLowerCase().includes(query);
        const matchBio = worker.bio.toLowerCase().includes(query);
        const matchLocation = worker.location.toLowerCase().includes(query);
        if (!matchName && !matchSkill && !matchBio && !matchLocation) return false;
      }

      // Category
      if (selectedCategory && worker.category !== selectedCategory) return false;

      // City
      if (selectedCity && worker.city !== selectedCity && !worker.location.toLowerCase().includes(selectedCity.toLowerCase())) return false;

      // Price Range
      if (worker.hourlyRate > maxPrice) return false;

      // Rating
      if (worker.rating < minRating) return false;

      // Verified Only
      if (verifiedOnly && !worker.verified) return false;

      // Police Verified
      if (policeVerifiedOnly && !worker.policeVerified) return false;

      // Emergency Available
      if (emergencyOnly && !worker.emergencyAvailable) return false;

      // Gender
      if (selectedGender && worker.gender !== selectedGender) return false;

      // Language
      if (selectedLanguage && !worker.languages.includes(selectedLanguage)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price_low") return a.hourlyRate - b.hourlyRate;
      if (sortBy === "price_high") return b.hourlyRate - a.hourlyRate;
      if (sortBy === "experience") return b.experienceYears - a.experienceYears;
      if (sortBy === "popular") return b.jobsCompleted - a.jobsCompleted;
      if (sortBy === "recommended" || sortBy === "ai_recommended") return (b.aiRecommended ? 1 : 0) - (a.aiRecommended ? 1 : 0) || b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedCity, maxPrice, minRating, verifiedOnly, policeVerifiedOnly, emergencyOnly, selectedGender, selectedLanguage, sortBy]);

  const displayedWorkers = filteredWorkers.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/20 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ================= TOP HERO & SEARCH BAR ================= */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5" /> India's Verified Labour Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Find Trusted Professionals Near You
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Browse verified workers by service, city, rating, availability and transparent hourly rates. Zero upfront commission.
            </p>
          </div>

          {/* Search & Quick Controls Bar */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl shadow-xl flex flex-col lg:flex-row items-center gap-3 relative z-10">
            
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl w-full border border-gray-200 dark:border-slate-700">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search electrician, plumber, cleaner..."
                className="w-full bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full lg:w-48">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-gray-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="">All Services</option>
                {WORKER_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div className="w-full lg:w-48">
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-gray-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="">All Cities</option>
                {CITIES_LIST.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Filter Toggle for Mobile */}
            <button 
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden w-full py-3 px-4 bg-gray-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4 text-blue-600" /> Filters
            </button>

            {/* Search Button */}
            <button 
              onClick={() => {}}
              className="w-full lg:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Search Workers</span>
            </button>

          </div>
        </div>

        {/* ================= MAIN LAYOUT: SIDEBAR FILTERS + WORKER CARDS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* ================= DESKTOP FILTER SIDEBAR ================= */}
          <div className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-black text-gray-950 dark:text-white text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filters
              </h3>
              <button 
                onClick={handleResetFilters}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Service Category */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-wider">Service Category</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "" ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                >
                  All Categories
                </button>
                {WORKER_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Hourly Rate Slider */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-gray-800 dark:text-slate-200 uppercase tracking-wider">Max Hourly Rate</span>
                <span className="text-blue-600 dark:text-blue-400 font-black">₹{maxPrice}/hr</span>
              </div>
              <input 
                type="range" 
                min="150" 
                max="1000" 
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                <span>₹150</span>
                <span>₹1,000+</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
              <label className="text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-wider">Minimum Rating</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 4.5, 4.7, 4.9].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${minRating === r ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                  >
                    {r === 0 ? 'All' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification & Trust Toggles */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
              <label className="text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-wider">Verification & Trust</label>
              
              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-700 dark:text-slate-300">
                <input 
                  type="checkbox" 
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span>Aadhaar Verified Only</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-700 dark:text-slate-300">
                <input 
                  type="checkbox" 
                  checked={policeVerifiedOnly}
                  onChange={(e) => setPoliceVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span>Police Background Checked</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-700 dark:text-slate-300">
                <input 
                  type="checkbox" 
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span>⚡ Emergency Available</span>
              </label>
            </div>

            {/* Gender Preference */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
              <label className="text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-wider">Worker Gender</label>
              <select 
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="">Any Gender</option>
                <option value="Male">Male Professionals</option>
                <option value="Female">Female Professionals</option>
              </select>
            </div>

            {/* Language */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
              <label className="text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-wider">Spoken Language</label>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="">Any Language</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Punjabi">Punjabi</option>
              </select>
            </div>

          </div>

          {/* ================= MAIN CONTENT AREA: SORTING & WORKER CARDS ================= */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Results Count & Sorting Header */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-black text-gray-950 dark:text-white text-base">{filteredWorkers.length}</span>
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400">Verified Professionals Found</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-black text-gray-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="recommended">⭐ AI Recommended</option>
                  <option value="rating">🔥 Highest Rated</option>
                  <option value="price_low">💰 Lowest Price</option>
                  <option value="price_high">💎 Highest Price</option>
                  <option value="experience">🏆 Experience Years</option>
                  <option value="popular">⚡ Most Booked</option>
                </select>
              </div>
            </div>

            {/* Workers Grid */}
            {displayedWorkers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedWorkers.map((worker, idx) => {
                  const isSaved = savedWorkers.includes(worker.id);

                  return (
                    <motion.div
                      key={worker.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(`/workers/${worker.id}`)}
                      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-xl shadow-blue-500/5 hover:shadow-2xl transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                    >
                      {/* Top Accent Gradient Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-orange-500" />

                      <div className="space-y-4">
                        
                        {/* Header Row: Avatar, Name, Badges, Save Button */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className="relative">
                              <img 
                                src={worker.avatar} 
                                alt={worker.name} 
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/20 shadow-sm"
                                referrerPolicy="no-referrer"
                              />
                              {/* Online Status Dot */}
                              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${worker.onlineStatus === 'online' ? 'bg-emerald-500' : worker.onlineStatus === 'busy' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-black text-gray-950 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {worker.name}
                                </h3>
                                {worker.aiRecommended && (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                                    ⭐ AI Rec
                                  </span>
                                )}
                              </div>

                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-extrabold mt-0.5">
                                {worker.categoryName}
                              </span>

                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Aadhaar Verified
                                </span>
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={(e) => toggleSaveWorker(worker.id, e)}
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-all"
                            title={isSaved ? "Saved" : "Save Worker"}
                          >
                            {isSaved ? <BookmarkCheck className="w-5 h-5 text-blue-600 fill-blue-600" /> : <Bookmark className="w-5 h-5" />}
                          </button>
                        </div>

                        {/* Rating, Jobs & Experience Bar */}
                        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/60 text-center">
                          <div>
                            <span className="block text-xs font-black text-gray-950 dark:text-white flex items-center justify-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {worker.rating}
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold">{worker.reviewsCount} reviews</span>
                          </div>
                          
                          <div className="border-x border-gray-200 dark:border-slate-700">
                            <span className="block text-xs font-black text-gray-950 dark:text-white">
                              {worker.jobsCompleted}+
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold">Jobs Done</span>
                          </div>

                          <div>
                            <span className="block text-xs font-black text-gray-950 dark:text-white">
                              {worker.experienceYears} Years
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold">Experience</span>
                          </div>
                        </div>

                        {/* Bio / Description */}
                        <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {worker.bio}
                        </p>

                        {/* Location, Distance & Response Time */}
                        <div className="space-y-1.5 text-xs text-gray-500 dark:text-slate-400 pt-2 border-t border-gray-100 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-blue-600 shrink-0" /> {worker.location} ({worker.distance})
                            </span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                              {worker.availability}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-orange-500 shrink-0" /> Responds {worker.responseTime}
                            </span>
                            <span className="text-gray-400 font-semibold">
                              Lang: {worker.languages.join(", ")}
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* Card Footer: Pricing & Action Buttons */}
                      <div className="pt-4 mt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-lg font-black text-gray-950 dark:text-white">₹{worker.hourlyRate}</span>
                          <span className="text-[10px] text-gray-400 block font-medium">per hour (₹{worker.dailyRate}/day)</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/messages/conv_${worker.id}`);
                            }}
                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-slate-200 transition-all"
                            title="Chat with worker"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/workers/${worker.id}`);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* ================= EMPTY STATE ================= */
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center space-y-6 border border-gray-200 dark:border-slate-800 shadow-xl">
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
                  🔍
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-black text-gray-950 dark:text-white">No workers found matching your filters</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Try broadening your search query, resetting hourly rate limits, or selecting a different city.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button 
                    onClick={handleResetFilters}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Load More Button */}
            {visibleCount < filteredWorkers.length && (
              <div className="pt-6 text-center">
                <button 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-8 py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white font-black rounded-2xl shadow-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-xs"
                >
                  {isLoading ? "Loading more verified professionals..." : "Load More Professionals ↓"}
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs lg:hidden">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
                  <h3 className="font-black text-gray-950 dark:text-white text-lg">Filter Professionals</h3>
                  <button 
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-wider">Service Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-slate-200"
                  >
                    <option value="">All Categories</option>
                    {WORKER_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Cities */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-wider">City Location</label>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-slate-200"
                  >
                    <option value="">All Cities</option>
                    {CITIES_LIST.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-gray-800 dark:text-slate-200 uppercase tracking-wider">Max Hourly Rate</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">₹{maxPrice}/hr</span>
                  </div>
                  <input 
                    type="range" 
                    min="150" 
                    max="1000" 
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-700 dark:text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                    />
                    <span>Aadhaar Verified Only</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-700 dark:text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={policeVerifiedOnly}
                      onChange={(e) => setPoliceVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                    />
                    <span>Police Background Checked</span>
                  </label>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex gap-3">
                <button 
                  onClick={handleResetFilters}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-slate-300"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white text-xs font-black shadow-md"
                >
                  Apply Filters ({filteredWorkers.length})
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Workers;
