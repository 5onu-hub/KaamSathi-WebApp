import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { Star, ShieldCheck, MapPin, Phone, MessageSquare, Navigation, CheckCircle2, SlidersHorizontal, Search } from "lucide-react";
import toast from "react-hot-toast";

// Customer Marker
const customerIcon = L.divIcon({
  className: "custom-customer-marker",
  html: `<div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -3px rgba(37, 99, 235, 0.5); color: white;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Category custom worker icons
const getWorkerIcon = (category: string) => {
  const emoji = category === "Electrician" ? "⚡" : category === "Plumber" ? "🔧" : category === "Carpenter" ? "🪚" : category === "Painter" ? "🎨" : "🛠️";
  const bgGradient = category === "Electrician" ? "linear-gradient(135deg, #f59e0b, #d97706)" :
                     category === "Plumber" ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" :
                     category === "Carpenter" ? "linear-gradient(135deg, #10b981, #059669)" :
                     "linear-gradient(135deg, #8b5cf6, #6d28d9)";

  return L.divIcon({
    className: "custom-worker-marker",
    html: `<div style="background: ${bgGradient}; width: 40px; height: 40px; border-radius: 14px; border: 2.5px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px -3px rgba(0,0,0,0.3); color: white; font-size: 18px;">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

interface WorkerMarkerData {
  _id: string;
  userId?: {
    name?: string;
    phone?: string;
    avatar?: string;
  };
  category: string;
  charges: number;
  rating: number;
  reviewsCount: number;
  verified?: boolean;
  experienceYears?: number;
  distance?: number;
  travelTime?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface InteractiveWorkerMapProps {
  workers?: WorkerMarkerData[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function InteractiveWorkerMap({
  workers = [],
  center = [28.6139, 77.2090], // Default Connaught Place, New Delhi
  zoom = 13,
  className = "h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
}: InteractiveWorkerMapProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const filteredWorkers = workers.filter(w => {
    const matchesCategory = selectedCategory === "all" || w.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchFilter || w.userId?.name?.toLowerCase().includes(searchFilter.toLowerCase()) || w.category.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Map Control Bar Overlays */}
      <div className="absolute top-4 left-4 right-4 z-40 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-gray-200/80">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-blue-600 shrink-0 ml-1" />
          <input 
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search workers on map..."
            className="bg-transparent text-xs sm:text-sm font-semibold text-gray-900 w-full focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["all", "Electrician", "Plumber", "Carpenter", "Painter"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat === "all" ? "All Skills" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="flex-1 w-full h-full relative z-10">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRecenter center={center} />

          {/* Customer Location Marker */}
          <Marker position={center} icon={customerIcon}>
            <Popup>
              <div className="p-2 space-y-1 min-w-[150px]">
                <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider">Your Location</span>
                <h4 className="font-bold text-xs text-gray-900">Connaught Place, New Delhi</h4>
                <p className="text-[11px] text-gray-500">Searching workers within 15 km radius</p>
              </div>
            </Popup>
          </Marker>

          {/* Marker Cluster Group for Nearby Workers */}
          <MarkerClusterGroup chunkedLoading>
            {filteredWorkers.map((worker, idx) => {
              const latOffset = ((idx % 5) - 2) * 0.015;
              const lngOffset = (((idx * 7) % 5) - 2) * 0.015;
              const pos: [number, number] = [
                worker.coordinates?.lat || center[0] + latOffset,
                worker.coordinates?.lng || center[1] + lngOffset
              ];

              return (
                <Marker
                  key={worker._id || idx}
                  position={pos}
                  icon={getWorkerIcon(worker.category)}
                >
                  <Popup>
                    <div className="space-y-3 p-1 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={worker.userId?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} 
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-gray-200 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-black text-xs text-gray-900">{worker.userId?.name || "Professional"}</h4>
                            {worker.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                          </div>
                          <span className="text-[10px] font-bold text-blue-600">{worker.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] bg-gray-50 p-2 rounded-xl font-semibold">
                        <span className="text-emerald-700 font-bold">₹{worker.charges}/hr</span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500" /> {worker.rating} ({worker.reviewsCount})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => navigate(`/messages/${worker._id}`)}
                          className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> Chat
                        </button>
                        <button
                          onClick={() => navigate(`/worker/${worker._id}`)}
                          className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}
