import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, Clock, CheckCircle, MapPin, Wrench, ArrowRight, Search, 
  Filter, Star, ShieldCheck, Heart, MessageSquare, Phone, Bell, 
  Sparkles, Bot, AlertTriangle, User, ChevronRight, X
} from "lucide-react";
import { WORKER_CATEGORIES, CITIES_LIST, MOCK_WORKERS } from "../constants";
import toast, { Toaster } from "react-hot-toast";

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "workers" | "bookings" | "notifications">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Delhi NCR");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/v1/bookings")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setBookings(data.data);
      })
      .catch(() => {});
  }, []);

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery) return;
    setAiResponse(`Analyzing your request for "${aiQuery}"... Based on your location (${selectedCity}), we recommend hiring Ramesh Kumar (Expert Electrician) with 4.9 rating and ₹250/hr charge. Would you like me to book him for you?`);
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

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20 font-sans">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Welcome back, Customer
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Customer Control Dashboard</h1>
            <p className="text-blue-200 text-xs">Manage bookings, discover top verified workers, track live job statuses, and get AI recommendations.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => navigate("/customer/bookings")}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition-all flex items-center gap-2 text-xs"
            >
              <Calendar className="w-4 h-4" /> Live Booking Hub ({bookings.length})
            </button>
            <button 
              onClick={() => setAiModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 text-xs"
            >
              <Bot className="w-4 h-4" /> Ask AI Saathi
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-100 flex overflow-x-auto gap-2">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "overview" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Overview & Quick Stats
          </button>
          <button 
            onClick={() => navigate("/customer/wallet")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-gray-600 hover:bg-gray-100 flex items-center gap-1.5"
          >
            Wallet & Rewards
          </button>
          <button 
            onClick={() => navigate("/customer/payments")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-gray-600 hover:bg-gray-100 flex items-center gap-1.5"
          >
            Payment Statements
          </button>
          <button 
            onClick={() => setActiveTab("workers")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "workers" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Worker Discovery & Search
          </button>
          <button 
            onClick={() => navigate("/customer/bookings")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-blue-600 hover:bg-blue-50 font-black flex items-center gap-1"
          >
            My Service Bookings ({bookings.length}) &rarr;
          </button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                onClick={() => navigate("/customer/bookings")}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 cursor-pointer hover:border-blue-300 transition-all"
              >
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{bookings.length}</h3>
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  Click to open tracking hub &rarr;
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Saved Workers</span>
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">4</h3>
                <p className="text-xs text-gray-500">Quick access in your favorites</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Hires</span>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">12</h3>
                <p className="text-xs text-gray-500">100% completed successfully</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Location</span>
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 truncate">{selectedCity}</h3>
                <p className="text-xs text-blue-600 font-semibold">Active Dispatch Available</p>
              </div>
            </div>

            {/* Service Categories Quick Selector */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Quick Service Categories</h3>
                <button onClick={() => setActiveTab("workers")} className="text-xs font-semibold text-blue-600 hover:underline">
                  View All Services &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {WORKER_CATEGORIES.slice(0, 6).map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setActiveTab("workers"); }}
                    className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 hover:border-blue-600 hover:bg-blue-50/50 cursor-pointer transition-all text-center space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 block truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings Preview */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Active Bookings</h3>
                <button onClick={() => navigate("/customer/bookings")} className="text-xs font-bold text-blue-600 hover:underline">
                  Open Customer Booking Manager &rarr;
                </button>
              </div>

              <div className="space-y-4">
                {bookings.slice(0, 3).map(b => (
                  <div key={b.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-base">{b.workerName}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          {b.serviceCategory || b.workerCategory || "Service"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
                        <Calendar className="w-4 h-4 text-gray-400" /> {b.bookingDate || "Today"}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" /> {b.customerAddress || "South Extension, Delhi"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-base font-black text-gray-900">₹{b.totalAmount || b.estimatedCost || 500}</span>
                        <span className="block text-xs text-gray-400">Total Price</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/bookings/${b.id}`)}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700"
                      >
                        Track Live
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Workers Discovery */}
        {activeTab === "workers" && (
          <div className="mt-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search worker by name or skill..."
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
                  <span className="text-xs font-bold text-gray-700">Verified Only</span>
                  <input 
                    type="checkbox" 
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Workers Grid */}
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

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">Expert professional available for hire in {worker.city}. Verified with Aadhaar and police background checks.</p>

                    <div className="space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className="font-bold text-gray-800">{worker.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hourly Charge:</span>
                        <span className="font-bold text-blue-600">₹{worker.hourlyRate}/hr</span>
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
                      onClick={() => navigate(`/workers/${worker.id}`)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md hover:bg-blue-700"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                  <p className="text-xs text-gray-500">Instant worker recommendations & price estimates</p>
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
                  onClick={() => { setAiModalOpen(false); navigate("/workers/w1"); }}
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
