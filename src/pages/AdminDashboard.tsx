import React from "react";
import { Users, ShieldCheck, Wrench, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Admin Control Center</h1>
            <p className="text-sm text-gray-500">Monitor marketplace activity, verify workers, and oversee disputes</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold w-fit">
            Super Admin Access
          </span>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</span>
            <h3 className="text-3xl font-black text-gray-900">14,280</h3>
            <p className="text-xs text-emerald-600 font-semibold">+320 this week</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verified Workers</span>
            <h3 className="text-3xl font-black text-gray-900">5,120</h3>
            <p className="text-xs text-blue-600 font-semibold">98.2% verification rate</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Bookings</span>
            <h3 className="text-3xl font-black text-gray-900">342</h3>
            <p className="text-xs text-orange-600 font-semibold">Live across 10 cities</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total GMV</span>
            <h3 className="text-3xl font-black text-gray-900">₹48.2L</h3>
            <p className="text-xs text-emerald-600 font-semibold">+22% MoM growth</p>
          </div>
        </div>

        {/* Pending Worker Verifications */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Pending Worker Verifications (Aadhaar & Police Check)</h3>
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900">Manoj Singh</span>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                  Painter
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  Pending Verification
                </span>
              </div>
              <p className="text-xs text-gray-500">Aadhaar No: XXXX-XXXX-4820 • Experience: 7 Years • Location: Jaipur</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                Reject
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-md hover:bg-emerald-700">
                Verify & Approve Worker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
