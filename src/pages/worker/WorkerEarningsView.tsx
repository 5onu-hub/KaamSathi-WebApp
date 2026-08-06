import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Calendar, DollarSign, Award, ArrowUpRight, CheckCircle2, 
  Briefcase, Percent, ShieldCheck, Download, ChevronRight 
} from "lucide-react";
import axios from "axios";

export function WorkerEarningsView() {
  const [stats, setStats] = useState<any>({
    todaysEarnings: 1250,
    weeklyEarnings: 8450,
    monthlyEarnings: 32400,
    lifetimeEarnings: 184500,
    completedJobsCount: 142,
    avgJobFare: 1300
  });

  const [jobsHistory, setJobsHistory] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/v1/payments/history?userId=w1&role=worker")
      .then(res => { if (res.data.success) setJobsHistory(res.data.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Partner Earnings & Analytics</h2>
          <p className="text-xs text-gray-500">Track daily payouts, weekly trends, platform commission, and job revenue</p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Guaranteed 90% Partner Payout Share
        </div>
      </div>

      {/* 4 Earnings Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 block uppercase">Today's Income</span>
          <h3 className="text-2xl font-black text-gray-900">₹{stats.todaysEarnings?.toLocaleString()}</h3>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            +18% vs yesterday
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 block uppercase">This Week</span>
          <h3 className="text-2xl font-black text-gray-900">₹{stats.weeklyEarnings?.toLocaleString()}</h3>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            8 Jobs Completed
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 block uppercase">This Month</span>
          <h3 className="text-2xl font-black text-gray-900">₹{stats.monthlyEarnings?.toLocaleString()}</h3>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            Top 5% Partner
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-md space-y-2">
          <span className="text-xs font-bold text-emerald-100 block uppercase">Lifetime Total</span>
          <h3 className="text-2xl font-black text-white">₹{stats.lifetimeEarnings?.toLocaleString()}</h3>
          <span className="text-[10px] text-emerald-200 font-bold block">
            {stats.completedJobsCount} Total Jobs
          </span>
        </div>
      </div>

      {/* Weekly Breakdown Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-black text-gray-900 text-base">Job Earnings & Commission Breakdown</h3>
            <p className="text-xs text-gray-500">Details of recent completed jobs, gross fare, 10% platform fee, and net credit</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-2">Job ID / Customer</th>
                <th className="py-3 px-2">Service</th>
                <th className="py-3 px-2 text-right">Gross Fare</th>
                <th className="py-3 px-2 text-right">Platform Fee (10%)</th>
                <th className="py-3 px-2 text-right">Net Worker Share</th>
                <th className="py-3 px-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {jobsHistory.map((job, idx) => (
                <tr key={job._id || idx} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-2">
                    <span className="font-bold text-gray-900 block">{job.customerName || "Rahul Verma"}</span>
                    <span className="text-[10px] text-gray-400 font-mono">#{job.bookingId || "BKG_101"}</span>
                  </td>
                  <td className="py-3.5 px-2 font-bold text-gray-800">{job.serviceCategory || "Electrician"}</td>
                  <td className="py-3.5 px-2 text-right font-bold text-gray-900">₹{job.amount || 450}</td>
                  <td className="py-3.5 px-2 text-right text-rose-600 font-semibold">-₹{job.commission || 45}</td>
                  <td className="py-3.5 px-2 text-right font-black text-emerald-600 text-sm">₹{job.workerEarnings || 405}</td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                      Credited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
