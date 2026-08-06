import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, UserCheck, Calendar, Grid, CreditCard, DollarSign,
  AlertCircle, Bell, BarChart3, FileText, Bot, Settings, ShieldCheck, 
  LogOut, Menu, X, Search, ChevronRight, Shield, ShieldAlert
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(true); // Demo admin toggle or session check

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Workers", path: "/admin/workers", icon: UserCheck },
    { label: "Verifications", path: "/admin/verifications", icon: ShieldCheck },
    { label: "Bookings", path: "/admin/bookings", icon: Calendar },
    { label: "Categories", path: "/admin/categories", icon: Grid },
    { label: "Payments", path: "/admin/payments", icon: CreditCard },
    { label: "Finance & Commission", path: "/admin/finance", icon: DollarSign },
    { label: "Complaints", path: "/admin/complaints", icon: AlertCircle },
    { label: "Notifications", path: "/admin/notifications", icon: Bell },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { label: "Reports", path: "/admin/reports", icon: FileText },
    { label: "AI Insights", path: "/admin/ai-insights", icon: Bot },
    { label: "Audit Logs", path: "/admin/audit-logs", icon: Shield },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">Admin Access Restricted</h2>
            <p className="text-xs text-gray-400">You must be logged in with Administrator privileges to access KaamSathi Enterprise Command Center.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-xs font-bold transition-all"
            >
              Return Home
            </button>
            <button 
              onClick={() => { setIsAdminAuth(true); toast.success("Simulated Admin Session Authorized!"); }}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold transition-all shadow-lg"
            >
              Authorize Demo Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-900">
      <Toaster position="top-right" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950/50">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30">
            KS
          </div>
          <div>
            <h1 className="font-black text-base tracking-tight">KaamSathi</h1>
            <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">Enterprise Admin</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <button 
            onClick={() => { setIsAdminAuth(false); toast.success("Logged out from admin panel"); navigate("/"); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative w-72 bg-slate-900 text-white flex flex-col h-full z-10 shadow-2xl">
            <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white">KS</div>
                <div>
                  <h1 className="font-black text-base">KaamSathi</h1>
                  <p className="text-[10px] text-blue-400 uppercase font-semibold">Enterprise Admin</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-20 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-black text-gray-900 capitalize">
                {location.pathname === "/admin" ? "Platform Command Dashboard" : location.pathname.split("/admin/")[1]?.replace("-", " ")}
              </h2>
              <p className="text-xs text-gray-500">Welcome back, Admin • Live system operational</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Global search users, workers, bookings..." className="bg-transparent text-xs w-64 focus:outline-hidden" />
            </div>
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                AD
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold text-gray-900 block">System SuperAdmin</span>
                <span className="text-emerald-600 font-semibold">● Active Secure</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
