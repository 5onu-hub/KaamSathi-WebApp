import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, ShieldCheck, Star, Search, MapPin, ArrowRight, Zap, Hammer, 
  Paintbrush, Sparkles, Users, CheckCircle, Clock, DollarSign, Award, 
  ChevronDown, Mic, MicOff, Navigation, Play, Check, Shield, Flame, Activity,
  Building2, Trees, Truck, Wind, Tv, Car, UserCheck, QrCode, Smartphone,
  MessageSquare, Phone, HelpCircle, ArrowUpRight, Globe, Bot, ShieldAlert
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { WORKER_CATEGORIES, CITIES_LIST, MOCK_WORKERS, TESTIMONIALS, FAQS } from "../constants";

// Live Booking Activity Feed Items
const LIVE_ACTIVITIES = [
  "🟢 Plumber booked in Connaught Place, Delhi (< 15 mins)",
  "🟢 Electrician accepted job in Hazratganj, Lucknow",
  "🟢 AC Repair & Gas filling completed in Noida Sector 62",
  "🟢 Painter joined from Boring Road, Patna",
  "🟢 House Helper verified & onboarded in Andheri, Mumbai",
  "🟢 Carpenter dispatched for modular kitchen in Jaipur"
];

// Floating Service Icons data
const FLOATING_ICONS = [
  { label: "Plumber", icon: "🔧", top: "15%", left: "4%" },
  { label: "Electrician", icon: "⚡", top: "25%", right: "6%" },
  { label: "Painter", icon: "🎨", top: "68%", left: "3%" },
  { label: "Carpenter", icon: "🪚", top: "75%", right: "5%" },
  { label: "Cleaner", icon: "🧹", top: "12%", right: "28%" },
  { label: "AC Repair", icon: "❄️", top: "82%", left: "42%" }
];

// Interactive Floating Worker Avatars around Hero
const FLOATING_AVATARS = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    skill: "Master Electrician",
    rating: 4.9,
    experience: "8 yrs",
    price: "₹250/hr",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    top: "32%",
    left: "2%",
  },
  {
    id: "w2",
    name: "Suresh Sharma",
    skill: "Expert Plumber",
    rating: 4.8,
    experience: "6 yrs",
    price: "₹200/hr",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    top: "18%",
    right: "10%",
  },
  {
    id: "w3",
    name: "Amit Verma",
    skill: "Carpenter & Furniture",
    rating: 4.95,
    experience: "10 yrs",
    price: "₹300/hr",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    bottom: "22%",
    right: "6%",
  }
];

export function Home() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [searchCity, setSearchCity] = useState("Delhi NCR");
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [currentActivityIdx, setCurrentActivityIdx] = useState(0);
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);
  const [journeyTab, setJourneyTab] = useState<"customer" | "worker">("customer");

  // AI Saathi state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChatLog, setAiChatLog] = useState([
    { sender: "ai", text: "Namaste! I am AI Saathi. Need help finding a reliable plumber or electrician near you?" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Animated Counter state
  const [stats, setStats] = useState({
    workers: 0,
    jobs: 0,
    cities: 0,
    rating: 0,
    success: 0,
    customers: 0
  });

  useEffect(() => {
    // Activity ticker interval
    const interval = setInterval(() => {
      setCurrentActivityIdx((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 4000);

    // Number count up animation
    let startTime = Date.now();
    let duration = 2000;
    let timer = setInterval(() => {
      let elapsed = Date.now() - startTime;
      let progress = Math.min(elapsed / duration, 1);
      setStats({
        workers: Math.floor(progress * 50000),
        jobs: Math.floor(progress * 200000),
        cities: Math.floor(progress * 350),
        rating: Number((progress * 4.9).toFixed(1)),
        success: Math.floor(progress * 98),
        customers: Math.floor(progress * 150000)
      });
      if (progress === 1) clearInterval(timer);
    }, 30);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/workers?city=${searchCity}&q=${searchQuery}`);
  };

  const handleVoiceSearch = () => {
    if (!isListening) {
      setIsListening(true);
      toast.success("Listening... Speak service or city (e.g., 'Plumber in Connaught Place')");
      setTimeout(() => {
        setIsListening(false);
        setSearchQuery("Emergency Electrician");
        toast.success("Recognized: 'Emergency Electrician'");
      }, 3500);
    } else {
      setIsListening(false);
    }
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt;
    setAiChatLog(prev => [...prev, { sender: "user", text: userMsg }]);
    setAiPrompt("");
    setIsAiLoading(true);

    setTimeout(() => {
      let reply = "I found 14 verified electricians within 3.2 km of your location with an average rating of 4.9★. Would you like me to dispatch the nearest available expert?";
      if (userMsg.toLowerCase().includes("plumber")) {
        reply = "Top verified plumbers are ready in your area starting at ₹250/hr with Aadhaar verification. Shall I book Ramesh Kumar for 2 PM?";
      } else if (userMsg.toLowerCase().includes("price") || userMsg.toLowerCase().includes("cost")) {
        reply = "KaamSathi operates with 0% worker commission! You pay standard transparent rates directly starting at ₹200/hr.";
      }
      setAiChatLog(prev => [...prev, { sender: "ai", text: reply }]);
      setIsAiLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden text-gray-900">
      <Toaster position="top-right" />

      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Background Animated Gradient Mesh & Glowing Blobs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-indigo-600 rounded-full blur-[160px] animate-pulse delay-1000"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-orange-500 rounded-full blur-[140px] opacity-60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px] opacity-15"></div>
        </div>

        {/* Floating Service Icons around Hero */}
        {FLOATING_ICONS.map((item, idx) => (
          <motion.div
            key={idx}
            animate={{ y: [0, -14, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4 + idx, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: item.top, left: item.left, right: item.right }}
            className="absolute hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-xs font-bold text-white z-20 pointer-events-none"
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </motion.div>
        ))}

        {/* Interactive Floating Worker Avatars with Hover Popups */}
        {FLOATING_AVATARS.map((av) => (
          <div
            key={av.id}
            style={{ top: av.top, left: av.left, right: av.right, bottom: av.bottom }}
            className="absolute hidden xl:block z-35"
            onMouseEnter={() => setHoveredAvatar(av.id)}
            onMouseLeave={() => setHoveredAvatar(null)}
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative cursor-pointer group"
            >
              <div className="relative">
                <img src={av.avatar} alt={av.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-400 shadow-2xl group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
              </div>

              {/* Hover Mini Popup Card */}
              {hoveredAvatar === av.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute left-16 top-0 w-64 bg-white text-gray-900 rounded-3xl p-4 shadow-2xl border border-gray-200 z-50 space-y-3 pointer-events-auto"
                >
                  <div className="flex items-center gap-3">
                    <img src={av.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{av.name}</h4>
                      <span className="text-[10px] text-blue-600 font-bold">{av.skill}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-600 font-semibold pt-1 border-t border-gray-100">
                    <span>★ {av.rating} ({av.experience})</span>
                    <span className="text-emerald-600 font-black">{av.price}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/workers/${av.id}`)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Book Now
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        ))}

        <div className="max-w-5xl mx-auto relative z-30 text-center space-y-8">
          
          {/* Small Animated Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-orange-500/20 text-blue-300 text-xs font-bold tracking-wide border border-blue-400/30 shadow-lg backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
            🇮🇳 India's Trusted Labour Marketplace • 0% Commission for Workers
          </motion.div>

          {/* Large Headline with Animated Shimmer Gradient */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              Find Skilled Workers Near You <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-orange-400 bg-clip-text text-transparent animate-pulse">
                Within Minutes.
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover verified daily wage laborers, plumbers, electricians, and technicians with real-time distance tracking, instant booking, and zero upfront cash.
            </p>
          </motion.div>

          {/* Floating Live Booking Activity Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-lg"
          >
            <Activity className="w-4 h-4 text-emerald-400 animate-spin" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentActivityIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {LIVE_ACTIVITIES[currentActivityIdx]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Large Floating Search Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-3xl mx-auto"
          >
            <form onSubmit={handleSearch} className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/30 flex flex-col sm:flex-row gap-3 text-gray-900">
              <div className="flex-1 flex items-center gap-3 px-3.5 py-3 bg-gray-50 rounded-2xl border border-gray-200">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                <select 
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="bg-transparent text-sm font-bold text-gray-800 w-full focus:outline-hidden cursor-pointer"
                >
                  <option value="">Select City / Locality</option>
                  {CITIES_LIST.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex items-center gap-3 px-3.5 py-3 bg-gray-50 rounded-2xl border border-gray-200">
                <Search className="w-5 h-5 text-blue-600 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Electrician, plumber, painter, pincode..." 
                  className="bg-transparent text-sm font-semibold text-gray-900 w-full focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-2 rounded-xl transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  title="Voice Search"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <button 
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/35 transition-all flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Find Worker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular services chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs font-semibold text-blue-200">
              <span className="text-white/70">Popular Searches:</span>
              <Link to="/search/results?q=Electrician" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10">⚡ Electrician</Link>
              <Link to="/search/results?q=Plumber" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10">🔧 Plumber</Link>
              <Link to="/search/results?q=Carpenter" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10">🪚 Carpenter</Link>
              <Link to="/search/results?q=Deep+Cleaning" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10">🧹 Deep Cleaning</Link>
              <Link to="/search/results?q=AC+Repair" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10">❄️ AC Repair</Link>
            </div>
          </motion.div>

          {/* CTA Buttons with Ripple & Magnetic Hover */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button 
              onClick={() => navigate("/workers")}
              className="px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Hire a Worker</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => navigate("/worker/register")}
              className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Become a Worker</span>
            </button>

            <button 
              onClick={() => navigate("/map")}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-sm border border-emerald-500/30 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 text-emerald-400" /> Watch Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {["✓ Aadhaar Verified", "✓ Background Checked", "✓ Police Verified", "✓ Top Rated", "✓ Emergency Available"].map((badge, idx) => (
              <div 
                key={idx}
                className="px-4 py-2 rounded-2xl bg-white/5 border border-white/15 text-xs font-bold text-blue-100 backdrop-blur-sm hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-default"
              >
                {badge}
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 1: TRUSTED BY INDIA (Animated Statistics) */}
      {/* ========================================================= */}
      <section className="py-20 bg-gradient-to-b from-indigo-950 to-slate-900 text-white border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/20 px-4 py-1 rounded-full border border-orange-500/30">
              Trusted by India
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Empowering Millions of Workers & Households</h2>
            <p className="text-xs sm:text-sm text-blue-200">The premier digital platform connecting blue-collar professionals with real-time local demand.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl text-center hover:border-blue-400 transition-colors">
              <span className="text-2xl mb-2 block">👷</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{stats.workers.toLocaleString()}+</h3>
              <p className="text-xs text-blue-200 font-semibold mt-1">Verified Workers</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl text-center hover:border-emerald-400 transition-colors">
              <span className="text-2xl mb-2 block">🏠</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{stats.jobs.toLocaleString()}+</h3>
              <p className="text-xs text-blue-200 font-semibold mt-1">Completed Jobs</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl text-center hover:border-orange-400 transition-colors">
              <span className="text-2xl mb-2 block">🏙️</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{stats.cities}+</h3>
              <p className="text-xs text-blue-200 font-semibold mt-1">Cities Covered</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl text-center hover:border-amber-400 transition-colors">
              <span className="text-2xl mb-2 block">⭐</span>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-400">{stats.rating}★</h3>
              <p className="text-xs text-blue-200 font-semibold mt-1">Average Rating</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl text-center hover:border-cyan-400 transition-colors">
              <span className="text-2xl mb-2 block">⚡</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{stats.success}%</h3>
              <p className="text-xs text-blue-200 font-semibold mt-1">Booking Success Rate</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl text-center hover:border-purple-400 transition-colors">
              <span className="text-2xl mb-2 block">😊</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{stats.customers.toLocaleString()}+</h3>
              <p className="text-xs text-blue-200 font-semibold mt-1">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 2: POPULAR CATEGORIES */}
      {/* ========================================================= */}
      <section className="py-24 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/70 px-4 py-1.5 rounded-full">
                Popular Categories
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Explore Skilled Worker Categories</h2>
              <p className="text-xs sm:text-sm text-gray-600">Verified professionals for everyday maintenance, repairs, construction, and home helpers.</p>
            </div>
            <Link 
              to="/services" 
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 w-fit"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WORKER_CATEGORIES.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/services/${cat.id}`)}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                {/* Background Gradient Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Wrench className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between relative z-10">
                  <span className="text-xs font-black text-emerald-700">{cat.startPrice}</span>
                  <span className="text-xs font-bold text-gray-400">{cat.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 3: HOW KAAMSATHI WORKS (Animated Timeline) */}
      {/* ========================================================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-4 py-1.5 rounded-full">
              Process & Timeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">How KaamSathi Works</h2>
            <p className="text-xs sm:text-sm text-gray-600">Seamless digital journeys designed for both homeowners and daily wage professionals.</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl shadow-inner">
              <button
                onClick={() => setJourneyTab("customer")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${journeyTab === 'customer' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Customer Journey
              </button>
              <button
                onClick={() => setJourneyTab("worker")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${journeyTab === 'worker' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Worker Journey
              </button>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="max-w-4xl mx-auto pt-6">
            {journeyTab === "customer" ? (
              <div className="space-y-6">
                {[
                  { step: "01", title: "Search Worker", desc: "Enter your service need & city to browse verified local professionals instantly." },
                  { step: "02", title: "Compare Profiles", desc: "Check Aadhaar badges, ratings, experience years, and transparent hourly charges." },
                  { step: "03", title: "Book Worker", desc: "Confirm booking date, time, and location with zero upfront commission." },
                  { step: "04", title: "Worker Arrives", desc: "Real-time OpenStreetMap tracking guides the professional straight to your doorstep." },
                  { step: "05", title: "Complete Work", desc: "Inspect completed repair or construction work with absolute satisfaction." },
                  { step: "06", title: "Rate Worker", desc: "Leave honest reviews to help the community and reward skilled laborers." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-5 p-6 rounded-3xl bg-gray-50/80 border border-gray-200/80 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-base mb-1">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {[
                  { step: "01", title: "Register Profile", desc: "Sign up with your mobile number and select your specialized skill category." },
                  { step: "02", title: "Get Verified", desc: "Instant Aadhaar and police verification builds lifetime trust with homeowners." },
                  { step: "03", title: "Receive Jobs", desc: "Get instant nearby job notifications directly on your phone with fair pricing." },
                  { step: "04", title: "Complete Work", desc: "Deliver high quality work and build your stellar local reputation." },
                  { step: "05", title: "Receive Payment", desc: "Keep 100% of your earnings with zero platform commission fees." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-5 p-6 rounded-3xl bg-orange-50/50 border border-orange-200/60 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-base mb-1">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 4: LIVE ACTIVITY FEED */}
      {/* ========================================================= */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/20 px-3.5 py-1 rounded-full border border-emerald-400/30">
                Live Activity Board
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">Real-Time Bookings Across India</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold">
              <Activity className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Live Updates Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIVE_ACTIVITIES.map((act, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg flex items-center gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0"></div>
                <p className="text-xs sm:text-sm font-semibold text-blue-100">{act}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 5: FEATURED WORKERS CAROUSEL / GRID */}
      {/* ========================================================= */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/70 px-4 py-1.5 rounded-full">
                Featured Professionals
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Top-Rated Verified Workers Available Today</h2>
              <p className="text-xs sm:text-sm text-gray-600">Connect instantly via chat, call, or direct booking.</p>
            </div>
            <Link 
              to="/workers" 
              className="px-6 py-3 rounded-2xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-white transition-colors inline-flex items-center gap-2 w-fit shadow-xs"
            >
              <span>Explore All Workers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_WORKERS.map((worker) => (
              <motion.div 
                key={worker.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={worker.avatar} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-100 shadow-sm" />
                    <div>
                      <h4 className="font-black text-gray-900 text-base">{worker.name}</h4>
                      <span className="text-xs font-bold text-blue-600">{worker.skill}</span>
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Aadhaar Verified
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100 font-semibold">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-gray-800">{worker.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hourly Rate:</span>
                      <span className="text-emerald-700 font-black">₹{worker.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">City Location:</span>
                      <span className="text-gray-800">{worker.city}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`/messages/${worker.id}`)}
                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigate(`/workers/${worker.id}`)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => navigate(`/workers/${worker.id}`)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 6: CUSTOMER REVIEWS (Testimonials) */}
      {/* ========================================================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-4 py-1.5 rounded-full">
              Customer Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Loved by Homeowners Across India</h2>
            <p className="text-xs sm:text-sm text-gray-600">Authentic experiences from real users who hired trusted daily workers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <motion.div 
                key={t.id}
                whileHover={{ y: -4 }}
                className="bg-gray-50/80 rounded-3xl p-8 border border-gray-200/80 shadow-sm space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">"{t.content}"</p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200/60">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 7: WHY CHOOSE KAAMSATHI */}
      {/* ========================================================= */}
      <section className="py-24 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/70 px-4 py-1.5 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">The KaamSathi Advantage</h2>
            <p className="text-xs sm:text-sm text-gray-600">Built with cutting-edge technology and uncompromising trust for Indian households.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck className="w-6 h-6 text-blue-600" />, title: "Verified Workers", desc: "Aadhaar & police verification for complete household safety." },
              { icon: <Bot className="w-6 h-6 text-purple-600" />, title: "AI Recommendations", desc: "Smart matching algorithms pair you with the best nearby expert." },
              { icon: <DollarSign className="w-6 h-6 text-emerald-600" />, title: "No Middleman", desc: "0% worker commission ensures fair wages and lowest rates." },
              { icon: <ShieldAlert className="w-6 h-6 text-orange-600" />, title: "Emergency Hiring", desc: "Urgent dispatch within 30 minutes for emergency plumbing or electrical." },
              { icon: <Check className="w-6 h-6 text-indigo-600" />, title: "Transparent Pricing", desc: "Clear hourly and daily wage rates with no hidden fees." },
              { icon: <Navigation className="w-6 h-6 text-cyan-600" />, title: "Real-Time Tracking", desc: "OpenStreetMap live tracking monitors your worker's arrival." },
              { icon: <Clock className="w-6 h-6 text-amber-600" />, title: "24x7 Support", desc: "Dedicated customer care ready to assist you round the clock." },
              { icon: <Award className="w-6 h-6 text-rose-600" />, title: "Secure Payments", desc: "Pay safely via UPI, cards, or cash after satisfactory job completion." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="font-black text-gray-900 text-base">{feature.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 8: AI SAATHI (Interactive AI Showcase) */}
      {/* ========================================================= */}
      <section className="py-24 bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500 rounded-full blur-[140px] animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/20 px-4 py-1.5 rounded-full border border-cyan-400/30">
              AI Saathi Intelligence
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Meet AI Saathi <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Your Smart Labour Assistant
              </span>
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Ask questions in Hindi, English, or regional languages. AI Saathi instantly calculates travel ETAs, compares hourly charges, and books the exact professional you need.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => setAiPrompt("Find a plumber in Delhi")}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/20 transition-all"
              >
                💬 "Find a plumber in Delhi"
              </button>
              <button 
                onClick={() => setAiPrompt("Electrician rates")}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/20 transition-all"
              >
                💬 "Electrician hourly rates"
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                    AI
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">AI Saathi Assistant</h4>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">● Online • Multilingual</span>
                  </div>
                </div>
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>

              {/* Chat Log */}
              <div className="space-y-3 h-72 overflow-y-auto pr-2">
                {aiChatLog.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-xs' : 'bg-white/10 text-blue-100 rounded-bl-xs border border-white/10'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-3 rounded-2xl text-xs text-blue-200 animate-pulse">
                      AI Saathi is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAiSend} className="flex gap-2 pt-2 border-t border-white/10">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask AI Saathi anything..." 
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-blue-300 focus:outline-hidden"
                />
                <button 
                  type="submit"
                  className="px-5 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 9: DOWNLOAD APP */}
      {/* ========================================================= */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-16 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <Smartphone className="w-96 h-96" />
            </div>

            <div className="space-y-6 max-w-xl relative z-10">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/20 px-4 py-1.5 rounded-full border border-orange-500/30">
                Mobile App
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Download KaamSathi Mobile App</h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Get instant worker alerts, live OpenStreetMap GPS tracking, direct WhatsApp calling, and emergency dispatch right on your Android or iOS device.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center gap-3">
                  <QrCode className="w-12 h-12 text-blue-900" />
                  <div className="text-xs text-gray-900">
                    <strong className="block font-black">Scan to Download</strong>
                    <span className="text-gray-500">Android & iOS</span>
                  </div>
                </div>

                <button className="px-6 py-3.5 bg-white text-gray-900 hover:bg-blue-50 font-black rounded-2xl shadow-xl transition-all text-xs sm:text-sm flex items-center gap-2">
                  <span>Google Play</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center">
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-64 h-[480px] bg-slate-900 rounded-[40px] border-8 border-slate-800 shadow-2xl p-4 flex flex-col justify-between text-white relative overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-b-xl"></div>
                <div className="pt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                    <span>KaamSathi</span>
                    <span>100% Verified</span>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl space-y-2">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Live Dispatch</span>
                    <h4 className="font-bold text-xs">Electrician Dispatched</h4>
                    <p className="text-[10px] text-gray-300">Ramesh Kumar is 1.2 km away from your location.</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-600 text-center rounded-2xl font-bold text-xs shadow-lg">
                  Track on Map ↗
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 10: FAQ */}
      {/* ========================================================= */}
      <section className="py-24 bg-gray-50/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/70 px-4 py-1.5 rounded-full">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-gray-600">Everything you need to know about hiring trusted workers on KaamSathi.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-6 text-left font-bold text-gray-900 flex items-center justify-between gap-4 text-sm sm:text-base hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${activeFaq === index ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 11: CALL TO ACTION */}
      {/* ========================================================= */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <span className="text-xs font-bold text-orange-300 uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            Get Started Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Hire Trusted Workers <br />
            or Find Daily Jobs?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied homeowners and skilled laborers across India with zero platform commission and instant Aadhaar verification.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => navigate("/workers")}
              className="px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Hire a Worker Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => navigate("/worker/register")}
              className="px-8 py-4 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Become a Worker</span>
            </button>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 12: FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                KS
              </div>
              <span className="text-xl font-black tracking-tight text-white">KaamSathi</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier trusted labour marketplace connecting verified daily wage earners, plumbers, electricians, and technicians with local homeowners.
            </p>
            <p className="text-xs text-slate-500 font-semibold">© 2026 KaamSathi Technologies India Pvt. Ltd. All rights reserved.</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-sm text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors">Press & Media</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog & Stories</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-sm text-white uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/services/plumbing" className="hover:text-white transition-colors">Plumbing & Pipe Repair</Link></li>
              <li><Link to="/services/electrical" className="hover:text-white transition-colors">Electrical & Wiring</Link></li>
              <li><Link to="/services/carpentry" className="hover:text-white transition-colors">Carpentry & Woodwork</Link></li>
              <li><Link to="/services/cleaning" className="hover:text-white transition-colors">Deep Home Cleaning</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-sm text-white uppercase tracking-wider">Support & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-white transition-colors">Safety & Verification</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
