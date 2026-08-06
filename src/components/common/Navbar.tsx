import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, ShieldCheck, User as UserIcon, Menu, X, Bell, LogIn, UserPlus, LogOut, LayoutDashboard, Sparkles } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const isMockAuth = localStorage.getItem("kaamsathi_mock_auth") === "true";
  const role = localStorage.getItem("kaamsathi_role") || "customer";

  const handleLogout = () => {
    localStorage.removeItem("kaamsathi_mock_auth");
    localStorage.removeItem("kaamsathi_role");
    localStorage.removeItem("kaamsathi_profile_completed");
    navigate("/");
    window.location.reload();
  };

  const getDashboardLink = () => {
    if (role === "worker") return "/worker-dashboard";
    if (role === "admin") return "/admin-dashboard";
    return "/customer-dashboard";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Kaam<span className="text-orange-500">Sathi</span>
            </span>
            <span className="block text-[10px] font-medium tracking-widest text-gray-400 uppercase -mt-1">
              Digital Labour Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/services" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Services
          </Link>
          <Link to="/workers" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Find Workers
          </Link>
          <Link to="/search" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1.5 font-bold">
            Search & Maps
          </Link>
          <Link to="/ai" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> AI Saathi
          </Link>
          {(user || isMockAuth) && (
            <Link to={getDashboardLink()} className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
        </nav>

        {/* Auth / Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {(user || isMockAuth) ? (
            <div className="flex items-center gap-3">
              <Link to="/customer-dashboard" className="p-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500"></span>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {user?.firstName?.[0] || "U"}
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-gray-800 block">{user?.firstName || "User"}</span>
                  <span className="text-blue-600 capitalize font-medium">{role}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/sign-in")}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-xs flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-gray-500" /> Sign In
              </button>
              <button 
                onClick={() => navigate("/sign-up")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-[1.02] flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Home
          </Link>
          <Link 
            to="/workers" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Services & Workers
          </Link>
          {(user || isMockAuth) ? (
            <>
              <Link 
                to={getDashboardLink()} 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-base font-medium text-blue-600 bg-blue-50"
              >
                Dashboard ({role})
              </Link>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full py-3 rounded-xl bg-rose-50 text-rose-600 font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button 
                onClick={() => { setMobileMenuOpen(false); navigate("/sign-in"); }}
                className="w-full py-3 rounded-xl border border-gray-200 font-semibold text-gray-700"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); navigate("/sign-up"); }}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
