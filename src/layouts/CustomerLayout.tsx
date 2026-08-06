import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Wrench, Sparkles, Menu, X, Bell, LogOut, LayoutDashboard, 
  FileText, Bookmark, MessageSquare, Wallet, User as UserIcon, 
  Search, MapPin, Settings, HelpCircle, ShieldCheck, Trophy, ShieldAlert, Navigation
} from "lucide-react";
import { useRBAC } from "../components/rbac/RBACComponents";

export function CustomerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useRBAC();

  const sidebarLinks = [
    { label: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
    { label: "Services Catalog", path: "/services", icon: Wrench },
    { label: "Find Workers", path: "/workers", icon: Search },
    { label: "Search & Maps", path: "/map", icon: MapPin },
    { label: "My Bookings", path: "/customer/bookings", icon: FileText },
    { label: "Saved Workers", path: "/customer/saved", icon: Bookmark },
    { label: "Messages", path: "/customer/messages", icon: MessageSquare },
    { label: "Wallet & Payments", path: "/customer/wallet", icon: Wallet },
    { label: "AI Recommendations", path: "/customer/recommendations", icon: Sparkles },
    { label: "Gamification & Loyalty", path: "/customer/gamification", icon: Trophy },
    { label: "🚨 Emergency SOS Hiring", path: "/customer/emergency", icon: ShieldAlert },
    { label: "📍 Live Worker Tracking", path: "/customer/tracking", icon: Navigation },
    { label: "AI Saathi", path: "/ai", icon: Sparkles },
    { label: "Support & Help Desk", path: "/customer/support", icon: HelpCircle },
    { label: "Profile", path: "/customer/profile", icon: UserIcon },
    { label: "Notifications", path: "/customer/notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Customer Portal Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/customer/dashboard" className="flex items-center gap-2 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 to-indigo-900 bg-clip-text text-transparent">
                Kaam<span className="text-orange-500">Sathi</span>
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-blue-600 uppercase -mt-1">
                Customer Portal
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/ai" className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI Saathi Assistant
            </Link>
            <Link to="/customer/notifications" className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-white"></span>
            </Link>
            <div 
              onClick={() => navigate("/customer/profile")}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-100 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                C
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-gray-800 block">Customer Account</span>
                <span className="text-emerald-600 font-medium">Verified Active</span>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="px-3 py-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Customer Navigation
              </span>
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
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Portal</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-80 bg-white h-full p-6 space-y-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-sm font-black text-gray-900">Customer Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <button 
              onClick={() => { setMobileMenuOpen(false); logout(); }}
              className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <Link to="/customer/dashboard" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('dashboard') ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/customer/bookings" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('bookings') ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">Bookings</span>
        </Link>
        <Link to="/customer/messages" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('messages') ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Messages</span>
        </Link>
        <Link to="/customer/wallet" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('wallet') ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Wallet</span>
        </Link>
        <Link to="/customer/profile" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.includes('profile') ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>

      {/* Customer Footer */}
      <footer className="bg-slate-900 text-white py-8 border-t border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} KaamSathi Customer Portal. Secured & Verified.</p>
          <div className="flex gap-6">
            <Link to="/services" className="hover:text-white">Help Center</Link>
            <Link to="/services" className="hover:text-white">Terms</Link>
            <Link to="/services" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
