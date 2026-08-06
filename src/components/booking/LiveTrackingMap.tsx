import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Compass, ShieldCheck, Phone, RefreshCw } from "lucide-react";

interface LiveTrackingMapProps {
  workerName: string;
  workerLocationText?: string;
  etaMinutes?: number;
  distanceKm?: number;
  status: string;
  onCallWorker?: () => void;
}

export function LiveTrackingMap({ workerName, workerLocationText, etaMinutes = 8, distanceKm = 1.8, status, onCallWorker }: LiveTrackingMapProps) {
  const [progress, setProgress] = useState(0.4); // 0 to 1 along line

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 0.95 ? 0.2 : p + 0.05));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate worker marker position along curve
  const startX = 60; // Customer location
  const startY = 160;
  const endX = 320;   // Worker start
  const endY = 40;

  const currentX = endX + (startX - endX) * progress;
  const currentY = endY + (startY - endY) * progress;

  return (
    <div className="relative w-full h-[320px] rounded-3xl overflow-hidden border border-gray-200 bg-slate-900 shadow-lg">
      {/* Map Graphic Canvas Simulation */}
      <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 400 220" preserveAspectRatio="none">
        {/* Grid / Roads */}
        <path d="M 0 100 Q 200 80 400 120" stroke="#334155" strokeWidth="12" fill="none" />
        <path d="M 120 0 Q 150 110 180 220" stroke="#334155" strokeWidth="16" fill="none" />
        <path d="M 0 180 L 400 180" stroke="#1e293b" strokeWidth="8" fill="none" />
        <path d="M 280 0 L 280 220" stroke="#1e293b" strokeWidth="8" fill="none" />

        {/* Dynamic Route Line */}
        <path 
          d={`M ${endX} ${endY} Q 220 80 ${startX} ${startY}`} 
          stroke="#3b82f6" 
          strokeWidth="6" 
          strokeDasharray="8 4" 
          fill="none" 
        />
      </svg>

      {/* Customer Location Marker */}
      <div 
        className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ left: `${(startX / 400) * 100}%`, top: `${(startY / 220) * 100}%` }}
      >
        <div className="w-8 h-8 rounded-full bg-rose-600 border-2 border-white text-white flex items-center justify-center shadow-lg font-black text-xs">
          <MapPin className="w-4 h-4" />
        </div>
        <span className="px-2 py-0.5 rounded bg-gray-900/90 text-white text-[10px] font-bold mt-1 shadow-md">
          Your Location
        </span>
      </div>

      {/* Worker Live Moving Marker */}
      <div 
        className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-linear"
        style={{ left: `${(currentX / 400) * 100}%`, top: `${(currentY / 220) * 100}%` }}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-xl font-bold animate-bounce">
            <Navigation className="w-5 h-5 fill-white rotate-45" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-ping"></span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-blue-900/90 border border-blue-400 text-white text-[10px] font-black mt-1 shadow-lg flex items-center gap-1">
          {workerName}
        </span>
      </div>

      {/* Top Banner Status Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-30 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">Live GPS Dispatch</span>
            <p className="text-xs font-black">{workerLocationText || "Passing Ring Road Flyover"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">ETA</span>
            <span className="text-sm font-black text-emerald-400">{etaMinutes} mins</span>
          </div>
          <div className="pl-3 border-l border-slate-700 hidden sm:block">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Distance</span>
            <span className="text-xs font-bold text-slate-200">{distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Overlay */}
      {onCallWorker && (
        <div className="absolute bottom-3 right-3 z-30">
          <button 
            onClick={onCallWorker}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Phone className="w-4 h-4" /> Call {workerName}
          </button>
        </div>
      )}
    </div>
  );
}
