import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, Zap, Hammer, Paintbrush, Home, Sparkles, Building2, Trees, 
  Truck, Flame, Wind, Tv, Car, UserCheck, Users, Search, X, Star, 
  ChevronRight, ShieldCheck, Clock, ArrowRight, Filter, MapPin, Sparkle
} from "lucide-react";
import { WORKER_CATEGORIES } from "../../constants";

// Icon Mapper for Category Cards
const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Home,
  Sparkles,
  Building2,
  Trees,
  Truck,
  Flame,
  Wind,
  Tv,
  Car,
  UserCheck,
  Users
};

// Trending / Popular Services
const TRENDING_SERVICES = [
  {
    id: "emergency-plumber",
    title: "Emergency Plumber",
    category: "plumbing",
    description: "Urgent leak repair, tap fixes, clogged drains, and pipe bursts.",
    startPrice: "₹250/hr",
    rating: 4.9,
    reviews: "3,400+",
    eta: "30-45 Mins Arrival",
    badge: "24/7 Dispatch",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500"
  },
  {
    id: "ac-service",
    title: "AC Service & Jet Wash",
    category: "ac-repair",
    description: "Deep foam jet cleaning, gas leak check, and cooling optimization.",
    startPrice: "₹350/service",
    rating: 4.9,
    reviews: "4,200+",
    eta: "Same Day Slots",
    badge: "Summer Special",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500"
  },
  {
    id: "deep-cleaning",
    title: "Full House Deep Cleaning",
    category: "cleaning",
    description: "Complete home sanitization, kitchen degreasing, and sofa shampooing.",
    startPrice: "₹500/service",
    rating: 4.9,
    reviews: "5,100+",
    eta: "Scheduled Slots",
    badge: "Most Booked",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500"
  },
  {
    id: "house-painting",
    title: "House & Wall Painting",
    category: "painting",
    description: "Fresh coat, texture designs, waterproofing, and stencil wall art.",
    startPrice: "₹400/day",
    rating: 4.8,
    reviews: "2,100+",
    eta: "Free Inspection",
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500"
  },
  {
    id: "electric-repair",
    title: "Electric Fault & MCB Repair",
    category: "electrical",
    description: "Short circuit detection, MCB tripping, fan setup, and heavy wiring.",
    startPrice: "₹200/hr",
    rating: 4.9,
    reviews: "3,800+",
    eta: "Quick 30 Mins",
    badge: "Essential",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500"
  }
];

export function ServicesCatalogView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = ["All", "Popular", "Most Booked", "Emergency Available", "Verified Workers", "Nearby"];

  const searchSuggestions = [
    "Plumbing", "Electrical", "AC Service", "Deep Cleaning", "House Shifting", 
    "Gardening", "Driver", "Carpentry", "Masonry", "Welding"
  ];

  // Filter Categories
  const filteredCategories = WORKER_CATEGORIES.filter(cat => {
    // Search match
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter tab match
    if (!matchesSearch) return false;
    if (activeFilter === "All") return true;

    return cat.tags?.includes(activeFilter);
  });

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Breadcrumb & Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-gray-900 text-white relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-blue-200/90 tracking-wide">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-orange-400 font-bold">Services</span>
          </nav>

          {/* Page Header */}
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold border border-blue-700/50 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
              <span>15+ Verified Daily Labour & Skilled Categories</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Find Skilled <span className="text-orange-400">Workers</span>
            </h1>
            <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              Browse verified professionals across multiple categories. Zero commission fees, direct hourly or daily rates, and instant local dispatch.
            </p>
          </div>

          {/* 2. Search Bar Section */}
          <div className="pt-2 max-w-3xl space-y-3">
            <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-gray-50/80 rounded-xl border border-gray-200/80 focus-within:border-blue-600 focus-within:bg-white transition-all">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search category or service name (e.g. Plumbing, Electrical, Driver)..."
                  className="bg-transparent text-sm font-medium text-gray-900 w-full focus:outline-hidden placeholder-gray-400"
                />
                {searchQuery && (
                  <button 
                    onClick={clearSearch} 
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button 
                onClick={() => {}}
                className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20 transition-all shrink-0 flex items-center gap-2"
              >
                Search <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>
            </div>

            {/* Search Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-blue-200 font-semibold mr-1">Suggestions:</span>
              {searchSuggestions.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSuggestionClick(sug)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    searchQuery.toLowerCase() === sug.toLowerCase()
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-white/10 hover:bg-white/20 text-blue-100 backdrop-blur-xs border border-white/10"
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* 3. Filters Bar Section */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 shrink-0">
            <Filter className="w-4 h-4 text-blue-600" /> Filter Categories:
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-gray-100 hover:bg-gray-200/80 text-gray-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 self-end md:self-auto">
            Showing {filteredCategories.length} Categories
          </span>
        </div>

        {/* 4. Service Categories Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Service Categories</h2>
              <p className="text-xs text-gray-500 mt-0.5">Explore rate cards, ratings, and active workers by category</p>
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 space-y-4 max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">No Categories Found</h3>
              <p className="text-xs text-gray-500">We couldn't find any category matching "{searchQuery}". Try clearing search or choosing another filter.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredCategories.map((cat, index) => {
                const IconComponent = iconMap[cat.icon] || Wrench;

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    whileHover={{ y: -6 }}
                    onClick={() => navigate(`/services/${cat.id}`)}
                    className="bg-white rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer overflow-hidden group flex flex-col justify-between"
                  >
                    {/* Category Image Banner with Badge */}
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>

                      {/* Icon & Start Price Floating Badge */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-blue-600 flex items-center justify-center shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow-md">
                          Starting {cat.startPrice}
                        </span>
                      </div>

                      {/* Category Name & Rating Overlay */}
                      <div className="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between">
                        <div>
                          <h3 className="text-xl font-black group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                            {cat.name}
                          </h3>
                          <p className="text-[11px] text-gray-200 font-medium flex items-center gap-1 mt-0.5">
                            <Users className="w-3.5 h-3.5 text-blue-300" /> {cat.count}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 border border-white/10">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{cat.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-100">
                          0% Commission
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-[11px] font-semibold border border-orange-100">
                          Aadhaar Verified
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                          Instant Booking
                        </span>
                      </div>

                      {/* Explore Action Bar */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-orange-500 transition-colors">
                        <span>View Rate Cards & Workers</span>
                        <span className="flex items-center gap-1">
                          Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* 5. Popular Services Section */}
        <div className="pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200/80 pb-4">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                Trending Demand
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-2">Popular On-Demand Services</h2>
              <p className="text-xs text-gray-500 mt-0.5">Most requested daily home repair & skilled services with fast dispatch times</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {TRENDING_SERVICES.map((serv) => (
              <div 
                key={serv.id}
                onClick={() => navigate(`/services/${serv.category}`)}
                className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative h-28 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={serv.image} alt={serv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-orange-500 text-white font-bold text-[10px] shadow-xs">
                      {serv.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{serv.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-snug line-clamp-2 mt-1">{serv.description}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-blue-600">{serv.startPrice}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {serv.eta}
                    </span>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/services/${serv.category}`);
                    }}
                    className="w-full py-2 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    Explore Service &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
