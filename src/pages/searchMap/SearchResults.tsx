import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Star, ShieldCheck, Clock, DollarSign, SlidersHorizontal, 
  Navigation, MessageSquare, Phone, CheckCircle2, Zap, ArrowLeft, Filter, X, Eye
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { SEOHead } from "../../components/common/SEOHead";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const customerIcon = L.divIcon({
  className: "custom-customer-marker",
  html: `<div style="background-color: #2563eb; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); color: white;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const getWorkerIcon = (category: string) => {
  const emoji = category === "Electrician" ? "⚡" : category === "Plumber" ? "🔧" : category === "Carpenter" ? "🪚" : "🛠️";
  return L.divIcon({
    className: "custom-worker-marker",
    html: `<div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); width: 36px; height: 36px; border-radius: 12px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); color: white; font-size: 16px;">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View mode: list, map, split
  const [viewMode, setViewMode] = useState<"list" | "map" | "split">("split");

  // Filters state
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [radius, setRadius] = useState(Number(searchParams.get("radius")) || 15);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(searchParams.get("emergency") === "true");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("nearest");

  // Selected worker for popup details
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);

  const customerLat = Number(searchParams.get("lat")) || 28.6139;
  const customerLng = Number(searchParams.get("lng")) || 77.2090;

  useEffect(() => {
    fetchWorkers();
  }, [searchParams, radius, verifiedOnly, emergencyOnly, minRating, sortBy]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: String(customerLat),
        lng: String(customerLng),
        radius: String(radius),
        sort: sortBy
      });
      if (query) params.append("q", query);
      if (category) params.append("category", category);
      if (verifiedOnly) params.append("verified", "true");
      if (minRating > 0) params.append("rating", String(minRating));

      const res = await fetch(`/api/v1/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        let list = data.data.map((w: any, idx: number) => {
          const latOffset = (idx % 3 - 1) * 0.03;
          const lngOffset = (idx % 2 === 0 ? 1 : -1) * 0.025;
          return {
            ...w,
            coordinates: w.coordinates || { lat: 28.6139 + latOffset, lng: 77.2090 + lngOffset }
          };
        });
        if (emergencyOnly) {
          list = list.filter((w: any) => w.distance <= 5);
        }
        setWorkers(list);
      }
    } catch (err) {
      console.error("Failed to fetch workers:", err);
      toast.error("Error loading nearby workers.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (worker: any) => {
    navigate(`/worker/${worker._id}`);
  };

  const handleChat = (worker: any) => {
    navigate(`/messages/${worker._id}`);
  };

  const handleCall = (worker: any) => {
    toast.success(`Calling ${worker.userId?.name || 'Worker'} (${worker.userId?.phone || '+91 98765 43210'})`);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-24 font-sans selection:bg-blue-600 selection:text-white">
      <Toaster position="top-right" />
      <SEOHead 
        title="OpenStreetMap Workers & Map Results | KaamSathi"
        description="Browse verified professionals near you with real-time OpenStreetMap distances, pricing, and instant booking."
      />

      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/search")}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tight">
                {query ? `Results for "${query}"` : "OpenStreetMap Nearby Workers"}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Connaught Place, New Delhi ({radius} km radius) • {workers.length} found
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Map View
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Filter Sidebar */}
        {(viewMode === "list" || viewMode === "split") && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-6`}>
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/80 space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Advanced Filters
                </h3>
                <button 
                  onClick={() => { setQuery(""); setCategory(""); setRadius(10); setVerifiedOnly(false); setEmergencyOnly(false); setMinRating(0); }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Service Category Filter */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-800"
                >
                  <option value="">All Categories</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Painter">Painter</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                </select>
              </div>

              {/* Distance Radius */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-gray-700">Distance Radius: {radius} km</label>
                <input 
                  type="range" 
                  min={1} 
                  max={50} 
                  value={radius} 
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Sort By */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-gray-700">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-800"
                >
                  <option value="nearest">Nearest First</option>
                  <option value="rating">Highest Rated ★</option>
                  <option value="price-low">Lowest Price (₹)</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-700">
                  <input 
                    type="checkbox" 
                    checked={verifiedOnly} 
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                  <span>Verified Workers Only</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-700">
                  <input 
                    type="checkbox" 
                    checked={emergencyOnly} 
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 accent-orange-500"
                  />
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Emergency Available (&lt; 30 mins)
                  </span>
                </label>
              </div>

            </div>
          </div>
        )}

        {/* Center/Right Content Area: List and/or Map */}
        <div className={`${viewMode === 'split' ? 'lg:col-span-8' : viewMode === 'list' ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>
          
          {/* Worker Cards Grid */}
          {(viewMode === "list" || viewMode === "split") && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Searching nearby professionals...</p>
                </div>
              ) : workers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-gray-900 text-base">No workers found matching your criteria</h3>
                </div>
              ) : (
                <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-3'} gap-4`}>
                  {workers.map((worker) => (
                    <motion.div
                      key={worker._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-4 relative group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={worker.userId?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} 
                            alt={worker.userId?.name}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-black text-gray-900 text-sm">{worker.userId?.name || "Professional"}</h4>
                              {worker.verified && <ShieldCheck className="w-4 h-4 text-blue-600" />}
                            </div>
                            <span className="text-xs font-bold text-blue-600">{worker.category}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-emerald-700 text-sm">₹{worker.charges}/hr</span>
                          <span className="text-[10px] text-gray-400 block font-semibold">{worker.experienceYears} yrs exp</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{worker.bio}</p>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/60 text-xs font-semibold text-blue-900">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" /> {worker.distance} km away
                        </span>
                        <span className="flex items-center gap-1 font-bold text-emerald-700">
                          <Clock className="w-3.5 h-3.5" /> ETA: {worker.travelTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{worker.rating}</span>
                          <span className="text-gray-400 font-normal">({worker.reviewsCount})</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleChat(worker)}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCall(worker)}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleBookNow(worker)}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Interactive OpenStreetMap Leaflet View */}
          {(viewMode === "map" || viewMode === "split") && (
            <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-200/80 relative overflow-hidden h-[600px] flex flex-col">
              <div className="flex items-center justify-between pb-3 px-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <h3 className="font-black text-gray-900 text-sm">OpenStreetMap Live Explorer & Leaflet Markers</h3>
                </div>
                <button
                  onClick={() => navigate("/map")}
                  className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors"
                >
                  Full Map View ↗
                </button>
              </div>

              <div className="flex-1 rounded-2xl overflow-hidden relative">
                <MapContainer 
                  center={[customerLat, customerLng]} 
                  zoom={13} 
                  scrollWheelZoom={true} 
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  <MapRecenter center={[customerLat, customerLng]} />

                  {/* Customer Marker */}
                  <Marker position={[customerLat, customerLng]} icon={customerIcon}>
                    <Popup>
                      <div className="text-xs p-1">
                        <strong className="text-blue-600 block font-black">Your Location</strong>
                        <span>Connaught Place, New Delhi</span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Worker Markers */}
                  {workers.map((worker) => {
                    const pos: [number, number] = [worker.coordinates?.lat || 28.6, worker.coordinates?.lng || 77.2];
                    return (
                      <Marker 
                        key={worker._id} 
                        position={pos} 
                        icon={getWorkerIcon(worker.category)}
                        eventHandlers={{
                          click: () => setSelectedWorker(worker)
                        }}
                      >
                        <Popup>
                          <div className="space-y-2 p-1 min-w-[160px]">
                            <h4 className="font-bold text-xs text-gray-900">{worker.userId?.name}</h4>
                            <span className="text-[10px] text-blue-600 font-bold">{worker.category} • ₹{worker.charges}/hr</span>
                            <button
                              onClick={() => navigate(`/map/worker/${worker._id}`)}
                              className="w-full py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              OpenRoute Navigation
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
