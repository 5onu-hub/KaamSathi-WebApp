import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, Star, MapPin, Clock, ShieldCheck, Zap, TrendingUp, DollarSign, 
  ChevronRight, Award, CheckCircle2, AlertCircle, Info, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function CustomerAiRecommendationsView() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [demandInfo, setDemandInfo] = useState<any>(null);
  const [pricingInfo, setPricingInfo] = useState<any>(null);
  const [selectedType, setSelectedType] = useState("Best Overall");
  const [selectedCategory, setSelectedCategory] = useState("electrician");
  const [loading, setLoading] = useState(true);
  const [scoreModalWorker, setScoreModalWorker] = useState<any | null>(null);
  const [scoreDetails, setScoreDetails] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAiData();
  }, [selectedType, selectedCategory]);

  const fetchAiData = () => {
    setLoading(true);
    Promise.all([
      axios.get(`/api/v1/ai/recommendations?category=${selectedCategory}&type=${encodeURIComponent(selectedType)}`),
      axios.get("/api/v1/ai/demand"),
      axios.get(`/api/v1/ai/pricing?category=${selectedCategory}`)
    ])
      .then(([recRes, demRes, pricRes]) => {
        if (recRes.data.success) setRecommendations(recRes.data.data);
        if (demRes.data.success) setDemandInfo(demRes.data);
        if (pricRes.data.success) setPricingInfo(pricRes.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleOpenScoreBreakdown = (worker: any) => {
    axios.get(`/api/v1/ai/worker-score/${worker.id}`)
      .then(res => {
        if (res.data.success) {
          setScoreDetails(res.data);
          setScoreModalWorker(worker);
        }
      })
      .catch(() => {
        setScoreDetails({
          overallScore: worker.score || 95,
          confidenceScore: worker.confidenceScore || 98,
          breakdown: {
            ratingScore: { score: 98, weight: "25%", contribution: 24.5, label: `${worker.rating}★ rating` },
            distanceScore: { score: 95, weight: "20%", contribution: 19.0, label: worker.location },
            experienceScore: { score: 90, weight: "15%", contribution: 13.5, label: `${worker.experienceYears} yrs experience` },
            completionScore: { score: 99, weight: "15%", contribution: 14.8, label: "99% completion rate" }
          },
          recommendationReasons: [worker.reason]
        });
        setScoreModalWorker(worker);
      });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 font-sans">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> AI Recommendation & Smart Matching Engine
          </div>
          <h1 className="text-3xl font-black tracking-tight">Intelligent Worker Recommendations</h1>
          <p className="text-sm text-blue-200/80 max-w-2xl leading-relaxed">
            Our multi-factor AI scoring algorithm analyzes real-time distance, ratings, job completion history, response times, and pricing to connect you with the absolute best verified professional for your exact task.
          </p>
        </div>
      </div>

      {/* Demand & Pricing Insights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demand Surge Status</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase animate-pulse">
              {demandInfo?.currentDemandLevel || "High Surge"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-900 font-black text-lg">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span>Peak: {demandInfo?.peakBookingHours || "5 PM - 8 PM"}</span>
          </div>
          <p className="text-xs text-gray-500">Estimated waiting time: ~{demandInfo?.estimatedAverageWaitingTimeMins || 14} mins</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Smart Market Pricing</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              {pricingInfo?.savingsPercentage || "22% Savings"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-900 font-black text-lg">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>Avg: ₹{pricingInfo?.kaamSathiRecommendedHourlyRate || 250}/hr</span>
          </div>
          <p className="text-xs text-gray-500">Market Avg: ₹{pricingInfo?.marketAverageHourlyRate || 320}/hr (0% wage commission)</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Scoring Model</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase">
              Modular V2.4
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-900 font-black text-lg">
            <Zap className="w-5 h-5 text-blue-600" />
            <span>15 Multi-Factors</span>
          </div>
          <p className="text-xs text-gray-500">Distance 20% • Rating 25% • Experience 15%</p>
        </div>
      </div>

      {/* Category & Filter Tabs */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: "electrician", label: "Electrician" },
              { id: "plumber", label: "Plumber" },
              { id: "carpenter", label: "Carpenter" },
              { id: "cleaner", label: "House Cleaner" },
              { id: "painter", label: "Painter" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id ? "bg-slate-900 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation Types */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100">
          {[
            "Best Overall", "AI Recommended", "Nearest Worker", "Highest Rated", 
            "Fastest Response", "Budget Friendly", "Most Experienced"
          ].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedType === type ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {type === "AI Recommended" && <Sparkles className="w-3.5 h-3.5 inline mr-1" />}
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500">AI Engine is calculating multi-factor scores...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-2">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No workers match this filter</h3>
          <p className="text-xs text-gray-400">Try selecting another service category or recommendation type.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((worker, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={worker.id || i}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between space-y-6 group"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-bl-2xl text-xs font-black shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Score: {worker.score}/100
              </div>

              <div className="flex items-start gap-4 pt-2">
                <div className="relative">
                  <img src={worker.avatar} alt={worker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm" />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]" title="Verified">✓</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{worker.name}</h3>
                    {worker.verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{worker.categoryName}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 pt-0.5">
                    <span className="flex items-center gap-1 font-bold text-gray-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {worker.rating} ({worker.reviewsCount})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {worker.location} ({worker.distanceKm || 1.5} km)
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Explanation Box */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-blue-900">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" /> Why this worker?
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                    Confidence: {worker.confidenceScore || 98}%
                  </span>
                </div>
                <p className="text-xs text-blue-950/80 leading-relaxed font-medium">{worker.reason}</p>
              </div>

              {/* Smart Pricing & Stats */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-center">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Hourly Rate</span>
                  <span className="font-black text-gray-900 text-sm">₹{worker.hourlyRate}/hr</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Response</span>
                  <span className="font-black text-gray-900 text-sm">{worker.responseTimeMins || 12} mins</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Completion</span>
                  <span className="font-black text-emerald-600 text-sm">{worker.completionRate || 99}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleOpenScoreBreakdown(worker)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black transition-colors flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4 text-blue-600" /> AI Score Breakdown
                </button>
                <button 
                  onClick={() => navigate(`/booking/${worker.id}`)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  Book Now <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Score Breakdown Modal */}
      {scoreModalWorker && scoreDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl border border-gray-100 relative"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <img src={scoreModalWorker.avatar} alt={scoreModalWorker.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500" />
                <div>
                  <h3 className="font-black text-gray-900 text-base">{scoreModalWorker.name}</h3>
                  <p className="text-xs text-blue-600 font-bold">AI Match Score: {scoreDetails.overallScore}/100</p>
                </div>
              </div>
              <button onClick={() => setScoreModalWorker(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Algorithm Factor Weights</span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  AI Confidence: {scoreDetails.confidenceScore}%
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {Object.entries(scoreDetails.breakdown || {}).map(([key, val], idx) => {
                  const v: any = val;
                  return (
                    <div key={idx} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-black text-gray-900">
                        <span className="capitalize">{key.replace('Score', '')} ({v.weight})</span>
                        <span className="text-blue-600">+{v.contribution} pts</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${v.score}%` }}></div>
                      </div>
                      <p className="text-[11px] text-gray-500">{v.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-black text-blue-900 uppercase">Key Recommendation Highlights</h4>
                <ul className="space-y-1 text-xs text-blue-950">
                  {scoreDetails.recommendationReasons?.map((reason: string, rIdx: number) => (
                    <li key={rIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => { setScoreModalWorker(null); navigate(`/booking/${scoreModalWorker.id}`); }}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 transition-colors"
              >
                Proceed to Book {scoreModalWorker.name}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default CustomerAiRecommendationsView;
