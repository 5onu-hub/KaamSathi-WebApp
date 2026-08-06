import React, { useState, useEffect } from "react";
import { X, Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  partnerAvatar: string;
  partnerPhone: string;
}

export function CallModal({ isOpen, onClose, partnerName, partnerAvatar, partnerPhone }: CallModalProps) {
  const [callState, setCallState] = useState<"calling" | "connected" | "ended">("calling");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCallState("calling");
      setDuration(0);
      return;
    }

    const timer = setTimeout(() => {
      setCallState("connected");
    }, 2500);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (callState === "connected") {
      interval = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setCallState("ended");
    setTimeout(onClose, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 text-white rounded-3xl max-w-sm w-full p-8 text-center space-y-8 shadow-2xl border border-gray-800"
      >
        {/* Contact Info */}
        <div className="space-y-3">
          <div className="relative inline-block">
            <img 
              src={partnerAvatar} 
              alt={partnerName} 
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-500/30 mx-auto" 
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-gray-900 flex items-center justify-center text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black">{partnerName}</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{partnerPhone}</p>
          </div>

          <div className="pt-2">
            {callState === "calling" && (
              <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold animate-pulse inline-block">
                Calling via Secure Masked Line...
              </span>
            )}
            {callState === "connected" && (
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono inline-block">
                Connected • {formatTime(duration)}
              </span>
            )}
            {callState === "ended" && (
              <span className="px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold inline-block">
                Call Ended
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 pt-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-colors ${
              isMuted ? "bg-rose-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button 
            onClick={handleEndCall}
            className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/30 hover:scale-105 transition-transform"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          <button className="p-4 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
