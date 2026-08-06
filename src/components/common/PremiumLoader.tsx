import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, ShieldCheck, Sparkles, Navigation, User, Briefcase, Calendar, Home as HomeIcon } from "lucide-react";

const LOADING_MESSAGES = [
  "🔧 Finding trusted professionals...",
  "📍 Searching nearby workers...",
  "✅ Verifying worker profiles...",
  "🤖 AI Saathi is getting ready...",
  "⚡ Preparing your experience...",
  "🏠 Connecting households with workers..."
];

export function PremiumLoader({ destination = "general" }: { destination?: "home" | "workers" | "booking" | "profile" | "dashboard" | "general" }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [showContent, setShowContent] = useState(false);

  // 300ms delay before showing loader to prevent flash for fast loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 450);

    return () => {
      clearTimeout(timer);
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  if (!showContent) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50/80 to-indigo-100/90 backdrop-blur-md px-4 overflow-hidden">
      
      {/* Background Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-10 right-10 w-60 h-60 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-8">
        
        {/* Animated KaamSathi Logo */}
        <div className="relative flex items-center justify-center">
          {/* Outer Glowing Ring */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-400 to-orange-500 opacity-30 blur-xl"
          />

          {/* Main Logo Container */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xl border border-white/40"
          >
            <Wrench className="w-12 h-12 text-white drop-shadow-md" />
            <motion.div 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-[10px] font-black"
            >
              ★
            </motion.div>
          </motion.div>
        </div>

        {/* Brand Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-950 tracking-tight">KaamSathi</h2>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">India's Trusted Labour Marketplace</p>
        </div>

        {/* Rotating Message with Fade Animation */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="px-6 py-2.5 rounded-2xl bg-white/80 border border-blue-200/60 shadow-lg backdrop-blur-md text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2"
            >
              <span>{LOADING_MESSAGES[msgIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-600">
            <span>Loading Experience</span>
            <span className="text-blue-600 font-black">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-white/80 rounded-full p-0.5 border border-blue-200 shadow-inner overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Skeleton Preview Hint matching destination */}
        <div className="w-full pt-4 border-t border-blue-200/50">
          <div className="text-[11px] text-gray-500 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Preparing destination skeleton for {destination}...</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Destination-matched Skeletons for Suspense Fallbacks
export function PageSkeleton({ type = "home" }: { type?: "home" | "workers" | "booking" | "profile" | "dashboard" }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Navbar Skeleton */}
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
        <div className="w-36 h-8 bg-gray-200 rounded-xl"></div>
        <div className="hidden md:flex gap-6">
          <div className="w-20 h-4 bg-gray-200 rounded-lg"></div>
          <div className="w-20 h-4 bg-gray-200 rounded-lg"></div>
          <div className="w-20 h-4 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="w-28 h-10 bg-blue-100 rounded-xl"></div>
      </div>

      {type === "home" && (
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Skeleton */}
          <div className="h-[450px] bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-12 flex flex-col items-center justify-center space-y-6">
            <div className="w-3/4 h-12 bg-white/20 rounded-2xl"></div>
            <div className="w-1/2 h-6 bg-white/10 rounded-xl"></div>
            <div className="w-full max-w-2xl h-16 bg-white/20 rounded-3xl"></div>
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-44 bg-white rounded-3xl p-6 border border-gray-200 space-y-4">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                <div className="w-3/4 h-5 bg-gray-200 rounded-xl"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "workers" && (
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-16 bg-white rounded-2xl border border-gray-200"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-80 bg-white rounded-3xl p-6 border border-gray-200 space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="w-full h-5 bg-gray-200 rounded-xl"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
                <div className="h-24 bg-gray-100 rounded-2xl"></div>
                <div className="h-10 bg-blue-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "dashboard" && (
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-white rounded-3xl p-6 border border-gray-200 space-y-3">
                <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                <div className="w-1/2 h-6 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
          <div className="h-96 bg-white rounded-3xl p-6 border border-gray-200"></div>
        </div>
      )}
    </div>
  );
}
export default PremiumLoader;
