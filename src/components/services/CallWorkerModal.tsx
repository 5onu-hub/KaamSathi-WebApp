import React from "react";
import { X, Phone, ShieldCheck, Clock, CheckCircle2, Star } from "lucide-react";

interface CallWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    skill: string;
    rating: number;
    city: string;
  };
}

export function CallWorkerModal({ isOpen, onClose, worker }: CallWorkerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-gray-100 text-center relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative w-20 h-20 mx-auto">
          <img 
            src={worker.avatar} 
            alt={worker.name} 
            className="w-20 h-20 rounded-full object-cover border-4 border-emerald-100 shadow-md mx-auto"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-gray-900 text-lg">{worker.name}</h3>
          <p className="text-xs font-semibold text-blue-600">{worker.skill}</p>
          <p className="text-[11px] text-gray-500">{worker.city} &bull; <span className="text-amber-600 font-bold">⭐ {worker.rating}</span></p>
        </div>

        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs space-y-1">
          <div className="font-bold flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Aadhaar Verified Partner
          </div>
          <div className="text-[11px] text-emerald-700">Direct phone call. Zero agent intermediation.</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center font-mono font-bold text-gray-900 text-lg tracking-wider">
          {worker.phone || "+91 98765 43210"}
        </div>

        <div className="space-y-2">
          <a
            href={`tel:${worker.phone || "+919876543210"}`}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>Call Now Directly</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
