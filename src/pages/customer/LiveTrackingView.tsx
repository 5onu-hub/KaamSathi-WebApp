import React, { useState, useEffect } from "react";
import { 
  Navigation, Phone, MessageSquare, ShieldAlert, CheckCircle2, Clock, 
  MapPin, Radio, Zap, ArrowRight, Play, Pause, RefreshCw, User, Star, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function LiveTrackingView() {
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("travelling");
  const [simulatedLat, setSimulatedLat] = useState(28.6139);
  const [simulatedLng, setSimulatedLng] = useState(77.2090);

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(() => {
      if (isSharing && currentStatus === "travelling") {
        setSimulatedLat(prev => prev + 0.0005);
        setSimulatedLng(prev => prev + 0.0003);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isSharing, currentStatus]);

  const fetchTracking = () => {
    axios.get("/api/v1/tracking/BK-88921")
      .then(res => {
        if (res.data.success) {
          setTrackingData(res.data.data);
          setCurrentStatus(res.data.data.status);
        }
        setLoading(false);
      })
      .catch(() => {
        setTrackingData({
          bookingId: "BK-88921",
          status: "travelling",
          worker: {
            name: "Ramesh Kumar",
            category: "Expert Electrician",
            phone: "+91 98765 43210",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
            rating: 4.9,
            speedKmh: 34
          },
          customer: {
            name: "Amitabh Sen",
            address: "Flat 402, Sunshine Apartments, Connaught Place, New Delhi",
            location: { lat: 28.6280, lng: 77.2090 }
          },
          route: {
            distanceKm: 2.1,
            etaMins: 6
          },
          milestones: [
            { title: "Booking Confirmed", time: "10:15 AM", completed: true },
            { title: "Worker Assigned", time: "10:16 AM", completed: true },
            { title: "Started Journey", time: "10:20 AM", completed: true },
            { title: "Arrived at Location", time: "Pending", completed: false },
            { title: "Service Completed", time: "Pending", completed: false }
          ]
        });
        setLoading(false);
      });
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    toast.success(`Worker status updated to: ${newStatus.toUpperCase()}`);
    axios.post("/api/v1/tracking/update-location", {
      bookingId: "BK-88921",
      lat: simulatedLat,
      lng: simulatedLng,
      status: newStatus,
      speedKmh: 35
    }).catch(() => {});
  };

  if (loading || !trackingData) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs font-bold text-gray-500">Connecting to Uber-style Live GPS Telemetry...</p>
      </div>
    );
  }

  const workerPosition: [number, number] = [simulatedLat, simulatedLng];
  const customerPosition: [number, number] = [trackingData.customer.location.lat, trackingData.customer.location.lng];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 font-sans">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-black tracking-wider uppercase">
            <Radio className="w-4 h-4 animate-pulse text-emerald-400" /> Live Uber-Style Tracking • Booking #{trackingData.bookingId}
          </div>
          <h1 className="text-3xl font-black tracking-tight">{trackingData.worker.name} is En Route</h1>
          <p className="text-xs text-blue-100 max-w-xl">
            Real-time GPS telemetry, speed monitoring, and interactive OpenStreetMap navigation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSharing(!isSharing)}
            className={`px-5 py-3 rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-all ${
              isSharing ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-amber-600 hover:bg-amber-700 text-white"
            }`}
          >
            {isSharing ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isSharing ? "Sharing Live GPS" : "Sharing Paused"}
          </button>
        </div>
      </div>

      {/* Main Grid: Map & Worker Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Leaflet Map */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" /> Live Route Map & Telemetry
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ⚡ {trackingData.worker.speedKmh} km/h • {trackingData.route.etaMins} mins ETA
            </span>
          </div>

          <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-gray-200 z-0 relative">
            <MapContainer center={workerPosition} zoom={14} style={{ width: "100%", height: "100%" }}>
              <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={workerPosition}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong>{trackingData.worker.name}</strong><br/>
                    Status: {currentStatus.toUpperCase()}<br/>
                    Speed: {trackingData.worker.speedKmh} km/h
                  </div>
                </Popup>
              </Marker>
              <Marker position={customerPosition}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong>Destination (You)</strong><br/>
                    {trackingData.customer.address}
                  </div>
                </Popup>
              </Marker>
              <Polyline 
                positions={[workerPosition, customerPosition]} 
                color="#2563eb" 
                weight={5} 
                opacity={0.8} 
                dashArray="10, 10"
              />
            </MapContainer>
          </div>

          {/* Quick status simulation buttons for demo */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-gray-500">Simulate Status:</span>
            {["accepted", "travelling", "arrived", "working", "completed"].map(st => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all ${
                  currentStatus === st ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Worker Profile & Live Telemetry Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <img src={trackingData.worker.avatar} alt={trackingData.worker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm" />
              <div>
                <h4 className="font-black text-gray-900 text-base">{trackingData.worker.name}</h4>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{trackingData.worker.category}</p>
                <p className="text-xs text-gray-500">★ {trackingData.worker.rating} Customer Rating</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-100 text-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Estimated ETA</span>
                <span className="font-black text-blue-700 text-lg block">{trackingData.route.etaMins} mins</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Distance</span>
                <span className="font-black text-gray-900 text-lg block">{trackingData.route.distanceKm} km</span>
              </div>
            </div>

            <div className="space-y-3">
              <a 
                href={`tel:${trackingData.worker.phone}`}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" /> Call Worker ({trackingData.worker.phone})
              </a>
              <button 
                onClick={() => toast.success("Opening secure live chat with worker...")}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Open Chat
              </button>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-gray-900 text-base">Journey Milestones</h3>
            <div className="space-y-3">
              {trackingData.milestones.map((m: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    m.completed ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {m.completed ? "✓" : i + 1}
                  </div>
                  <div>
                    <h4 className={`text-xs font-black ${m.completed ? "text-gray-900" : "text-gray-400"}`}>{m.title}</h4>
                    <span className="text-[10px] text-gray-500">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default LiveTrackingView;
