import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Star, ShieldCheck, ChevronLeft, ChevronRight, Play, 
  Sparkles, ArrowRight, CheckCircle2, Image as ImageIcon, Wrench 
} from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  service: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
  verifiedBooking: boolean;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "1",
    name: "Ayushi Sharma",
    city: "Noida",
    service: "Plumbing",
    rating: 5,
    date: "Yesterday",
    text: "The plumber arrived within 30 minutes, explained the issue clearly, and fixed everything perfectly. The transparent pricing and verified profile gave me complete confidence.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    verifiedBooking: true
  },
  {
    id: "2",
    name: "Rahul Verma",
    city: "Lucknow",
    service: "Electrical Repair",
    rating: 5,
    date: "2 days ago",
    text: "I booked an electrician late in the evening and was surprised by how quickly someone arrived. The booking process was smooth and professional.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    verifiedBooking: true
  },
  {
    id: "3",
    name: "Neha Gupta",
    city: "Delhi",
    service: "House Cleaning",
    rating: 5,
    date: "3 days ago",
    text: "The cleaner was punctual, polite, and did an amazing job. I will definitely use KaamSathi again for society deep cleaning.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    verifiedBooking: true
  },
  {
    id: "4",
    name: "Vikram Malhotra",
    city: "Gurugram",
    service: "AC Repair & Servicing",
    rating: 5,
    date: "4 days ago",
    text: "AC cooling was zero in peak summer. The technician diagnosed a gas leak instantly and refilled it at standard government-vetted rates.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    verifiedBooking: true
  },
  {
    id: "5",
    name: "Pooja Deshmukh",
    city: "Mumbai",
    service: "Carpentry & Furniture",
    rating: 5,
    date: "Last week",
    text: "Assembling a modular wardrobe seemed impossible alone. The carpenter was extremely skilled, brought professional tools, and finished in 2 hours.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    verifiedBooking: true
  }
];

const WORK_GALLERY = [
  { title: "Bathroom Pipe Repair", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80", category: "Plumbing" },
  { title: "Interior Wall Painting", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80", category: "Painting" },
  { title: "Deep Kitchen Sanitization", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80", category: "Cleaning" },
  { title: "Custom Woodwork & Carpentry", image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f8f3c?w=600&auto=format&fit=crop&q=80", category: "Carpentry" },
  { title: "MCB & Switchboard Wiring", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80", category: "Electrical" },
  { title: "Split AC Servicing", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80", category: "Appliance" }
];

export function TestimonialsSection() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Auto-slide every 5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-blue-50/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 fill-blue-600" />
            Customer Success Stories
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
            Loved by Thousands of Families Across India
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            See why homeowners trust KaamSathi for fast, reliable, and verified local services.
          </p>
        </div>

        {/* Testimonials Interactive Carousel / Grid */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Controls */}
          <div className="absolute -top-16 right-0 hidden sm:flex items-center gap-3">
            <button 
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 shadow-sm transition-all"
              title="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="p-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 shadow-sm transition-all"
              title="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Testimonial Cards Grid (3 cards desktop, 2 tablet, 1 mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((offset) => {
              const item = TESTIMONIALS_DATA[(currentIndex + offset) % TESTIMONIALS_DATA.length];
              const isActive = offset === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: offset * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`bg-white rounded-3xl p-8 border transition-all flex flex-col justify-between space-y-6 shadow-xl ${isActive ? 'border-blue-300 shadow-blue-500/10 ring-2 ring-blue-500/10' : 'border-gray-200 shadow-gray-200/50'}`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar & Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-100 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-black text-gray-900 text-base">{item.name}</h4>
                          <span className="text-xs font-bold text-gray-500">{item.city}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                        {item.service}
                      </span>
                    </div>

                    {/* Star Rating & Date */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 font-semibold">{item.date}</span>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                      "{item.text}"
                    </p>
                  </div>

                  {/* Verified Badge */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Booking
                    </span>
                    <span className="text-gray-400 font-semibold">KaamSathi User</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {TESTIMONIALS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${currentIndex === idx ? 'w-8 bg-blue-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIDEO REVIEW FEATURED STORY CARD */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-4 max-w-xl relative z-10">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/20 px-4 py-1.5 rounded-full border border-cyan-400/30">
              Featured Customer Story
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Watch How Amit Family in Delhi Secured Verified Household Help in Minutes
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              "We had an emergency plumbing pipeline burst during a family gathering. KaamSathi dispatched a certified plumber within 25 minutes. Incredible service!"
            </p>
            <div className="text-xs text-blue-300 font-semibold">
              — Amit & Sunita Sharma, Homeowners in South Delhi
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="group relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-blue-600/80 backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-105"
            >
              <div className="absolute inset-2 rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80" 
                  alt="Video thumbnail" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </button>
            <div className="text-center mt-3 text-xs font-bold text-cyan-300 tracking-wide">
              ▶ Watch Customer Story
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PHOTO GALLERY OF COMPLETED WORK */}
        {/* ========================================================= */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-4 py-1.5 rounded-full">
                Real Results
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight mt-2">
                Gallery of Completed Work Across India
              </h3>
            </div>
            <button 
              onClick={() => navigate("/workers")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 w-fit"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORK_GALLERY.map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6 }}
                className="group relative h-64 rounded-3xl overflow-hidden shadow-md border border-gray-200"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-white font-black text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-300 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified KaamSathi Execution
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM CALL TO ACTION */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl text-center space-y-6 max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            Need a trusted worker today?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            Join thousands of satisfied homeowners and daily wage workers on India's most transparent platform. Zero upfront commission.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button 
              onClick={() => navigate("/workers")}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm hover:scale-105"
            >
              <span>🔵 Find Workers</span>
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

      </div>

      {/* Video Modal Placeholder */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 text-white border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h4 className="font-black text-lg">KaamSathi Customer Success Story</h4>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80" 
                alt="Story video" 
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                referrerPolicy="no-referrer"
              />
              <div className="relative z-10 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl animate-pulse">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
              <p className="relative z-10 text-xs font-bold text-blue-200">
                Playing Customer Testimonial (Demo Stream)
              </p>
            </div>
            <p className="text-xs text-slate-400 text-center">
              Recorded in South Delhi residential area with verified electrician & plumber dispatch.
            </p>
          </div>
        </div>
      )}

    </section>
  );
}

export default TestimonialsSection;
