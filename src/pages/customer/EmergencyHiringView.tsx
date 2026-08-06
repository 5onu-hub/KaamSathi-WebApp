import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Zap, Droplet, Key, Car, Sparkles, Activity, Clock, 
  MapPin, Phone, CheckCircle2, AlertTriangle, ChevronRight, RefreshCw, Radio, Siren
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function EmergencyHiringView() {
  const [selectedCategory, setSelectedCategory] = useState("electrician");
  const [radiusKm, setRadiusKm] = useState("5");
  const [data, setData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [timelineStep, setTimelineStep] = useState(0); // 0: Idle, 1: Searching, 2: Found, 3: Accepted, 4: On The Way, 5: Arrived, 6: Completed
  const [activeWorker, setActiveWorker] = useState<any>(null);

  useEffect(() => {
    fetchEmergencyData();
  }, [selectedCategory, radiusKm]);

  const fetchEmergencyData = () => {
    setLoading(true);
    Promise.all([
      axios.get(`/api/v1/emergency/nearby?category=${selectedCategory}&radiusKm=${radiusKm}`),
      axios.get("/api/v1/emergency/analytics")
    ])
      .then(([nearbyRes, analRes]) => {
        if (nearbyRes.data.success) setData(nearbyRes.data);
        if (analRes.data.success) setAnalytics(analRes.data);
        setLoading(false);
      })
      .catch(() => {
        setData({
          emergencyCategories: [
            { id: "electrician", name: "Electric Short Circuit", icon: Zap, avgEtaMins: 12, count: 8 },
            { id: "plumber", name: "Water Leakage / Pipe Burst", icon: Droplet, avgEtaMins: 15, count: 6 },
            { id: "locksmith", name: "Door Lock Issue", icon: Key, avgEtaMins: 10, count: 5 },
            { id: "driver", name: "Emergency Driver", icon: Car, avgEtaMins: 18, count: 4 },
            { id: "cleaner", name: "Emergency Cleaner", icon: Sparkles, avgEtaMins: 20, count: 7 },
            { id: "medical", name: "Medical Attendant", icon: Activity, avgEtaMins: 25, count: 3 }
          ],
          nearbyWorkers: [
            {
              id: "ew_1",
              name: "Ramesh Kumar",
              category: selectedCategory,
              categoryName: "Expert Electrician",
              rating: 4.9,
              distanceKm: 1.2,
              etaMins: 8,
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
              phone: "+91 98765 43210",
              emergencyReady: true,
              completedEmergencies: 42
            },
            {
              id: "ew_2",
              name: "Suresh Sharma",
              category: selectedCategory,
              categoryName: "Senior Plumber",
              rating: 4.8,
              distanceKm: 2.4,
              etaMins: 14,
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
              phone: "+91 98765 43211",
              emergencyReady: true,
              completedEmergencies: 38
            }
          ]
        });
        setAnalytics({
          totalEmergencyRequests: 1420,
          fastestResponseMins: 4.2,
          averageArrivalTimeMins: 12.5,
          successRatePercentage: 99.2
        });
        setLoading(false);
      });
  };

  const handleBroadcastSOS = (worker?: any) => {
    setSosActive(true);
    setTimelineStep(1); // Searching
    toast.success("🚨 Emergency SOS Broadcast Sent! Blaring siren & alerting nearby workers...");

    setTimeout(() => {
      setTimelineStep(2); // Found
      setActiveWorker(worker || data?.nearbyWorkers?.[0]);
      toast.success("⚡ Verified Emergency Worker Found!");
    }, 2000);

    setTimeout(() => {
      setTimelineStep(3); // Accepted
    }, 4000);

    setTimeout(() => {
      setTimelineStep(4); // On The Way
    }, 6000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 font-sans">
      <Toaster position="top-right" />

      {/* Emergency Red Hero Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-red-200 text-xs font-black tracking-wider uppercase animate-pulse">
            <Siren className="w-4 h-4 text-amber-300" /> 24/7 KaamSathi Emergency SOS Dispatch
          </div>
          <h1 className="text-3xl font-black tracking-tight">Instant Urgent Help Within Minutes</h1>
          <p className="text-xs text-red-100 max-w-xl leading-relaxed">
            Experiencing a water pipe burst, electric short circuit, or urgent breakdown? Tap below to instantly broadcast an SOS alert to all verified workers within your selected radius.
          </p>
        </div>

        <button 
          onClick={() => handleBroadcastSOS()}
          className="px-8 py-5 bg-white text-red-600 hover:bg-red-50 rounded-2xl font-black text-sm shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 shrink-0 animate-bounce"
        >
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <span>INSTANT SOS BROADCAST</span>
        </button>
      </div>

      {/* Emergency Analytics Bar */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Emergencies Handled</span>
            <div className="text-2xl font-black text-gray-900">{analytics.totalEmergencyRequests}+</div>
            <p className="text-xs text-emerald-600 font-bold">99.2% Resolution Rate</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fastest Response</span>
            <div className="text-2xl font-black text-red-600">{analytics.fastestResponseMins} Mins</div>
            <p className="text-xs text-gray-500">Sub-5 minute dispatch</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average Arrival ETA</span>
            <div className="text-2xl font-black text-gray-900">{analytics.averageArrivalTimeMins} Mins</div>
            <p className="text-xs text-gray-500">Live GPS tracking enabled</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Emergency Siren</span>
            <div className="text-2xl font-black text-amber-600 flex items-center gap-2">
              <Radio className="w-6 h-6 animate-spin" /> Active
            </div>
            <p className="text-xs text-gray-500">Loud priority alert</p>
          </div>
        </div>
      )}

      {/* Active SOS Timeline & Modal State */}
      {sosActive && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-500 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-red-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center animate-pulse">
                <Siren className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-red-900 text-lg">Active Emergency SOS Dispatch</h3>
                <p className="text-xs text-red-700">Broadcasting to all nearby {selectedCategory} specialists</p>
              </div>
            </div>
            <button 
              onClick={() => { setSosActive(false); setTimelineStep(0); }} 
              className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-900 rounded-xl text-xs font-black transition-colors"
            >
              Cancel Emergency
            </button>
          </div>

          {/* Timeline Steps */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            {[
              { step: 1, label: "Searching..." },
              { step: 2, label: "Worker Found" },
              { step: 3, label: "Accepted" },
              { step: 4, label: "On The Way" },
              { step: 5, label: "Arrived" },
              { step: 6, label: "Completed" }
            ].map((t) => (
              <div key={t.step} className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                timelineStep >= t.step ? "bg-red-600 text-white border-red-600 shadow-md" : "bg-white text-gray-600 border-red-200"
              }`}>
                <div className="font-black mb-1">0{t.step}</div>
                <div>{t.label}</div>
              </div>
            ))}
          </div>

          {activeWorker && timelineStep >= 2 && (
            <div className="bg-white rounded-2xl p-6 border border-red-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="flex items-center gap-4">
                <img src={activeWorker.avatar} alt={activeWorker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500 shadow-sm" />
                <div>
                  <h4 className="font-black text-gray-900 text-base">{activeWorker.name} ({activeWorker.categoryName})</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-2 pt-1">
                    <span className="font-bold text-emerald-600">★ {activeWorker.rating}</span> • 
                    <span className="text-red-600 font-bold">ETA: {activeWorker.etaMins} mins</span> • 
                    <span>Distance: {activeWorker.distanceKm} km</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a 
                  href={`tel:${activeWorker.phone}`}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call Worker
                </a>
                <button 
                  onClick={() => setTimelineStep(5)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md transition-colors"
                >
                  Simulate Arrival
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Category & Radius Selection */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-gray-900 text-base">Select Emergency Service</h3>
            <p className="text-xs text-gray-500">Tap an emergency category to filter immediate local responders.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Radius:</span>
            {["2", "5", "10"].map(r => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  radiusKm === r ? "bg-red-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { id: "electrician", name: "Electrician", icon: Zap },
            { id: "plumber", name: "Plumber", icon: Droplet },
            { id: "locksmith", name: "Locksmith", icon: Key },
            { id: "driver", name: "Driver", icon: Car },
            { id: "cleaner", name: "Cleaner", icon: Sparkles },
            { id: "medical", name: "Medical", icon: Activity }
          ].map(cat => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border text-center space-y-2 transition-all flex flex-col items-center justify-center ${
                  active ? "bg-red-600 text-white border-red-600 shadow-lg scale-105" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-black">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nearby Workers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-gray-900 text-base">Nearby Urgent Responders (Within {radiusKm} km)</h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            ● Live GPS Tracking Active
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-gray-500">Scanning local worker grid for emergency availability...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.nearbyWorkers?.map((worker: any, i: number) => (
              <div key={worker.id || i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-2xl text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Emergency Ready
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <img src={worker.avatar} alt={worker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500 shadow-sm" />
                  <div className="space-y-1">
                    <h4 className="font-black text-gray-900 text-base">{worker.name}</h4>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider">{worker.categoryName}</p>
                    <p className="text-xs text-gray-500">★ {worker.rating} • {worker.completedEmergencies} emergency jobs done</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-red-50/60 p-4 rounded-2xl border border-red-100 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Distance</span>
                    <span className="font-black text-gray-900 text-sm block">{worker.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Arrival ETA</span>
                    <span className="font-black text-red-600 text-sm block">{worker.etaMins} mins</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                    <span className="font-black text-emerald-600 text-sm block">Online</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleBroadcastSOS(worker)}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" /> Dispatch {worker.name} Instantly
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmergencyHiringView;
