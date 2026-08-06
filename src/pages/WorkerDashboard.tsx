import React, { useState, useEffect } from "react";
import { 
  Wrench, CheckCircle, Clock, Star, TrendingUp, ShieldCheck, 
  Briefcase, DollarSign, Calendar, MessageSquare, Bell, 
  Settings, User, Award, MapPin, Phone, Check, X, Play, Pause, 
  FileText, Upload, ChevronRight, AlertCircle, Sparkles, LogOut, Navigation, Eye, CheckCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function WorkerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "earnings" | "profile" | "availability" | "portfolio" | "messages" | "notifications" | "reviews" | "verification" | "settings">("overview");
  const [isOnline, setIsOnline] = useState(true);
  const [jobRequests, setJobRequests] = useState([
    {
      id: "req_1",
      customerName: "Rahul Verma",
      service: "Electrical Wiring & Fan Repair",
      location: "South Extension, New Delhi",
      distance: "2.4 km",
      expectedDuration: "1.5 hours",
      budget: 450,
      requestedTime: "Today, 02:30 PM",
      status: "pending"
    }
  ]);

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs h-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-gray-900">KaamSathi</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] tracking-wide uppercase border border-blue-100">
                Worker Partner Portal
              </span>
            </div>
            <p className="text-xs text-gray-500">Partner ID: KS-W-8942 • Delhi NCR</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/worker/wallet")}
            className="px-4 py-2.5 rounded-2xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" /> Wallet
          </button>

          <button 
            onClick={() => navigate("/worker/earnings")}
            className="px-4 py-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4 text-blue-600" /> Earnings
          </button>

          <button 
            onClick={() => navigate("/worker/jobs")}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" /> Live Jobs
          </button>

          <button 
            onClick={() => { setIsOnline(!isOnline); showToast(isOnline ? "You are now Offline" : "You are Online & Receiving Jobs!"); }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
              isOnline ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
            {isOnline ? "Online & Ready" : "Offline"}
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
              alt="Ramesh Kumar" 
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-600/20"
            />
            <div className="hidden sm:block text-left text-xs">
              <span className="font-bold text-gray-900 block">Ramesh Kumar</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Electrician
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md inline-block">
              Worker Partner Dashboard
            </span>
            <h2 className="text-3xl font-black tracking-tight">Real-Time Job Management Center</h2>
            <p className="text-xs text-blue-100">Accept job dispatches, navigate to customer locations, upload completion photos, and collect payouts.</p>
          </div>
          <button 
            onClick={() => navigate("/worker/jobs")}
            className="px-6 py-3.5 rounded-2xl bg-white text-blue-800 text-xs font-black shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2"
          >
            Go to Live Worker Jobs Portal <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Today's Earnings", value: "₹2,450", change: "+18% vs yesterday", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Jobs Completed", value: "54 Jobs", change: "100% completion rate", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Worker Rating", value: "4.8 ★", change: "Based on 124 reviews", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                  <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                <p className="text-xs text-gray-500 font-semibold">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Incoming Dispatches */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Active Service Requests & Dispatches</h3>
            <button onClick={() => navigate("/worker/jobs")} className="text-xs font-bold text-blue-600 hover:underline">
              Open Full Job Control Center &rarr;
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 text-base">Rahul Verma</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  AC & Master Electrical Check
                </span>
              </div>
              <p className="text-xs text-gray-500">South Extension, New Delhi • 2.4 km away</p>
            </div>

            <button 
              onClick={() => navigate("/worker/jobs")}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700"
            >
              Manage & Start Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
