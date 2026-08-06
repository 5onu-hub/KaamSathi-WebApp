import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Search, MapPin, Users, Calendar, Navigation, Star, 
  UserPlus, ShieldCheck, Wrench, BellRing, Briefcase, 
  DollarSign, ArrowRight, Sparkles, CheckCircle2 
} from "lucide-react";

export interface JourneyStep {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const CUSTOMER_STEPS: JourneyStep[] = [
  {
    step: "01",
    title: "Search Service",
    desc: "Choose a category like Plumber, Electrician, Carpenter, Painter, Cleaner, etc.",
    icon: <Search className="w-6 h-6 text-blue-600" />
  },
  {
    step: "02",
    title: "Select Location",
    desc: "Choose your city or allow location access to find experts nearby.",
    icon: <MapPin className="w-6 h-6 text-blue-600" />
  },
  {
    step: "03",
    title: "Compare Verified Workers",
    desc: "View profiles, Aadhaar badges, ratings, experience, pricing, and reviews.",
    icon: <Users className="w-6 h-6 text-blue-600" />
  },
  {
    step: "04",
    title: "Book Instantly",
    desc: "Select convenient date and time with zero upfront platform commission.",
    icon: <Calendar className="w-6 h-6 text-blue-600" />
  },
  {
    step: "05",
    title: "Worker Arrives",
    desc: "Track arrival status in real-time via OpenStreetMap integration.",
    icon: <Navigation className="w-6 h-6 text-blue-600" />
  },
  {
    step: "06",
    title: "Pay & Review",
    desc: "Complete direct payment and leave a review to reward skilled labor.",
    icon: <Star className="w-6 h-6 text-blue-600 fill-current" />
  }
];

const WORKER_STEPS: JourneyStep[] = [
  {
    step: "01",
    title: "Register Account",
    desc: "Create a free worker account in under 2 minutes with your mobile number.",
    icon: <UserPlus className="w-6 h-6 text-orange-600" />
  },
  {
    step: "02",
    title: "Verify Identity",
    desc: "Upload Aadhaar and required verification documents for lifetime trust.",
    icon: <ShieldCheck className="w-6 h-6 text-orange-600" />
  },
  {
    step: "03",
    title: "Add Skills & Pricing",
    desc: "Select services, hourly/daily pricing, spoken languages, and experience.",
    icon: <Wrench className="w-6 h-6 text-orange-600" />
  },
  {
    step: "04",
    title: "Receive Job Requests",
    desc: "Nearby customers can send direct booking requests and messages.",
    icon: <BellRing className="w-6 h-6 text-orange-600" />
  },
  {
    step: "05",
    title: "Complete Work",
    desc: "Finish the assigned household or commercial job professionally.",
    icon: <Briefcase className="w-6 h-6 text-orange-600" />
  },
  {
    step: "06",
    title: "Get Paid 100%",
    desc: "Receive secure payments directly. We take 0% commission from your earnings.",
    icon: <DollarSign className="w-6 h-6 text-orange-600" />
  }
];

export function HowKaamSathiWorksSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"both" | "customer" | "worker">("both");

  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 fill-orange-500" />
            Seamless Onboarding Flow
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
            How KaamSathi Works
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            From finding a trusted worker to completing the job in just a few simple steps. Designed transparently for both households and professionals.
          </p>

          {/* Interactive Toggle for Mobile & Tablet */}
          <div className="pt-4 flex justify-center lg:hidden">
            <div className="inline-flex bg-gray-200/80 p-1 rounded-2xl shadow-inner">
              <button
                onClick={() => setActiveTab("customer")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'customer' || activeTab === 'both' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700'}`}
              >
                Customer Journey
              </button>
              <button
                onClick={() => setActiveTab("worker")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'worker' || activeTab === 'both' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-700'}`}
              >
                Worker Journey
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Desktop / Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* ================= COLUMN 1: CUSTOMER JOURNEY ================= */}
          {(activeTab === 'both' || activeTab === 'customer') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl shadow-blue-500/5 space-y-8 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Header Badge */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black shadow-xs">
                    🏠
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-950">Customer Journey</h3>
                    <p className="text-xs text-blue-600 font-bold">For Homeowners & Businesses</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold rounded-full text-xs">
                  6 Steps
                </span>
              </div>

              {/* Steps List */}
              <div className="space-y-4 relative">
                {CUSTOMER_STEPS.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/80 hover:bg-blue-50/50 border border-gray-100 hover:border-blue-200 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-xs text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Card CTA */}
              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => navigate("/workers")}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-xs hover:scale-[1.01]"
                >
                  <span>Find a Verified Worker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}

          {/* ================= COLUMN 2: WORKER JOURNEY ================= */}
          {(activeTab === 'both' || activeTab === 'worker') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-xl shadow-orange-500/5 space-y-8 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Header Badge */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black shadow-xs">
                    👷
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-950">Worker Journey</h3>
                    <p className="text-xs text-orange-600 font-bold">For Daily Wage & Skilled Earners</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-50 text-orange-700 font-extrabold rounded-full text-xs">
                  6 Steps
                </span>
              </div>

              {/* Steps List */}
              <div className="space-y-4 relative">
                {WORKER_STEPS.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/80 hover:bg-orange-50/50 border border-gray-100 hover:border-orange-200 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                          {item.title}
                        </h4>
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-xs text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Card CTA */}
              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => navigate("/workers")}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-xs hover:scale-[1.01]"
                >
                  <span>Become a Verified Worker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}

        </div>

        {/* Global Bottom CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button 
            onClick={() => navigate("/workers")}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm hover:scale-105"
          >
            <span>🔵 Find a Worker</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => navigate("/workers")}
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-sm hover:scale-105"
          >
            <span>🟠 Become a Worker</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

export default HowKaamSathiWorksSection;
