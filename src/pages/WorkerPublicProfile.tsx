import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, ShieldCheck, MapPin, Calendar, Clock, CheckCircle2, ArrowLeft, Phone, 
  Award, Sparkles, MessageSquare, Share2, Bookmark, Check, 
  ChevronRight, ZoomIn, X, ThumbsUp, FileText, Wrench, 
  UserCheck, DollarSign, Briefcase, Zap, Shield, Globe, Navigation, Heart
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { fetchWorkerProfile, WorkerProfileData } from "../services/workerProfileService";
import { NewBookingModal } from "../components/services/NewBookingModal";
import { SEOHead } from "../components/common/SEOHead";

export function WorkerPublicProfile() {
  const { workerId, id } = useParams<{ workerId?: string; id?: string }>();
  const activeId = workerId || id || "w1";
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [worker, setWorker] = useState<WorkerProfileData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "reviews" | "pricing">("overview");

  useEffect(() => {
    let isMounted = true;
    async function loadWorker() {
      setLoading(true);
      try {
        const data = await fetchWorkerProfile(activeId);
        if (isMounted) {
          setWorker(data);
        }
      } catch (err) {
        console.error("Failed to fetch worker profile:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadWorker();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-sm border border-stone-200 max-w-sm w-full mx-4"
        >
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-stone-800">Loading Professional Profile...</h3>
          <p className="text-sm text-stone-500 mt-1">Fetching verified worker details and credentials</p>
        </motion.div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-stone-200 max-w-md w-full mx-4">
          <Wrench className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-stone-800">Worker Profile Not Found</h2>
          <p className="text-stone-500 mt-2 text-sm">The professional you are looking for may have been removed or is currently unavailable.</p>
          <button 
            onClick={() => navigate("/workers")}
            className="mt-6 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition"
          >
            Browse All Professionals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      <SEOHead title={`${worker.name} - ${worker.primarySkill} | KaamSathi`} description={worker.bio} />
      <Toaster position="top-right" />

      {/* Top Navigation & Back Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setIsBookmarked(!isBookmarked);
                toast.success(isBookmarked ? "Removed from saved pros" : "Saved to your favorites!");
              }}
              className={`p-2.5 rounded-full border transition ${isBookmarked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
              title="Bookmark Profile"
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Profile link copied to clipboard!");
              }}
              className="p-2.5 bg-white border border-stone-200 rounded-full text-stone-600 hover:bg-stone-50 transition"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl text-sm shadow-sm hover:bg-emerald-700 transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Now
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* 1. Cover Banner & Profile Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm mb-8"
        >
          {/* Cover Image */}
          <div className="h-48 sm:h-64 relative bg-stone-800 overflow-hidden">
            <img 
              src={worker.coverImage} 
              alt="Cover Banner" 
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />
            
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-700 flex items-center gap-1.5 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${worker.onlineStatus ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
              {worker.onlineStatus ? 'Available Today' : 'Busy Now'}
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 sm:-mt-20 gap-6">
              
              {/* Avatar & Basic Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative">
                  <img 
                    src={worker.avatar} 
                    alt={worker.name} 
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-md bg-stone-100"
                  />
                  {worker.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-md border-2 border-white" title="Verified Professional">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 pt-2 sm:pt-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">{worker.name}</h1>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full">
                      {worker.category}
                    </span>
                  </div>

                  <p className="text-stone-600 font-medium text-sm sm:text-base">{worker.primarySkill}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-500 pt-1">
                    <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                      <Star className="w-4 h-4 fill-current" /> {worker.rating} ({worker.reviewsCount} verified reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-stone-400" /> {worker.city} ({worker.serviceRadius} radius)
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-stone-400" /> Member since {worker.memberSince}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Rate Card */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-right hidden lg:block mr-2">
                  <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Standard Rate</div>
                  <div className="text-2xl font-extrabold text-stone-900">₹{worker.hourlyRate}<span className="text-xs font-normal text-stone-500">/hr</span></div>
                </div>

                <a 
                  href={`tel:${worker.phone}`}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-medium text-sm transition flex items-center gap-2 border border-stone-200"
                >
                  <Phone className="w-4 h-4 text-stone-600" /> Call
                </a>

                <button 
                  onClick={() => navigate("/customer/messages")}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-medium text-sm transition flex items-center gap-2 border border-stone-200"
                >
                  <MessageSquare className="w-4 h-4 text-stone-600" /> Chat
                </button>

                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition shadow-sm flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Service Now
                </button>
              </div>

            </div>

            {/* Verification Badges Row */}
            <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-stone-600">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-800">Background Verified</div>
                  <div className="text-stone-500 text-[11px]">Identity checked</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-800">Police Clearance</div>
                  <div className="text-stone-500 text-[11px]">Valid certificate</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-800">Fast Response</div>
                  <div className="text-stone-500 text-[11px]">Under {worker.responseTime}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-800">0% Commission</div>
                  <div className="text-stone-500 text-[11px]">Direct fair pricing</div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 mb-8 gap-8 overflow-x-auto">
          {(["overview", "portfolio", "reviews", "pricing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold capitalize transition relative whitespace-nowrap ${activeTab === tab ? 'text-emerald-600' : 'text-stone-500 hover:text-stone-800'}`}
            >
              {tab === "overview" && "About & Specializations"}
              {tab === "portfolio" && `Past Work (${worker.portfolio.length})`}
              {tab === "reviews" && `Customer Reviews (${worker.reviews.length})`}
              {tab === "pricing" && "Service Rates & Charges"}
              {activeTab === tab && (
                <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left / Center Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                
                {/* Bio & Summary */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-stone-900">Professional Bio</h3>
                  <p className="text-stone-700 leading-relaxed text-sm sm:text-base">{worker.bio}</p>
                  
                  <div className="pt-4 border-t border-stone-100">
                    <h4 className="text-sm font-semibold text-stone-800 mb-2">Professional Summary</h4>
                    <p className="text-stone-600 text-sm leading-relaxed">{worker.professionalSummary}</p>
                  </div>
                </div>

                {/* Specializations & Skills */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-stone-900">Specializations & Core Skills</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {worker.specialization.map((spec, idx) => (
                      <span key={idx} className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/70 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {spec}
                      </span>
                    ))}
                    {worker.secondarySkills.map((skill, idx) => (
                      <span key={idx} className="px-3.5 py-1.5 bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience Timeline */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <h3 className="text-lg font-bold text-stone-900">Experience & Track Record</h3>
                  <div className="space-y-6 border-l-2 border-emerald-100 pl-4 sm:pl-6 ml-2">
                    {worker.experienceTimeline.map((exp, idx) => (
                      <div key={idx} className="relative space-y-1">
                        <div className="absolute -left-[23px] sm:-left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100" />
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{exp.duration}</span>
                        <h4 className="font-bold text-stone-900 text-base">{exp.role}</h4>
                        <div className="text-sm font-medium text-stone-700">{exp.company}</div>
                        <p className="text-xs text-stone-500">{exp.project}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates & Licenses */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-stone-900">Verified Certificates & Licensure</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {worker.certificates.map((cert) => (
                      <div key={cert.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/55 flex items-center gap-4">
                        <img src={cert.image} alt={cert.name} className="w-16 h-16 rounded-lg object-cover border border-stone-200" />
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{cert.name}</div>
                          <div className="text-xs text-stone-500">{cert.issuedBy} ({cert.issueDate})</div>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded">
                            {cert.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === "portfolio" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Past Project Portfolio</h3>
                    <p className="text-stone-500 text-sm">Visual showcase of completed assignments and quality standards.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {worker.portfolio.map((item) => (
                      <div 
                        key={item.id} 
                        className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 group cursor-pointer shadow-xs hover:shadow-md transition"
                        onClick={() => setSelectedImage(item.image)}
                      >
                        <div className="relative h-48 overflow-hidden bg-stone-200">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow">
                              <ZoomIn className="w-4 h-4" /> View Full Image
                            </span>
                          </div>
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-stone-900/70 backdrop-blur-md text-white text-xs font-medium rounded-md">
                            {item.category}
                          </span>
                        </div>
                        <div className="p-4 space-y-1.5">
                          <div className="text-xs text-emerald-600 font-semibold">{item.date}</div>
                          <h4 className="font-bold text-stone-900 text-base">{item.title}</h4>
                          <p className="text-xs text-stone-600 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">Customer Ratings & Reviews</h3>
                      <p className="text-stone-500 text-sm">Verified feedback from real KaamSathi bookings</p>
                    </div>
                    <div className="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-2xl border border-amber-200">
                      <div className="text-3xl font-extrabold text-amber-700">{worker.rating}</div>
                      <div className="text-xs text-amber-800">
                        <div className="flex items-center gap-0.5 text-amber-500 mb-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        Based on {worker.reviewsCount} reviews
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {worker.reviews.map((rev) => (
                      <div key={rev.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                              {(rev.author || rev.customerName || "U")[0]}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                                {rev.author || rev.customerName || "Verified Customer"}
                                {rev.verified && <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium">Verified Booking</span>}
                              </div>
                              <div className="text-xs text-stone-400">{rev.date || rev.createdAt || "Recent"}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-600" /> {rev.rating}.0
                          </div>
                        </div>

                        <p className="text-stone-700 text-sm leading-relaxed">{rev.comment}</p>

                        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200/60">
                          <button className="flex items-center gap-1 hover:text-emerald-700 transition font-medium">
                            <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({rev.helpfulCount})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PRICING TAB */}
            {activeTab === "pricing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Transparent Pricing & Fee Structure</h3>
                    <p className="text-stone-500 text-sm">KaamSathi guarantees 0% commission. You pay standard rates directly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Hourly Rate</div>
                      <div className="text-2xl font-extrabold text-stone-900">₹{worker.hourlyRate}<span className="text-sm font-normal text-stone-500"> / hour</span></div>
                      <p className="text-xs text-stone-600 pt-1">Standard repair & labor charge for first hour.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Full Day Rate</div>
                      <div className="text-2xl font-extrabold text-stone-900">₹{worker.dailyRate}<span className="text-sm font-normal text-stone-500"> / day</span></div>
                      <p className="text-xs text-stone-600 pt-1">Up to 8 hours comprehensive project work.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Inspection Charge</div>
                      <div className="text-xl font-bold text-stone-900">₹{worker.inspectionCharge}</div>
                      <p className="text-xs text-stone-600 pt-1">Waived if service is booked.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Emergency Callout</div>
                      <div className="text-xl font-bold text-stone-900">₹{worker.emergencyCharge}</div>
                      <p className="text-xs text-stone-600 pt-1">Immediate dispatch within 30 minutes.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Sidebar Widget: Booking Card & Similar Pros */}
          <div className="space-y-6">
            
            {/* Instant Booking Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm sticky top-24 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Instant Hire</div>
                  <div className="text-2xl font-extrabold text-stone-900">₹{worker.hourlyRate}<span className="text-xs font-normal text-stone-500">/hr</span></div>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                  0% Commission
                </div>
              </div>

              <div className="space-y-3 pt-2 text-sm text-stone-600">
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600" /> Response Time</span>
                  <span className="font-semibold text-stone-800">{worker.responseTime}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-emerald-600" /> Completed Jobs</span>
                  <span className="font-semibold text-stone-800">{worker.completedJobs}+</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <span className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-600" /> Repeat Rate</span>
                  <span className="font-semibold text-stone-800">{worker.repeatCustomers}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2"><Navigation className="w-4 h-4 text-emerald-600" /> Service Radius</span>
                  <span className="font-semibold text-stone-800">{worker.serviceRadius}</span>
                </div>
              </div>

              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book Appointment Now
              </button>

              <p className="text-[11px] text-stone-400 text-center">
                Free cancellation up to 2 hours before scheduled time. Secure payment via UPI/Card/Cash.
              </p>
            </motion.div>

            {/* SIMILAR WORKERS SECTION */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4"
            >
              <h3 className="text-base font-bold text-stone-900">Similar Verified Professionals</h3>
              <div className="space-y-3">
                {worker.similarWorkers.map((sim) => (
                  <div 
                    key={sim.id}
                    onClick={() => navigate(`/workers/${sim.id}`)}
                    className="p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-500 bg-stone-50/50 hover:bg-white transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={sim.avatar} alt={sim.name} className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
                      <div>
                        <div className="font-bold text-stone-900 text-sm group-hover:text-emerald-700 transition">{sim.name}</div>
                        <div className="text-xs text-stone-500">{sim.skill} • {sim.city}</div>
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                          <Star className="w-3 h-3 fill-current" /> {sim.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-stone-900">{sim.rate}</div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition ml-auto mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </div>

      </main>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
              <img src={selectedImage} alt="Fullscreen Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl bg-stone-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      {isBookingOpen && (
        <NewBookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          preselectedWorker={{
            id: worker.id,
            name: worker.name,
            category: worker.category,
            hourlyRate: worker.hourlyRate
          }}
        />
      )}

    </div>
  );
}
export default WorkerPublicProfile;
