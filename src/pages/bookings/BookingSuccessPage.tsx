import React from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Compass, FileText, Home, Calendar, Clock, MapPin, User, ArrowRight } from "lucide-react";

export function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get("bookingId") || "KS-BK-9901";
  const workerName = searchParams.get("workerName") || "Ramesh Kumar";
  const serviceName = searchParams.get("serviceName") || "Standard Repair & Inspection";
  const date = searchParams.get("date") || "2026-08-07";
  const time = searchParams.get("time") || "10:00 AM";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 dark:border-slate-800 text-center space-y-8"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200 dark:border-emerald-900">
            Booking Confirmed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white">
            Professional Dispatched!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
            {workerName} has accepted your request and will arrive on time.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-gray-50 dark:bg-slate-800/60 p-5 rounded-2xl text-left space-y-3 border border-gray-200 dark:border-slate-700 text-xs">
          <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-slate-700">
            <span className="text-gray-400 font-bold">Booking ID</span>
            <span className="font-mono font-black text-blue-600 dark:text-blue-400">{bookingId}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-slate-700">
            <span className="text-gray-400 font-bold">Service</span>
            <span className="font-black text-gray-900 dark:text-white">{serviceName}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-slate-700">
            <span className="text-gray-400 font-bold">Professional</span>
            <span className="font-black text-gray-900 dark:text-white">{workerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-bold">Scheduled Arrival</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">{date} at {time}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button 
            onClick={() => navigate(`/booking/${bookingId}`)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Track Booking Live Telemetry</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => alert("Receipt downloaded successfully as PDF.")}
              className="py-3 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4" /> Download Receipt
            </button>
            <button 
              onClick={() => navigate("/")}
              className="py-3 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Home className="w-4 h-4" /> Go Home
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default BookingSuccessPage;
