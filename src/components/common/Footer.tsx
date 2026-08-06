import React from "react";
import { Link } from "react-router-dom";
import { Wrench, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Kaam<span className="text-orange-500">Sathi</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Connecting Workers. Creating Opportunities. Building Trust. India's trusted digital labour marketplace empowering daily wage workers with direct bookings and zero commission.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-blue-900/50 text-blue-400 text-xs font-semibold border border-blue-800">
                Aadhaar Verified
              </span>
              <span className="px-3 py-1 rounded-full bg-orange-900/50 text-orange-400 text-xs font-semibold border border-orange-800">
                Zero Commission
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/workers" className="hover:text-white transition-colors">Find Workers</Link></li>
              <li><Link to="/customer-dashboard" className="hover:text-white transition-colors">Customer Dashboard</Link></li>
              <li><Link to="/worker-dashboard" className="hover:text-white transition-colors">Worker Portal</Link></li>
              <li><Link to="/admin-dashboard" className="hover:text-white transition-colors">Admin Control</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300">Services</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/workers?category=electrician" className="hover:text-white transition-colors">Electricians</Link></li>
              <li><Link to="/workers?category=plumber" className="hover:text-white transition-colors">Plumbers</Link></li>
              <li><Link to="/workers?category=carpenter" className="hover:text-white transition-colors">Carpenters</Link></li>
              <li><Link to="/workers?category=painter" className="hover:text-white transition-colors">Painters & Masons</Link></li>
              <li><Link to="/workers?category=cleaning" className="hover:text-white transition-colors">Deep Cleaning</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/coming-soon" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/coming-soon" className="hover:text-white transition-colors">Safety Guidelines</Link></li>
              <li><Link to="/coming-soon" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/coming-soon" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} KaamSathi Technologies India Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> for India's skilled workforce.
          </p>
        </div>
      </div>
    </footer>
  );
}
