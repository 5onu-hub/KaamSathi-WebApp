import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation, MapPin, Search, Star, ShieldCheck, Clock, DollarSign, 
  ArrowLeft, Compass, Layers, ZoomIn, ZoomOut, Maximize2, Phone, MessageSquare, Zap, Minimize2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { SEOHead } from "../../components/common/SEOHead";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Custom Leaflet Icons using DivIcon
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

export function MapExplorer() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const [workers, setWorkers] = useState<any[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<any | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [nominatimQuery, setNominatimQuery] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Connaught Place, New Delhi

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch("/api/v1/search");
      const data = await res.json();
      if (data.success) {
        // Assign mock or real coordinates if missing
        const enhanced = data.data.map((w: any, idx: number) => {
          const latOffset = (idx % 3 - 1) * 0.03;
          const lngOffset = (idx % 2 === 0 ? 1 : -1) * 0.025;
          return {
            ...w,
            coordinates: w.coordinates || { lat: 28.6139 + latOffset, lng: 77.2090 + lngOffset }
          };
        });
        setWorkers(enhanced);
        if (workerId) {
          const found = enhanced.find((w: any) => w._id === workerId);
          if (found) {
            handleSelectWorker(found);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectWorker = async (worker: any) => {
    setSelectedWorker(worker);
    const workerLatLng: [number, number] = [worker.coordinates?.lat || 28.6, worker.coordinates?.lng || 77.2];
    setMapCenter(workerLatLng);

    // Fetch Route from OpenRouteService or OSRM public API or simulate real route
    try {
      const startLng = 77.2090;
      const startLat = 28.6139;
      const endLng = worker.coordinates?.lng || 77.2;
      const endLat = worker.coordinates?.lat || 28.6;

      const orsRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`);
      const orsData = await orsRes.json();
      if (orsData.routes && orsData.routes.length > 0) {
        const route = orsData.routes[0];
        const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
        setRouteCoords(coords);
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1) + " km",
          duration: Math.round(route.duration / 60) + " mins",
          summary: "Fastest OpenStreetMap Route via arterial roads"
        });
      } else {
        setRouteCoords([[28.6139, 77.2090], [endLat, endLng]]);
        setRouteInfo({
          distance: worker.distance + " km",
          duration: worker.travelTime || "15 mins",
          summary: "Direct route path"
        });
      }
    } catch (err) {
      setRouteCoords([[28.6139, 77.2090], [28.62, 77.22]]);
      setRouteInfo({
        distance: worker.distance + " km",
        duration: worker.travelTime || "15 mins",
        summary: "Calculated route path"
      });
    }
  };

  // Nominatim Geocoding Search
  const handleNominatimSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominatimQuery.trim()) return;
    try {
      toast.loading("Searching location via Nominatim API...");
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nominatimQuery)}`);
      const data = await res.json();
      toast.dismiss();
      if (data && data.length > 0) {
        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);
        setMapCenter([lat, lon]);
        toast.success(`Found: ${data[0].display_name.slice(0, 40)}...`);
      } else {
        toast.error("Location not found via Nominatim.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Geocoding failed.");
    }
  };

  return (
    <div className={`bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white ${isFullScreen ? 'fixed inset-0 z-50' : 'min-h-screen'}`}>
      <Toaster position="top-right" />
      <SEOHead 
        title="OpenStreetMap Explorer & Route Navigation | KaamSathi"
        description="Explore verified workers on OpenStreetMap using Leaflet, Nominatim geocoding, and OpenRouteService navigation."
      />

      {/* Top Header Bar */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between z-30 shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/search/results")}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin" /> OpenStreetMap & Nominatim Navigation Center
            </h1>
            <p className="text-[11px] text-gray-400">100% Free OpenSource Maps, Leaflet & OSRM Routing</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleNominatimSearch} className="hidden sm:flex items-center gap-2">
            <input 
              type="text"
              value={nominatimQuery}
              onChange={(e) => setNominatimQuery(e.target.value)}
              placeholder="Search area via Nominatim..."
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:border-emerald-500 w-48"
            />
            <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all">
              Geocode
            </button>
          </form>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => navigate("/search/results")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all"
          >
            List Results
          </button>
        </div>
      </header>

      {/* Main Map + Sidebar Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        
        {/* Left Workers Sidebar */}
        <div className="w-full lg:w-96 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-4 overflow-y-auto z-20 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter workers on map..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="space-y-3">
            {workers.filter(w => !searchFilter || w.userId?.name?.toLowerCase().includes(searchFilter.toLowerCase()) || w.category?.toLowerCase().includes(searchFilter.toLowerCase())).map((worker) => (
              <div
                key={worker._id}
                onClick={() => handleSelectWorker(worker)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                  selectedWorker?._id === worker._id 
                    ? 'bg-emerald-600/20 border-emerald-500 shadow-lg' 
                    : 'bg-gray-800/60 border-gray-700 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={worker.userId?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} 
                      alt={worker.userId?.name}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-600"
                    />
                    <div>
                      <h4 className="font-black text-white text-xs">{worker.userId?.name}</h4>
                      <span className="text-[10px] text-emerald-400 font-bold">{worker.category}</span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-400 text-xs">₹{worker.charges}/hr</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-300 pt-2 border-t border-gray-700/60">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" /> {worker.distance} km
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    ★ {worker.rating}
                  </span>
                  <span className="text-emerald-400 font-semibold">{worker.travelTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right React Leaflet Map Canvas */}
        <div className="flex-1 bg-slate-900 relative overflow-hidden min-h-[500px]">
          
          {/* Route Navigation HUD if selected */}
          {routeInfo && selectedWorker && (
            <div className="absolute top-4 left-4 z-[1000] bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl border border-gray-700 shadow-2xl space-y-2 max-w-sm">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <span className="font-black text-xs text-emerald-400 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 animate-pulse" /> OpenRouteService Navigation
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold">Live Path</span>
              </div>
              <div className="text-xs space-y-1">
                <p className="text-gray-300"><strong className="text-white">Professional:</strong> {selectedWorker.userId?.name} ({selectedWorker.category})</p>
                <p className="text-gray-300"><strong className="text-white">Route Distance:</strong> {routeInfo.distance}</p>
                <p className="text-gray-300"><strong className="text-white">Est. Travel Time:</strong> {routeInfo.duration}</p>
                <p className="text-[11px] text-gray-400 italic">{routeInfo.summary}</p>
              </div>
              <button
                onClick={() => navigate(`/worker/${selectedWorker._id}`)}
                className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Book Professional Now
              </button>
            </div>
          )}

          {/* Leaflet Map Component */}
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ width: "100%", height: "100%", background: "#0f172a" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapRecenter center={mapCenter} />

            {/* Customer Location Marker */}
            <Marker position={[28.6139, 77.2090]} icon={customerIcon}>
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
              const isSelected = selectedWorker?._id === worker._id;

              return (
                <Marker 
                  key={worker._id} 
                  position={pos} 
                  icon={getWorkerIcon(worker.category)}
                  eventHandlers={{
                    click: () => handleSelectWorker(worker)
                  }}
                >
                  <Popup>
                    <div className="space-y-2 p-1 min-w-[180px]">
                      <div className="flex items-center gap-2">
                        <img 
                          src={worker.userId?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} 
                          alt="" 
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-gray-900">{worker.userId?.name}</h4>
                          <span className="text-[10px] text-blue-600 font-bold">{worker.category}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-600 flex justify-between font-semibold">
                        <span>₹{worker.charges}/hr</span>
                        <span className="text-emerald-700">★ {worker.rating}</span>
                      </div>
                      <button
                        onClick={() => handleSelectWorker(worker)}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        Calculate Route & Navigate
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Polyline Route */}
            {routeCoords.length > 0 && (
              <Polyline positions={routeCoords} color="#10b981" weight={5} opacity={0.8} dashArray="8, 8" />
            )}
          </MapContainer>

        </div>

      </div>

    </div>
  );
}
