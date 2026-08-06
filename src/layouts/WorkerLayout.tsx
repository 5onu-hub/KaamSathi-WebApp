import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Wrench, Sparkles, Menu, X, Bell, LogOut, LayoutDashboard, 
  Briefcase, FileText, MessageSquare, Wallet, ShieldCheck, 
  User as UserIcon, Settings, Activity, CheckCircle2, Trophy, Navigation, HelpCircle
} from "lucide-react";
import { useRBAC } from "../components/rbac/RBACComponents";

export function WorkerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useRBAC();

  const sidebarLinks = [
    { label: "Dashboard", path: "/worker/dashboard", icon: LayoutDashboard },
    { label: "Job Requests", path: "/worker/jobs", icon: Briefcase },
    { label: "Active Jobs & Bookings", path: "/worker/jobs", icon: FileText },
    { label: "Messages", path: "/worker/messages", icon: MessageSquare },
    { label: "Earnings & Payouts", path: "/worker/earnings", icon: Wallet },
    { label: "Wallet", path: "/worker/wallet", icon: Wallet },
    { label: "Gamification & Rewards", path: "/worker/gamification", icon: Trophy },
    { label: "📍 Live GPS Tracking", path: "/worker/tracking", icon: Navigation },
    { label: "AI Saathi Support", path: "/ai", icon: Sparkles },
    { label: "Support & Help Desk", path: "/worker/support", icon: HelpCircle },
    { label: "Profile & Verification", path: "/worker/profile", icon: ShieldCheck },
    { label: "Notifications", path: "/worker/notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Worker Portal Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/worker/dashboard" className="flex items-center gap-2 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                Kaam<span className="text-orange-500">Sathi</span>
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-orange-400 uppercase -mt-1">
                Worker Pro Portal (0% Commission)
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {/* Online / Offline Status Toggle */}
            <div 
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border cursor-pointer transition-all ${
                isOnline 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
              <span className="text-xs font-bold">{isOnline ? 'Available for Jobs' : 'Offline'}</span>
            </div>

            <Link to="/ai" className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700">
              <Sparkles className="w-4 h-4 text-orange-400" /> AI Saathi
            </Link>

            <Link to="/worker/notifications" className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 relative border border-slate-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-slate-900"></span>
            </Link>

            <div 
              onClick={() => navigate("/worker/profile")}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800 rounded-2xl border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                W
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-white block">Skilled Worker</span>
                <span className="text-orange-400 font-medium">Verified Pro</span>
              </div>
            </div>

            <button 
              onClick={logout}
              className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors border border-rose-500/30"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-200 hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Worker Dashboard
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold">PRO</span>
            </div>
            <nav className="space-y-1.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                      active 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Portal</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-80 bg-slate-900 h-full p-6 space-y-6 overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-sm font-black text-white">Worker Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-slate-800 text-white"><X className="w-5 h-5" /></button>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-orange-500/20 hover:text-orange-400"
                    >
                      <Icon className="w-4 h-4 text-orange-400" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <button 
              onClick={() => { setMobileMenuOpen(false); logout(); }}
              className="w-full py-3 bg-rose-500/10 text-rose-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/30"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-around shadow-lg">
        <Link to="/worker/dashboard" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('dashboard') ? 'text-orange-400 font-bold' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/worker/jobs" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('jobs') ? 'text-orange-400 font-bold' : 'text-slate-400'}`}>
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px]">Jobs</span>
        </Link>
        <Link to="/worker/messages" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('messages') ? 'text-orange-400 font-bold' : 'text-slate-400'}`}>
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Chats</span>
        </Link>
        <Link to="/worker/earnings" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('earnings') ? 'text-orange-400 font-bold' : 'text-slate-400'}`}>
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Earnings</span>
        </Link>
        <Link to="/worker/profile" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('profile') ? 'text-orange-400 font-bold' : 'text-slate-400'}`}>
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>

      {/* Worker Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <p>© {new Date().getFullYear()} KaamSathi Worker Pro Portal. 0% Commission Guarantee.</p>
          <div className="flex gap-6">
            <Link to="/ai" className="hover:text-white">Worker Support</Link>
            <Link to="/services" className="hover:text-white">Safety Guidelines</Link>
            <Link to="/services" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
