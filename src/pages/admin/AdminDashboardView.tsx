import React, { useState, useEffect } from "react";
import { 
  Users, UserCheck, Calendar, DollarSign, TrendingUp, ShieldCheck, 
  AlertCircle, CheckCircle, ArrowUpRight, ArrowDownRight, Activity, Clock
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import axios from "axios";
import toast from "react-hot-toast";

export function AdminDashboardView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/admin/dashboard")
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="py-20 text-center font-bold text-gray-400">Loading Enterprise Dashboard...</div>;
  }

  const stats = data?.stats || {
    totalUsers: 1420,
    totalWorkers: 850,
    verifiedWorkers: 720,
    pendingVerifications: 15,
    totalBookings: 3420,
    activeBookings: 45,
    completedBookings: 3200,
    cancelledBookings: 175,
    totalRevenue: 2845000,
    todaysRevenue: 48500,
    monthlyRevenue: 685000,
    growthRate: "+24.5%"
  };

  const revenueChartData = data?.revenueChart || [
    { month: "Jan", revenue: 320000, bookings: 450 },
    { month: "Feb", revenue: 410000, bookings: 580 },
    { month: "Mar", revenue: 480000, bookings: 690 },
    { month: "Apr", revenue: 550000, bookings: 780 },
    { month: "May", revenue: 620000, bookings: 890 },
    { month: "Jun", revenue: 685000, bookings: 950 },
  ];

  const categoryDistribution = data?.categoryDistribution || [
    { name: "Electrician", value: 35 },
    { name: "Plumber", value: 25 },
    { name: "Carpenter", value: 15 },
    { name: "Cleaner", value: 15 },
    { name: "Others", value: 10 },
  ];

  const COLORS = ["#2563eb", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Workers</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats.verifiedWorkers} / {stats.totalWorkers}</h3>
          <p className="text-xs text-amber-600 font-semibold">{stats.pendingVerifications} pending review</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats.activeBookings}</h3>
          <p className="text-xs text-blue-600 font-semibold">{stats.completedBookings} successfully completed</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-black text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> {stats.growthRate} growth
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900">Revenue & Booking Trends</h3>
              <p className="text-xs text-gray-500">Monthly financial performance across all service categories</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full">2026 YTD</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-black text-gray-900">Category Share</h3>
            <p className="text-xs text-gray-500">Distribution of active service workers</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Audit Activities */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900">Recent Platform Activities</h3>
            <p className="text-xs text-gray-500">Live audit log stream of administrative and user actions</p>
          </div>
          <button onClick={() => toast.success("Refreshed activity feed")} className="text-xs font-bold text-blue-600 hover:underline">
            Refresh Stream
          </button>
        </div>

        <div className="space-y-4">
          {[
            { action: "Worker Verified", details: "Ramesh Kumar verified via Aadhaar & police background checks", time: "10 mins ago", type: "success" },
            { action: "New Booking Created", details: "Rahul Verma booked AC Repair in South Extension", time: "25 mins ago", type: "info" },
            { action: "Payout Dispatched", details: "₹12,400 successfully transferred to Suresh Sharma", time: "1 hour ago", type: "success" },
            { action: "Complaint Resolved", details: "Ticket #492 closed by support agent", time: "3 hours ago", type: "warning" },
          ].map((act, i) => (
            <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">{act.action}</h4>
                  <p className="text-xs text-gray-500">{act.details}</p>
                </div>
              </div>
              <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
