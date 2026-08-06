import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, ShieldCheck, MapPin, Clock, Calendar, Phone, MessageSquare, 
  ArrowRight, Award, CheckCircle2, X, ZoomIn, Briefcase, Sparkles, 
  ChevronRight, ThumbsUp, DollarSign, UserCheck, Check
} from "lucide-react";
import toast from "react-hot-toast";

export interface WorkerDemo {
  id: string;
  name: string;
  primarySkill: string;
  experienceYears: number;
  hourlyRate: number;
  dailyRate: number;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  city: string;
  languages: string[];
  responseTime: string;
  availability: string;
  avatar: string;
  coverImage: string;
  bio: string;
  specialization: string[];
  certificates: { id: string; name: string; issuedBy: string; issueDate: string }[];
  reviews: { id: string; author: string; rating: number; comment: string; date: string }[];
  portfolio: { id: string; title: string; image: string }[];
  isAiRecommended?: boolean;
}

const FEATURED_WORKERS_DATA: WorkerDemo[] = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    primarySkill: "Master Electrician",
    experienceYears: 7,
    hourlyRate: 250,
    dailyRate: 1800,
    rating: 4.9,
    reviewsCount: 128,
    completedJobs: 340,
    city: "Lucknow",
    languages: ["Hindi", "English"],
    responseTime: "12 mins",
    availability: "Available Today",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    coverImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200",
    bio: "Certified electrical contractor with over 7 years of hands-on residential and commercial wiring experience across Lucknow.",
    specialization: ["Heavy Load MCB Panels", "Inverter Installation", "LED Lighting & Automation", "Fault Diagnosis"],
    certificates: [
      { id: "c1", name: "Certified Master Electrical Contractor", issuedBy: "National Electrical Board", issueDate: "2021" }
    ],
    reviews: [
      { id: "r1", author: "Alok Mishra", rating: 5, comment: "Fixed our heavy short circuit issue in under 30 minutes. Extremely polite and professional!", date: "2 days ago" }
    ],
    portfolio: [
      { id: "p1", title: "Commercial Panel Upgrade", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800" }
    ],
    isAiRecommended: true
  },
  {
    id: "w2",
    name: "Amit Sharma",
    primarySkill: "Expert Plumber",
    experienceYears: 5,
    hourlyRate: 220,
    dailyRate: 1600,
    rating: 4.8,
    reviewsCount: 96,
    completedJobs: 290,
    city: "Noida",
    languages: ["Hindi"],
    responseTime: "15 mins",
    availability: "Available Today",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200",
    bio: "Specialist in sanitary fittings, hidden pipeline leakage detection, and bathroom remodeling.",
    specialization: ["Pipeline Leakage", "Sanitary Fittings", "Water Pump Repair", "Bathroom Renovation"],
    certificates: [
      { id: "c2", name: "Advanced Plumbing Technician", issuedBy: "Skill Council India", issueDate: "2022" }
    ],
    reviews: [
      { id: "r2", author: "Neha Gupta", rating: 5, comment: "Very clean work and punctual arrival. Fixed our bathroom leakage permanently.", date: "1 week ago" }
    ],
    portfolio: [
      { id: "p2", title: "Luxury Bathroom Fitting", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800" }
    ],
    isAiRecommended: false
  },
  {
    id: "w3",
    name: "Sanjay Verma",
    primarySkill: "Carpenter & Woodwork",
    experienceYears: 10,
    hourlyRate: 300,
    dailyRate: 2200,
    rating: 4.9,
    reviewsCount: 210,
    completedJobs: 510,
    city: "Delhi",
    languages: ["Hindi", "Punjabi"],
    responseTime: "10 mins",
    availability: "Available Today",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
    bio: "Master carpenter specializing in modular kitchens, custom wardrobes, and antique wooden furniture restoration.",
    specialization: ["Modular Kitchens", "Custom Wardrobes", "Door & Window Fitting", "Furniture Repair"],
    certificates: [
      { id: "c3", name: "Master Woodworker Guild", issuedBy: "Craftsman Federation", issueDate: "2019" }
    ],
    reviews: [
      { id: "r3", author: "Rajiv Malhotra", rating: 5, comment: "Absolute perfection in modular wardrobe installation. Highly skilled!", date: "Yesterday" }
    ],
    portfolio: [
      { id: "p3", title: "Custom Walk-in Wardrobe", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" }
    ],
    isAiRecommended: false
  },
  {
    id: "w4",
    name: "Rahul Singh",
    primarySkill: "AC Repair & HVAC",
    experienceYears: 6,
    hourlyRate: 280,
    dailyRate: 2000,
    rating: 4.8,
    reviewsCount: 142,
    completedJobs: 380,
    city: "Patna",
    languages: ["Hindi", "English"],
    responseTime: "18 mins",
    availability: "Available Today",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    coverImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200",
    bio: "Expert AC servicing, gas charging, compressor repair, and central HVAC maintenance.",
    specialization: ["Split/Window AC Service", "Gas Filling", "PCB Repair", "Duct Cleaning"],
    certificates: [
      { id: "c4", name: "HVAC Certified Specialist", issuedBy: "Cooling Tech India", issueDate: "2023" }
    ],
    reviews: [
      { id: "r4", author: "Pooja Sinha", rating: 5, comment: "Quick response and very reasonable charges for AC gas filling.", date: "3 days ago" }
    ],
    portfolio: [
      { id: "p4", title: "Split AC Installation", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800" }
    ],
    isAiRecommended: false
  }
];

export function FeaturedWorkersSection() {
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState<WorkerDemo | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Verified Experts
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              👷 Top Verified Professionals Near You
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
              Hire trusted, Aadhaar verified professionals with transparent pricing and excellent ratings. Zero commission guaranteed.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-500 bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Aadhaar & Police Verified</span>
            </div>
            <button 
              onClick={() => navigate("/workers")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 text-xs hover:scale-105 active:scale-95"
            >
              <span>View All Verified Workers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trust Indicators Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-gray-800">Aadhaar Verified</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-2xl">
            <UserCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-gray-800">Police Verified</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-2xl">
            <Award className="w-5 h-5 text-orange-600 shrink-0" />
            <span className="text-xs font-bold text-gray-800">Background Checked</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-2xl">
            <Star className="w-5 h-5 text-amber-500 fill-current shrink-0" />
            <span className="text-xs font-bold text-gray-800">Top Rated 4.8+</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-2xl col-span-2 sm:col-span-1">
            <Clock className="w-5 h-5 text-cyan-600 shrink-0" />
            <span className="text-xs font-bold text-gray-800">Fast Response</span>
          </div>
        </div>

        {/* Workers Grid (Desktop: 4 cols, Tablet: 2 cols, Mobile: Swipe Carousel) */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-none">
          {FEATURED_WORKERS_DATA.map((worker) => (
            <motion.div 
              key={worker.id}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="w-[85vw] sm:w-[320px] lg:w-full shrink-0 snap-center bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-2xl transition-all duration-300 relative flex flex-col justify-between group overflow-hidden"
            >
              {/* Gradient border animation line on top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* AI Recommended Badge */}
              {worker.isAiRecommended && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="relative">
                    <button 
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black rounded-full shadow-md flex items-center gap-1 cursor-pointer animate-pulse"
                    >
                      <Sparkles className="w-3 h-3 fill-white" /> AI Recommended
                    </button>
                    {showTooltip && (
                      <div className="absolute right-0 top-8 w-48 p-2.5 bg-gray-900 text-white text-[10px] font-medium rounded-xl shadow-xl z-30">
                        "Best value based on rating, experience and price."
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Header Photo & Name */}
                <div className="flex items-center gap-3.5 pt-2">
                  <div className="relative">
                    <img 
                      src={worker.avatar} 
                      alt={worker.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-100 shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" title={worker.availability}></span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-gray-900 text-base">{worker.name}</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Aadhaar Verified" />
                    </div>
                    <p className="text-xs font-bold text-blue-600">{worker.primarySkill}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-500" /> {worker.city} • {worker.experienceYears} yrs exp
                    </p>
                  </div>
                </div>

                {/* Rating & Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                  <div>
                    <div className="text-gray-400 font-semibold">Rating</div>
                    <div className="font-extrabold text-amber-600 flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" /> {worker.rating} <span className="text-[10px] text-gray-400">({worker.reviewsCount})</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold">Jobs Done</div>
                    <div className="font-extrabold text-gray-900 mt-0.5">{worker.completedJobs}+ jobs</div>
                  </div>
                </div>

                {/* Pricing & Response */}
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Hourly Rate:</span>
                    <span className="text-emerald-700 font-black text-sm">₹{worker.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Daily Rate:</span>
                    <span className="text-gray-800 font-bold">₹{worker.dailyRate}/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Response Time:</span>
                    <span className="text-blue-600 font-bold">&lt; {worker.responseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Languages:</span>
                    <span className="text-gray-700 font-semibold">{worker.languages.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      toast.success(`Calling ${worker.name}...`);
                    }}
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Call Worker"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigate(`/messages/${worker.id}`)}
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Chat with Worker"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setSelectedWorker(worker)}
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Profile
                  </button>
                </div>

                <button 
                  onClick={() => navigate(`/workers/${worker.id}`)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
                >
                  Book Now
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-4">
          <button 
            onClick={() => navigate("/workers")}
            className="px-8 py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl shadow-xl transition-all inline-flex items-center gap-2 text-sm hover:scale-105"
          >
            <span>View All Verified Workers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* WORKER PROFILE PREVIEW MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedWorker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedWorker(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Cover Header */}
              <div className="relative h-48 bg-gray-900">
                <img src={selectedWorker.coverImage} alt="" className="w-full h-full object-cover opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent"></div>
                <button 
                  onClick={() => setSelectedWorker(null)}
                  className="absolute top-4 right-4 p-2.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 flex items-center gap-4">
                  <img src={selectedWorker.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl" />
                  <div className="text-white space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black">{selectedWorker.name}</h3>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-blue-300">{selectedWorker.primarySkill} • {selectedWorker.city}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* About Bio */}
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">About Professional</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{selectedWorker.bio}</p>
                </div>

                {/* Specializations */}
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorker.specialization.map((spec, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience & Certificates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                    <div className="text-xs font-bold text-gray-400 uppercase">Experience Level</div>
                    <div className="text-base font-black text-gray-900">{selectedWorker.experienceYears} Years Verified Experience</div>
                    <div className="text-xs text-emerald-600 font-semibold">{selectedWorker.completedJobs}+ successful jobs completed</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                    <div className="text-xs font-bold text-gray-400 uppercase">Pricing Rates</div>
                    <div className="text-base font-black text-emerald-700">₹{selectedWorker.hourlyRate}/hr <span className="text-xs font-normal text-gray-500">or ₹{selectedWorker.dailyRate}/day</span></div>
                    <div className="text-xs text-blue-600 font-semibold">0% platform commission fee</div>
                  </div>
                </div>

                {/* Certificates */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Verified Certificates</h4>
                  {selectedWorker.certificates.map(cert => (
                    <div key={cert.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{cert.name}</div>
                        <div className="text-gray-500">Issued by {cert.issuedBy} ({cert.issueDate})</div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">Verified</span>
                    </div>
                  ))}
                </div>

                {/* Portfolio Showcase */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Work Portfolio</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedWorker.portfolio.map(item => (
                      <div key={item.id} className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                        <img src={item.image} alt={item.title} className="w-full h-36 object-cover" />
                        <div className="p-3 text-xs font-bold text-gray-900">{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Reviews */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Customer Reviews</h4>
                  {selectedWorker.reviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{rev.author}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" /> {rev.rating}.0 • <span className="text-gray-400">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-4 border-t border-gray-200 flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedWorker(null)}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      navigate(`/workers/${selectedWorker.id}`);
                    }}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
export default FeaturedWorkersSection;
