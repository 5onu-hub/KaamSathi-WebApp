import React, { useState, useEffect } from "react";
import { 
  Wrench, CheckCircle, Clock, Star, TrendingUp, ShieldCheck, 
  Briefcase, DollarSign, Calendar, MessageSquare, Bell, 
  Settings, User, Award, MapPin, Phone, Check, X, Play, Pause, 
  FileText, Upload, ChevronRight, AlertCircle, Sparkles, LogOut, Navigation, Eye, CheckCheck, Wallet, RefreshCw, Plus, Trash2, Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export function WorkerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "availability" | "earnings" | "wallet" | "reviews" | "portfolio" | "skills" | "performance" | "documents" | "settings">("overview");
  const [isOnline, setIsOnline] = useState(true);
  const [activeJobs, setActiveJobs] = useState([
    {
      id: "KS-JOB-8821",
      customerName: "Rahul Verma",
      service: "Electrical Wiring & Fan Repair",
      location: "South Extension, New Delhi",
      distance: "2.4 km",
      expectedDuration: "1.5 hours",
      budget: 450,
      requestedTime: "Today, 02:30 PM",
      status: "In Progress"
    }
  ]);
  const [jobRequests, setJobRequests] = useState([
    {
      id: "req_101",
      customerName: "Pooja Sharma",
      service: "MCB Trip & Switchboard Repair",
      location: "Lajpat Nagar, New Delhi",
      distance: "3.1 km",
      expectedDuration: "1 hour",
      budget: 550,
      requestedTime: "Today, 04:00 PM",
      status: "pending"
    }
  ]);

  const [walletBalance, setWalletBalance] = useState(4850);
  const [pendingPayments, setPendingPayments] = useState(1200);
  const [withdrawalHistory, setWithdrawalHistory] = useState([
    { id: "WTH-991", amount: 3500, date: "2026-08-01", status: "Successful" },
    { id: "WTH-882", amount: 5000, date: "2026-07-25", status: "Successful" }
  ]);

  const [portfolioImages, setPortfolioImages] = useState([
    { id: 1, title: "Modern Villa Wiring", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600" },
    { id: 2, title: "AC Compressor Repair", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600" }
  ]);

  const [skillsList, setSkillsList] = useState([
    { name: "Electrical Repair", experience: "6 Years", charge: "₹250/hr" },
    { name: "MCB & Wiring", experience: "6 Years", charge: "₹300/hr" },
    { name: "Appliance Installation", experience: "4 Years", charge: "₹200/hr" }
  ]);
  const [newSkillName, setNewSkillName] = useState("");

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");

  const acceptJob = (id: string) => {
    const job = jobRequests.find(j => j.id === id);
    if (job) {
      setJobRequests(jobRequests.filter(j => j.id !== id));
      setActiveJobs([...activeJobs, { ...job, id: `KS-JOB-${Math.floor(1000 + Math.random() * 9000)}`, status: "Confirmed" }]);
      toast.success("Job accepted successfully! Navigate to customer location.");
    }
  };

  const rejectJob = (id: string) => {
    setJobRequests(jobRequests.filter(j => j.id !== id));
    toast("Job request declined.", { icon: "ℹ️" });
  };

  const handleWithdrawal = () => {
    if (walletBalance <= 0) {
      toast.error("Insufficient balance for withdrawal.");
      return;
    }
    const amount = walletBalance;
    setWithdrawalHistory([{ id: `WTH-${Math.floor(100 + Math.random() * 900)}`, amount, date: new Date().toISOString().split("T")[0], status: "Processing" }, ...withdrawalHistory]);
    setWalletBalance(0);
    toast.success(`Withdrawal request of ₹${amount} submitted successfully!`);
  };

  const runAiAdvisor = () => {
    setAiAdvice("Based on real-time demand in Delhi NCR, electricians are receiving 35% more requests between 4 PM and 8 PM. We recommend going online during these peak hours to maximize your earnings!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-24 md:pb-10">
      <Toaster position="top-right" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs h-20 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-gray-900">KaamSathi</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] tracking-wide uppercase border border-blue-100 hidden sm:inline-block">
                Worker Partner Portal
              </span>
            </div>
            <p className="text-xs text-gray-500">Partner ID: KS-W-8942 • Delhi NCR</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAiModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/30 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" /> AI Saathi
          </button>

          <button 
            onClick={() => { setIsOnline(!isOnline); toast(isOnline ? "You are now Offline" : "You are Online & Receiving Jobs!", { icon: isOnline ? "🔴" : "🟢" }); }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
              isOnline ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
            {isOnline ? "Online & Ready" : "Paused"}
          </button>

          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
              alt="Ramesh Kumar" 
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-600/20"
            />
            <div className="text-left text-xs">
              <span className="font-bold text-gray-900 block">Ramesh Kumar</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Elite
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/60 text-blue-200 text-xs font-bold border border-blue-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Aadhaar Verified Partner • 100% Secure Payouts
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Worker Business Command Center</h2>
            <p className="text-xs sm:text-sm text-blue-200">Manage dispatches, monitor earnings, upload portfolio items, and optimize your daily schedule.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button 
              onClick={() => setActiveTab("jobs")}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" /> Live Dispatches ({jobRequests.length + activeJobs.length})
            </button>
            <button 
              onClick={() => setActiveTab("wallet")}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-emerald-400" /> Wallet (₹{walletBalance})
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex overflow-x-auto gap-2 no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "jobs", label: `Jobs (${activeJobs.length + jobRequests.length})`, icon: Briefcase },
            { id: "availability", label: "Availability", icon: Calendar },
            { id: "earnings", label: "Earnings Analytics", icon: DollarSign },
            { id: "wallet", label: "Wallet & Payouts", icon: Wallet },
            { id: "reviews", label: "Customer Reviews", icon: Star },
            { id: "portfolio", label: "Portfolio", icon: Camera },
            { id: "skills", label: "Skills & Charges", icon: Wrench },
            { id: "performance", label: "Performance", icon: Award },
            { id: "documents", label: "Documents", icon: FileText },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Overview Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Today's Earnings</span>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">₹2,450</h3>
                <p className="text-xs text-emerald-600 font-semibold">+18% vs yesterday</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Weekly Earnings</span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">₹14,200</h3>
                <p className="text-xs text-blue-600 font-semibold">12 jobs completed this week</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Jobs</span>
                  <Briefcase className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{activeJobs.length}</h3>
                <p className="text-xs text-orange-600 font-semibold">{jobRequests.length} pending requests</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">4.8 ★</h3>
                <p className="text-xs text-gray-500">Based on 124 reviews</p>
              </div>
            </div>

            {/* New Job Requests Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Incoming Job Requests</h3>
                  <p className="text-xs text-gray-500">Accept or reject customer bookings instantly within 60 seconds</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black animate-pulse">
                  {jobRequests.length} Pending
                </span>
              </div>

              {jobRequests.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-sm font-bold text-gray-600">No pending job requests right now.</p>
                  <p className="text-xs text-gray-400 mt-1">Keep your status online to receive nearby dispatches.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobRequests.map(req => (
                    <div key={req.id} className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900 text-base">{req.customerName}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                            {req.service}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-500" /> {req.location} ({req.distance})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-500" /> {req.requestedTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-between md:justify-end">
                        <div className="text-right">
                          <span className="text-xl font-black text-emerald-600">₹{req.budget}</span>
                          <span className="block text-[10px] text-gray-400">Estimated Payout</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => acceptJob(req.id)}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" /> Accept
                          </button>
                          <button 
                            onClick={() => rejectJob(req.id)}
                            className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Jobs Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Active Jobs In Progress</h3>
                  <p className="text-xs text-gray-500">Update job status, start navigation, or generate invoices upon completion</p>
                </div>
              </div>

              <div className="space-y-4">
                {activeJobs.map(job => (
                  <div key={job.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-blue-600 text-sm">{job.id}</span>
                        <span className="font-bold text-gray-900 text-base">{job.customerName}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {job.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{job.service} • {job.location}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => alert(`Launching GPS navigation to ${job.location}...`)}
                        className="px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-blue-700 flex items-center gap-1.5"
                      >
                        <Navigation className="w-4 h-4" /> Navigate
                      </button>
                      <button 
                        onClick={() => alert("Calling customer at +91 98765 43210...")}
                        className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200"
                        title="Call Customer"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setActiveJobs(activeJobs.filter(j => j.id !== job.id));
                          setWalletBalance(walletBalance + job.budget);
                          toast.success("Job completed and ₹" + job.budget + " credited to wallet!");
                        }}
                        className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-700"
                      >
                        Complete & Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: JOBS */}
        {activeTab === "jobs" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Worker Job Management Center</h3>
                  <p className="text-xs text-gray-500">Manage all pending, active, and completed service dispatches.</p>
                </div>
              </div>
              <div className="space-y-4">
                {activeJobs.map(job => (
                  <div key={job.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="font-mono font-bold text-blue-600 text-xs">{job.id}</span>
                      <h4 className="font-bold text-gray-900 text-base">{job.customerName} - {job.service}</h4>
                      <p className="text-xs text-gray-500 mt-1"><MapPin className="w-3.5 h-3.5 inline text-gray-400" /> {job.location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-emerald-600 text-lg">₹{job.budget}</span>
                      <button onClick={() => toast.success("Invoice generated successfully!")} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Generate Invoice</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: AVAILABILITY */}
        {activeTab === "availability" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Availability & Working Schedule</h3>
                <p className="text-xs text-gray-500">Set your working days, hours, emergency dispatch availability, and vacation mode.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                  <h4 className="font-bold text-gray-900 text-sm">Working Hours</h4>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Start Time</label>
                      <input type="time" defaultValue="09:00" className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">End Time</label>
                      <input type="time" defaultValue="19:00" className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold" />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                  <h4 className="font-bold text-gray-900 text-sm">Emergency Dispatch & Vacation Mode</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-semibold text-gray-800">Emergency Bookings (+30% surge pay)</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-semibold text-gray-800">Vacation Mode (Pause all dispatches)</span>
                      <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                    </label>
                  </div>
                </div>
              </div>

              <button onClick={() => toast.success("Availability preferences updated successfully!")} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md">
                Save Availability
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 4: EARNINGS ANALYTICS */}
        {activeTab === "earnings" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Earnings Analytics & Reports</h3>
                <p className="text-xs text-gray-500">Track your daily, weekly, monthly, and service-wise breakdown.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
                  <span className="text-xs font-bold text-blue-600 uppercase">This Week</span>
                  <h4 className="text-3xl font-black text-gray-900">₹14,200</h4>
                  <p className="text-xs text-gray-500">12 completed jobs</p>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase">This Month</span>
                  <h4 className="text-3xl font-black text-gray-900">₹58,400</h4>
                  <p className="text-xs text-gray-500">48 completed jobs</p>
                </div>
                <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100 space-y-2">
                  <span className="text-xs font-bold text-purple-600 uppercase">Yearly Projection</span>
                  <h4 className="text-3xl font-black text-gray-900">₹7,20,000</h4>
                  <p className="text-xs text-gray-500">Top 5% earner in region</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: WALLET & PAYOUTS */}
        {activeTab === "wallet" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">KaamSathi Partner Wallet</span>
                <h3 className="text-3xl font-black">₹{walletBalance}</h3>
                <p className="text-xs text-blue-100">Pending Payouts: <span className="font-bold text-amber-300">₹{pendingPayments}</span></p>
              </div>
              <button 
                onClick={handleWithdrawal}
                className="px-6 py-3 bg-white text-blue-900 rounded-2xl font-black text-xs shadow-lg hover:bg-blue-50 transition-colors"
              >
                Request Withdrawal to Bank
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <h4 className="font-bold text-gray-900 text-base">Withdrawal History</h4>
              <div className="space-y-3">
                {withdrawalHistory.map(w => (
                  <div key={w.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-gray-900 text-sm">{w.id}</span>
                      <p className="text-xs text-gray-500">{w.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-gray-900 text-base">₹{w.amount}</span>
                      <span className="block text-[10px] font-bold text-emerald-600">{w.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: CUSTOMER REVIEWS */}
        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Customer Ratings & Reviews</h3>
                  <p className="text-xs text-gray-500">View what customers are saying about your professionalism and speed.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> 4.8 Rating (124 reviews)
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Rahul Verma", review: "Very professional and punctual electrician. Fixed our wiring issue in no time!", rating: 5, date: "Yesterday" },
                  { name: "Ananya Sharma", review: "Clean work and polite behavior. Highly recommended!", rating: 5, date: "3 days ago" }
                ].map((rev, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 text-sm">{rev.name}</h4>
                      <span className="text-xs text-gray-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">{rev.review}</p>
                    <button onClick={() => toast.success("Reply sent to customer!")} className="text-xs font-bold text-blue-600 hover:underline pt-1 block">
                      Reply to Review &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: PORTFOLIO MANAGER */}
        {activeTab === "portfolio" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Portfolio & Work Showcase</h3>
                  <p className="text-xs text-gray-500">Upload photos of your completed projects to win customer trust.</p>
                </div>
                <button 
                  onClick={() => {
                    setPortfolioImages([...portfolioImages, { id: Date.now(), title: "Recent Wiring Project", url: "https://images.unsplash.com/photo-1541888946425-d0fbb18fcd02?w=600" }]);
                    toast.success("New portfolio photo uploaded!");
                  }}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Upload Photo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioImages.map(img => (
                  <div key={img.id} className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm space-y-3 pb-4">
                    <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
                    <div className="px-4 flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-xs">{img.title}</span>
                      <button 
                        onClick={() => {
                          setPortfolioImages(portfolioImages.filter(p => p.id !== img.id));
                          toast.success("Portfolio image removed.");
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 8: SKILL MANAGEMENT */}
        {activeTab === "skills" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Skill Management & Hourly Charges</h3>
                  <p className="text-xs text-gray-500">Add or update your certified skills and service charges.</p>
                </div>
              </div>

              <div className="space-y-4">
                {skillsList.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{skill.name}</h4>
                      <p className="text-xs text-gray-500">Experience: {skill.experience}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-blue-600 text-sm">{skill.charge}</span>
                      <button 
                        onClick={() => {
                          setSkillsList(skillsList.filter((_, i) => i !== idx));
                          toast.success("Skill removed.");
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-3 pt-4">
                  <input 
                    type="text" 
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Add new skill (e.g. Inverter Repair)..."
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-hidden"
                  />
                  <button 
                    onClick={() => {
                      if (!newSkillName) return;
                      setSkillsList([...skillsList, { name: newSkillName, experience: "1 Year", charge: "₹250/hr" }]);
                      setNewSkillName("");
                      toast.success("Skill added successfully!");
                    }}
                    className="px-5 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 whitespace-nowrap"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 9: PERFORMANCE ANALYTICS */}
        {activeTab === "performance" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Worker Performance Metrics</h3>
                <p className="text-xs text-gray-500">Monitor acceptance rate, completion rate, and response times.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Acceptance Rate", value: "98.5%", desc: "Top 5% in Delhi NCR" },
                  { label: "Job Completion Rate", value: "100%", desc: "Zero cancellations" },
                  { label: "Avg Response Time", value: "45 secs", desc: "Extremely fast" },
                  { label: "Customer Satisfaction", value: "4.9 / 5.0", desc: "Elite badge holder" },
                  { label: "Repeat Customers", value: "42%", desc: "High customer loyalty" }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">{item.label}</span>
                    <h4 className="text-3xl font-black text-gray-900">{item.value}</h4>
                    <p className="text-xs text-emerald-600 font-semibold">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 10: DOCUMENTS */}
        {activeTab === "documents" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Verified Credentials & Documents</h3>
                <p className="text-xs text-gray-500">Aadhaar, PAN card, and police background verification status.</p>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Aadhaar Card", status: "Verified & Approved", number: "XXXX-XXXX-8942" },
                  { name: "PAN Card", status: "Verified & Approved", number: "ABCDE1234F" },
                  { name: "Police Verification Certificate", status: "Approved", number: "PVC-2026-DEL-991" }
                ].map((doc, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{doc.name}</h4>
                      <p className="text-xs text-gray-500 font-mono">{doc.number}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 11: SETTINGS */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Partner Settings & Preferences</h3>
                <p className="text-xs text-gray-500">Manage notifications, language, bank details, and security.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Push Notifications for Dispatches</h4>
                    <p className="text-xs text-gray-500">Receive instant alerts for nearby customer bookings</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-600" />
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">SMS Alerts</h4>
                    <p className="text-xs text-gray-500">Get backup SMS text alerts for urgent bookings</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-600" />
                </div>
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
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg">AI Saathi Business Advisor</h3>
                  <p className="text-xs text-gray-500">Maximize your daily earnings and bookings</p>
                </div>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button 
                onClick={runAiAdvisor}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs shadow-md"
              >
                Generate Peak Hours & Earnings Strategy
              </button>

              {aiAdvice && (
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-900 leading-relaxed font-medium">
                  {aiAdvice}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkerDashboard;
