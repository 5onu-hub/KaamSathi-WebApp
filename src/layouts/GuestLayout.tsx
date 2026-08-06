import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Wrench, Sparkles, Menu, X, LogIn, UserPlus, Shield, Phone, Mail, MapPin } from "lucide-react";

export function GuestLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Guest Marketing Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 to-indigo-900 bg-clip-text text-transparent">
                Kaam<span className="text-orange-500">Sathi</span>
              </span>
              <span className="block text-[10px] font-medium tracking-widest text-gray-400 uppercase -mt-1">
                Digital Labour Marketplace
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/services" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Services</Link>
            <Link to="/workers" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Find Workers</Link>
            <Link to="/search" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Search & Maps</Link>
            <Link to="/ai" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI Saathi
            </Link>
            <Link to="/role-selection" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors font-bold">
              Become a Worker
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={() => navigate("/sign-in")}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4 text-gray-500" /> Sign In
            </button>
            <button 
              onClick={() => navigate("/sign-up")}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-6 space-y-4 shadow-xl">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Home</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Services</Link>
            <Link to="/workers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Find Workers</Link>
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Search & Maps</Link>
            <Link to="/ai" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-blue-600">AI Saathi</Link>
            <Link to="/role-selection" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-orange-600 font-bold">Become a Worker</Link>
            <div className="pt-4 flex gap-3 border-t border-gray-100">
              <button onClick={() => { setMobileMenuOpen(false); navigate("/sign-in"); }} className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold">Sign In</button>
              <button onClick={() => { setMobileMenuOpen(false); navigate("/sign-up"); }} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold">Sign Up</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Marketing Landing Page Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="text-xl font-black">Kaam<span className="text-orange-500">Sathi</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                India's premier verified digital labour marketplace connecting households with skilled daily wage professionals with 0% worker commission.
              </p>
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-400" /> +91 1800-KAAM-SATHI</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Company & About</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link to="/services" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Our Mission</Link></li>
                <li><Link to="/workers" className="hover:text-white transition-colors">Verified Professionals</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Legal & Privacy</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link to="/services" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Zero Commission Policy</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">FAQ & Help Center</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Get the App</h4>
              <p className="text-xs text-slate-400">Download KaamSathi for Android & iOS to book services on the go.</p>
              <div className="flex gap-2 pt-1">
                <span className="px-3 py-2 bg-slate-800 rounded-xl text-[11px] font-bold border border-slate-700 cursor-pointer hover:bg-slate-700">Google Play</span>
                <span className="px-3 py-2 bg-slate-800 rounded-xl text-[11px] font-bold border border-slate-700 cursor-pointer hover:bg-slate-700">App Store</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© {new Date().getFullYear()} KaamSathi Technologies India Pvt Ltd. All rights reserved.</p>
            <p>Guest Marketing & Public Portal • Secure & Verified</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
