import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Calendar, Clock, CheckCircle2, MapPin, Wrench, ArrowRight, Search, 
  Filter, Star, ShieldCheck, Heart, MessageSquare, Phone, Bell, 
  Sparkles, Bot, AlertTriangle, User, ChevronRight, X, Wallet, 
  Gift, Tag, CreditCard, RotateCw, ExternalLink, Download, Flame, CheckCircle
} from "lucide-react";
import { WORKER_CATEGORIES, CITIES_LIST, MOCK_WORKERS } from "../constants";
import toast, { Toaster } from "react-hot-toast";

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "workers" | "wallet" | "notifications" | "messages">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Delhi NCR");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [savedWorkers, setSavedWorkers] = useState<any[]>(MOCK_WORKERS.slice(0, 3));
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: "Booking Confirmed", desc: "Ramesh Kumar accepted your electrical inspection booking.", time: "10 mins ago", unread: true, type: "booking" },
    { id: 2, title: "Special Cashback Offer", desc: "Get ₹100 cashback on your next plumbing service today!", time: "2 hours ago", unread: true, type: "offer" },
    { id: 3, title: "Payment Successful", desc: "₹450 paid successfully for service #KS-BK-8821.", time: "Yesterday", unread: false, type: "payment" },
    { id: 4, title: "AI Recommendation", desc: "Based on your recent search, Suresh Sharma (Plumber) is available nearby.", time: "2 days ago", unread: false, type: "ai" }
  ]);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, name: "Ramesh Kumar", skill: "Electrician", lastMsg: "I am on my way, will reach in 15 mins.", time: "09:42 AM", unread: 1, avatar: MOCK_WORKERS[0].avatar },
    { id: 2, name: "Suresh Sharma", skill: "Plumber", lastMsg: "Service completed successfully! Please rate.", time: "Yesterday", unread: 0, avatar: MOCK_WORKERS[1].avatar }
  ]);
  const [walletData, setWalletData] = useState({
    balance: 2450,
    cashback: 350,
    rewardPoints: 480,
    couponsCount: 4,
    referralCode: "KAAMSAHITHI2026"
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/v1/bookings")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setBookings(data.data);
        } else {
          // Fallback mock bookings if API is empty
          setBookings([
            {
              id: "KS-BK-9901",
              workerName: "Ramesh Kumar",
              workerCategory: "Electrician",
              bookingDate: "2026-08-07",
              timeSlot: "10:00 AM",
              status: "Confirmed",
              totalAmount: 450,
              customerAddress: "Flat 402, Block B, Greenwoods, Delhi NCR"
            },
            {
              id: "KS-BK-8842",
              workerName: "Suresh Sharma",
              workerCategory: "Plumber",
              bookingDate: "2026-08-05",
              timeSlot: "02:30 PM",
              status: "Completed",
              totalAmount: 650,
              customerAddress: "Flat 402, Block B, Greenwoods, Delhi NCR"
            }
          ]);
        }
      })
      .catch(() => {
        setBookings([
          {
            id: "KS-BK-9901",
            workerName: "Ramesh Kumar",
            workerCategory: "Electrician",
            bookingDate: "2026-08-07",
            timeSlot: "10:00 AM",
            status: "Confirmed",
            totalAmount: 450,
            customerAddress: "Flat 402, Block B, Greenwoods, Delhi NCR"
          },
          {
            id: "KS-BK-8842",
            workerName: "Suresh Sharma",
            workerCategory: "Plumber",
            bookingDate: "2026-08-05",
            timeSlot: "02:30 PM",
            status: "Completed",
            totalAmount: 650,
            customerAddress: "Flat 402, Block B, Greenwoods, Delhi NCR"
          }
        ]);
      });
  }, []);

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery) return;
    setAiResponse(`Analyzing your request for "${aiQuery}"... Based on your location (${selectedCity}), we recommend hiring Ramesh Kumar (Expert Electrician) with 4.9 rating and ₹250/hr charge. Would you like me to book him for you instantly?`);
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success("All notifications marked as read!");
  };

  const removeSavedWorker = (id: string) => {
    setSavedWorkers(savedWorkers.filter(w => w.id !== id));
    toast.success("Worker removed from saved list.");
  };

  const filteredWorkers = MOCK_WORKERS.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          worker.skill.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || worker.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesVerified = !verifiedOnly || worker.verified;
    return matchesSearch && matchesCity && matchesVerified;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price_low") return parseInt(a.hourlyRate) - parseInt(b.hourlyRate);
    return 0;
  });

  const unreadNotifCount = notifications.filter(n => n.unread).length;
  const unreadMsgCount = messages.reduce((acc, m) => acc + m.unread, 0);

  return (
    <div className="min-h-screen bg-gray-50/70 pb-24 font-sans text-gray-900">
      <Toaster position="top-right" />

      {/* 1. Dashboard Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                alt="Customer Profile" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-orange-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                Gold Elite
              </span>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-800/60 text-blue-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Welcome back, Ananya Sharma
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Customer Command Center</h1>
              <p className="text-xs sm:text-sm text-blue-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" /> Current City: <span className="font-bold text-white">{selectedCity}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => navigate("/customer/bookings")}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition-all flex items-center gap-2 text-xs"
            >
              <Calendar className="w-4 h-4" /> Book Worker
            </button>
            <button 
              onClick={() => navigate("/map")}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition-all flex items-center gap-2 text-xs"
            >
              <MapPin className="w-4 h-4" /> Find Nearby Workers
            </button>
            <button 
              onClick={() => setAiModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 text-xs"
            >
              <Bot className="w-4 h-4" /> AI Saathi
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-blue-950">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar in Header */}
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-200 ml-2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for any service (e.g. Electrician, Plumber, AC Repair, Painter)..."
              className="bg-transparent text-white placeholder-blue-200 text-sm w-full focus:outline-hidden"
            />
            <button 
              onClick={() => setActiveTab("workers")}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
            >
              Explore Workers
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex overflow-x-auto gap-2">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "overview" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "bookings" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Calendar className="w-4 h-4" /> Bookings ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab("workers")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "workers" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Wrench className="w-4 h-4" /> Worker Directory
          </button>
          <button 
            onClick={() => setActiveTab("wallet")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "wallet" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Wallet className="w-4 h-4" /> Wallet & Rewards (₹{walletData.balance})
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "notifications" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications {unreadNotifCount > 0 && `(${unreadNotifCount})`}
          </button>
          <button 
            onClick={() => setActiveTab("messages")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "messages" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Messages {unreadMsgCount > 0 && `(${unreadMsgCount})`}
          </button>
        </div>

        {/* Profile Completion Progress Bar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Complete Your Profile (85%)</h3>
              <p className="text-xs text-gray-500">Add your exact apartment address and alternate phone for faster emergency dispatches.</p>
            </div>
            <button 
              onClick={() => navigate("/customer/profile")}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors self-start"
            >
              Complete Now &rarr;
            </button>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-2.5 rounded-full w-[85%] transition-all duration-1000"></div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
              <Flame className="w-4 h-4 text-orange-300 animate-pulse" /> Urgent Dispatch Service
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Need Urgent Help Right Now?</h2>
            <p className="text-xs sm:text-sm text-rose-100">Book verified emergency electricians, plumbers, or carpenters in under 30 minutes with priority GPS dispatch.</p>
          </div>
          <button 
            onClick={() => navigate("/booking/w1?emergency=true")}
            className="px-6 py-3.5 rounded-2xl bg-white text-rose-700 font-black text-xs sm:text-sm shadow-2xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Emergency Booking Now
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                onClick={() => setActiveTab("bookings")}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 cursor-pointer hover:border-blue-300 transition-all group"
              >
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
                  <Calendar className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{bookings.filter(b => b.status !== "Completed").length}</h3>
                <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                  View live status tracking &rarr;
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Completed Jobs</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">12</h3>
                <p className="text-xs text-emerald-600 font-semibold">100% satisfaction rating</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Saved Workers</span>
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{savedWorkers.length}</h3>
                <p className="text-xs text-gray-500">Quick re-booking favourites</p>
              </div>

              <div 
                onClick={() => setActiveTab("wallet")}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 cursor-pointer hover:border-emerald-300 transition-all"
              >
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Wallet Balance</span>
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">₹{walletData.balance}</h3>
                <p className="text-xs text-emerald-600 font-semibold">+₹{walletData.cashback} cashback active</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Reward Points</span>
                  <Gift className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{walletData.rewardPoints} Pts</h3>
                <p className="text-xs text-gray-500">Redeemable on next booking</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Reviews</span>
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">1</h3>
                <p className="text-xs text-orange-600 font-semibold">Rate last service & earn 50 pts</p>
              </div>
            </div>

            {/* Quick Services Grid */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Quick Services</h3>
                  <p className="text-xs text-gray-500">Select any category to instantly dispatch a verified worker</p>
                </div>
                <button onClick={() => setActiveTab("workers")} className="text-xs font-semibold text-blue-600 hover:underline">
                  View All ({WORKER_CATEGORIES.length}) &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {WORKER_CATEGORIES.slice(0, 8).map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => navigate(`/booking/w1?category=${cat.id}`)}
                    className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60 hover:border-blue-600 hover:bg-blue-50/50 cursor-pointer transition-all text-center space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 block truncate">{cat.name}</span>
                    <span className="text-[10px] text-gray-400 block">{cat.startPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Reminder Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-3 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
                  Pending Review
                </span>
                <h4 className="font-black text-gray-900 text-base">How was your plumbing service with Suresh Sharma?</h4>
                <p className="text-xs text-gray-600">Rate your completed service from yesterday and earn 50 reward points instantly.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toast.success("Review submitted! 50 reward points credited.")}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                >
                  Rate Now
                </button>
                <button 
                  onClick={() => toast("Reminder dismissed for later.", { icon: "⏰" })}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-xs transition-colors"
                >
                  Later
                </button>
              </div>
            </div>

            {/* Saved Workers Horizontal Carousel */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Saved Favourites</h3>
                  <p className="text-xs text-gray-500">Quickly book your trusted professionals</p>
                </div>
                <button onClick={() => setActiveTab("workers")} className="text-xs font-bold text-blue-600 hover:underline">
                  Find More Workers &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedWorkers.map(worker => (
                  <div key={worker.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={worker.avatar} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover border border-gray-300" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{worker.name}</h4>
                        <span className="text-xs font-semibold text-blue-600">{worker.skill}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {worker.rating}
                          </span>
                          <span className="text-xs font-bold text-gray-700">{worker.hourlyRate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => navigate(`/booking/${worker.id}`)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
                      >
                        Book Again
                      </button>
                      <button 
                        onClick={() => removeSavedWorker(worker.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-bold text-center"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommended Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider">
                    AI Smart Match
                  </span>
                  <h3 className="text-2xl font-black">Recommended For You</h3>
                  <p className="text-xs text-blue-200">Based on your previous bookings, current location, and 4.9+ ratings.</p>
                </div>
                <Bot className="w-10 h-10 text-orange-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_WORKERS.slice(0, 2).map(worker => (
                  <div key={worker.id} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={worker.avatar} alt={worker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-400" />
                      <div>
                        <h4 className="font-bold text-white text-base">{worker.name}</h4>
                        <span className="text-xs text-orange-300 font-semibold">{worker.skill}</span>
                        <p className="text-xs text-blue-200 mt-1">Available in {worker.city} • {worker.experience} Exp</p>
                        <span className="inline-block mt-2 font-black text-white text-sm">{worker.hourlyRate}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/booking/${worker.id}`)}
                      className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/30 whitespace-nowrap"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: BOOKINGS */}
        {activeTab === "bookings" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Your Service Bookings</h3>
                  <p className="text-xs text-gray-500">Track live job status, call workers, download invoices, or cancel/reschedule.</p>
                </div>
                <button 
                  onClick={() => navigate("/customer/dashboard")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700"
                >
                  + New Booking
                </button>
              </div>

              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-blue-600 text-sm">{b.id}</span>
                        <span className="font-bold text-gray-900 text-base">{b.workerName}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                          {b.workerCategory || "Electrician"}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                          b.status === "Confirmed" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-blue-100 text-blue-800"
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" /> {b.bookingDate || "2026-08-07"} at {b.timeSlot || "10:00 AM"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" /> {b.customerAddress || "Delhi NCR"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end">
                      <div className="text-right">
                        <span className="text-lg font-black text-gray-900">₹{b.totalAmount || 450}</span>
                        <span className="block text-[10px] text-gray-400">Total Bill</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={() => navigate(`/bookings/${b.id}`)}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 flex items-center gap-1"
                        >
                          Track
                        </button>
                        <button 
                          onClick={() => navigate(`/customer/messages`)}
                          className="p-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
                          title="Chat with worker"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert("Calling worker at +91 98765 43210...")}
                          className="p-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          title="Call worker"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert(`Invoice downloaded for booking ${b.id}`)}
                          className="p-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: WORKER DIRECTORY */}
        {activeTab === "workers" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or skill..."
                    className="bg-transparent text-sm w-full focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent text-sm w-full focus:outline-hidden font-medium text-gray-700"
                  >
                    {CITIES_LIST.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-sm w-full focus:outline-hidden font-medium text-gray-700"
                  >
                    <option value="rating">Sort by: Highest Rating</option>
                    <option value="price_low">Sort by: Lowest Price</option>
                  </select>
                </div>

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-xs font-bold text-gray-700">Aadhaar Verified Only</span>
                  <input 
                    type="checkbox" 
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map(worker => (
                <div key={worker.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={worker.avatar} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-100" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{worker.name}</h4>
                          <span className="text-xs font-semibold text-blue-600">{worker.skill}</span>
                          <p className="text-xs text-orange-600 font-semibold flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {worker.rating}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className="font-bold text-gray-800">{worker.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hourly Charge:</span>
                        <span className="font-bold text-blue-600">{worker.hourlyRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-bold text-gray-800">{worker.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => navigate(`/workers/${worker.id}`)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => navigate(`/booking/${worker.id}`)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md hover:bg-blue-700"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: WALLET & REWARDS */}
        {activeTab === "wallet" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">KaamSathi Secure Wallet</span>
                <h3 className="text-3xl font-black">₹{walletData.balance}</h3>
                <p className="text-xs text-blue-100">Active Cashback: <span className="font-bold text-emerald-300">₹{walletData.cashback}</span> • Reward Points: <span className="font-bold text-amber-300">{walletData.rewardPoints} Pts</span></p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => toast.success("Added ₹500 to wallet successfully!")}
                  className="px-6 py-3 bg-white text-blue-900 rounded-2xl font-black text-xs shadow-lg hover:bg-blue-50 transition-colors"
                >
                  + Add Money
                </button>
                <button 
                  onClick={() => navigate("/customer/payments")}
                  className="px-6 py-3 bg-blue-900/60 text-white border border-blue-400 rounded-2xl font-bold text-xs hover:bg-blue-900 transition-colors"
                >
                  Payment History
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-900 text-base">Active Coupons & Promo Codes</h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-blue-700 text-sm">FIRST100</span>
                      <p className="text-xs text-gray-600 mt-0.5">Get flat ₹100 off on your first service booking</p>
                    </div>
                    <button onClick={() => toast.success("Coupon FIRST100 applied!")} className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Apply</button>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-emerald-700 text-sm">PLUMB50</span>
                      <p className="text-xs text-gray-600 mt-0.5">Save 20% on plumbing and emergency repairs</p>
                    </div>
                    <button onClick={() => toast.success("Coupon PLUMB50 applied!")} className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Apply</button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-900 text-base">Refer & Earn</h4>
                <p className="text-xs text-gray-500">Invite friends to KaamSathi and earn ₹200 wallet cash when they complete their first service.</p>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="font-mono font-black text-gray-800 text-sm">{walletData.referralCode}</span>
                  <button onClick={() => { navigator.clipboard.writeText(walletData.referralCode); toast.success("Referral code copied!"); }} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold">Copy Code</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Notification Center</h3>
                  <p className="text-xs text-gray-500">Stay updated on bookings, payment confirmations, and AI suggestions.</p>
                </div>
                <button 
                  onClick={markAllNotificationsRead}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Mark All as Read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 rounded-2xl border flex items-start gap-4 transition-colors ${n.unread ? 'bg-blue-50/60 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      n.type === 'booking' ? 'bg-emerald-100 text-emerald-600' :
                      n.type === 'offer' ? 'bg-amber-100 text-amber-600' :
                      n.type === 'payment' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-sm">{n.title}</h4>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-600">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: MESSAGES */}
        {activeTab === "messages" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Active Conversations</h3>
                  <p className="text-xs text-gray-500">Direct chat with your assigned service professionals.</p>
                </div>
              </div>

              <div className="space-y-3">
                {messages.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => navigate("/customer/messages")}
                    className="p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-between gap-4 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-2xl object-cover border border-gray-300" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">{m.name}</h4>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">{m.skill}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{m.lastMsg}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[10px] text-gray-400 block">{m.time}</span>
                      {m.unread > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold inline-block">
                          {m.unread} new
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* AI Saathi Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg">AI Saathi Assistant</h3>
                  <p className="text-xs text-gray-500">Instant worker recommendations & pricing estimates</p>
                </div>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAiSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">What do you need help with?</label>
                <input 
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="e.g. Need an electrician for MCB repair in South Delhi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
              >
                Ask AI Saathi <Sparkles className="w-4 h-4" />
              </button>
            </form>

            {aiResponse && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-sm text-gray-800 space-y-3">
                <p>{aiResponse}</p>
                <button 
                  onClick={() => { setAiModalOpen(false); navigate("/booking/w1"); }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
                >
                  Book Recommended Worker Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
