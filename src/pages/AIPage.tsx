import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Bot, Search, DollarSign, Award, TrendingUp, ShieldCheck, 
  Send, ArrowRight, CheckCircle2, Zap, Wrench, RefreshCw, BarChart3, HelpCircle 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { SEOHead } from "../components/common/SEOHead";

export function AIPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "search" | "estimate" | "growth">("chat");

  // Search Tool State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  // Estimator Tool State
  const [estCategory, setEstCategory] = useState("Electrician");
  const [estHours, setEstHours] = useState(3);
  const [estEmergency, setEstEmergency] = useState(false);
  const [estimateResult, setEstimateResult] = useState<any>(null);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch("/api/v1/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (data.success) {
        setSearchResult(data.filters);
        toast.success("AI successfully parsed natural language search!");
      }
    } catch (err) {
      toast.error("Search failed");
    }
  };

  const handleEstimateCost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/ai/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: estCategory, hours: estHours, isEmergency: estEmergency })
      });
      const data = await res.json();
      if (data.success) {
        setEstimateResult(data.estimate);
        toast.success("AI estimate generated successfully!");
      }
    } catch (err) {
      toast.error("Estimation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-24 font-sans selection:bg-blue-600 selection:text-white">
      <Toaster position="top-right" />
      <SEOHead 
        title="AI Saathi - Intelligent Assistant | KaamSathi"
        description="Official AI assistant for finding workers, estimating labor costs, and boosting professional growth on KaamSathi."
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> Powered by Gemini 2.5 Flash
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">AI Saathi Intelligent Suite</h1>
          <p className="text-sm sm:text-base text-blue-200 max-w-2xl leading-relaxed">
            Your dedicated AI co-pilot for the KaamSathi platform. Convert natural language into structured worker searches, calculate accurate labour estimates, and receive expert career growth advice.
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === "chat" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              <Bot className="w-4 h-4" /> AI Chat Assistant
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === "search" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              <Search className="w-4 h-4" /> NL Search Parser
            </button>
            <button
              onClick={() => setActiveTab("estimate")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === "estimate" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Price & Cost Estimator
            </button>
            <button
              onClick={() => setActiveTab("growth")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === "growth" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Worker Growth & Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Tab 1: Chat */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xl space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-black text-gray-900">Chat with AI Saathi</h2>
              <p className="text-xs text-gray-500">
                Click the floating AI Saathi button at the bottom right of any page to open the live interactive chat widget, or use the quick prompt starters below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div 
                onClick={() => toast.success("Use the floating chat widget on the bottom right to start chatting!")}
                className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 hover:border-blue-300 transition-all cursor-pointer space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-black text-gray-900 text-sm">Find Nearby Workers</h3>
                <p className="text-xs text-gray-600">"Find an experienced electrician in South Delhi under ₹400/hr."</p>
              </div>

              <div 
                onClick={() => toast.success("Use the floating chat widget on the bottom right to start chatting!")}
                className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-black text-gray-900 text-sm">Estimate Labour Cost</h3>
                <p className="text-xs text-gray-600">"Calculate total charges for 4 hours of plumbing and emergency repair."</p>
              </div>

              <div 
                onClick={() => toast.success("Use the floating chat widget on the bottom right to start chatting!")}
                className="p-6 rounded-2xl bg-violet-50/50 border border-violet-100 hover:border-violet-300 transition-all cursor-pointer space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-black text-gray-900 text-sm">Worker Career Growth</h3>
                <p className="text-xs text-gray-600">"How can I improve my worker profile rating and secure more bookings?"</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: NL Search */}
        {activeTab === "search" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xl space-y-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Natural Language AI Search
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-2">Convert Natural Language into Filters</h2>
              <p className="text-xs text-gray-500 mt-1">Type any sentence describing what worker you need, and AI Saathi will parse category, price ceiling, and location.</p>
            </div>

            <form onSubmit={handleAiSearch} className="flex gap-3">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., 'I need a plumber near Noida under ₹700 with high ratings'"
                className="flex-1 px-4 py-3.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:border-blue-600"
              />
              <button 
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Parse Query
              </button>
            </form>

            {searchResult && (
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Structured Search Filters Generated
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold">Category</span>
                    <span className="font-black text-blue-900 uppercase">{searchResult.category}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold">Max Price</span>
                    <span className="font-black text-emerald-700">₹{searchResult.maxPrice} / hr</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold">Location</span>
                    <span className="font-black text-gray-900">{searchResult.location}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold">Min Rating</span>
                    <span className="font-black text-amber-500">★ {searchResult.minRating}+</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Price Estimator */}
        {activeTab === "estimate" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xl space-y-8">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                AI Cost Estimator
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-2">Accurate Labour & Service Quotation</h2>
              <p className="text-xs text-gray-500 mt-1">Calculate transparent breakdown including labor wages, inspection visits, emergency fees, and platform safety insurance.</p>
            </div>

            <form onSubmit={handleEstimateCost} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-gray-700">Service Category</label>
                <select 
                  value={estCategory} 
                  onChange={(e) => setEstCategory(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 font-bold"
                >
                  <option value="Electrician">Electrician (₹350/hr)</option>
                  <option value="Plumber">Plumber (₹300/hr)</option>
                  <option value="Carpenter">Carpenter (₹350/hr)</option>
                  <option value="Painter">Painter (₹280/hr)</option>
                </select>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-gray-700">Estimated Duration ({estHours} Hours)</label>
                <input 
                  type="range" 
                  min={1} 
                  max={10} 
                  value={estHours} 
                  onChange={(e) => setEstHours(parseInt(e.target.value))}
                  className="w-full mt-2 accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-end">
                <button 
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Calculate Estimate
                </button>
              </div>
            </form>

            {estimateResult && (
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-4 text-xs">
                <h3 className="font-black text-blue-900 text-sm">Quotation Breakdown for {estimateResult.category}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-blue-100">
                    <span className="text-gray-600">Labour Wages ({estimateResult.hours} hrs @ ₹{estimateResult.hourlyRate}/hr):</span>
                    <span className="font-black text-gray-900">₹{estimateResult.labourCost}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-blue-100">
                    <span className="text-gray-600">Inspection & Visit Charge:</span>
                    <span className="font-black text-gray-900">₹{estimateResult.inspectionCharge}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-blue-100">
                    <span className="text-gray-600">Platform Insurance Fee:</span>
                    <span className="font-black text-gray-900">₹{estimateResult.platformFee}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm">
                    <span className="font-bold text-blue-950">Estimated Total:</span>
                    <span className="font-black text-blue-900 text-base">₹{estimateResult.totalEstimate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Worker Growth & Analytics */}
        {activeTab === "growth" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold text-violet-700 uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full">
                Worker Success & Admin Insights
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-2">AI Analytics & Growth Recommendations</h2>
              <p className="text-xs text-gray-500 mt-1">Real-time platform metrics and personalized AI advice for maximizing earnings and service quality.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Peak Demand Zone</span>
                <h4 className="font-black text-gray-900 text-base">South Delhi & Noida</h4>
                <p className="text-xs text-gray-600">Electrical & plumbing requests surge by 40% on weekends.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Average Response Time</span>
                <h4 className="font-black text-emerald-700 text-base">14 Minutes</h4>
                <p className="text-xs text-gray-600">Workers with response under 10 mins receive 3x more bookings.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Customer Satisfaction</span>
                <h4 className="font-black text-blue-900 text-base">98.4% Positive</h4>
                <p className="text-xs text-gray-600">Zero tolerance policy on upfront cash ensures high trust.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
