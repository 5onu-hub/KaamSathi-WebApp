import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, ShieldCheck, MapPin, Calendar, Clock, CheckCircle2, ArrowLeft, Phone, 
  Award, Sparkles, MessageSquare, Share2, Bookmark, AlertTriangle, Check, 
  ChevronRight, ExternalLink, ZoomIn, X, ThumbsUp, FileText, Wrench, 
  UserCheck, DollarSign, Briefcase, Zap, Shield, Globe, Navigation, Heart
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { NewBookingModal } from "../components/services/NewBookingModal";
import { SEOHead } from "../components/common/SEOHead";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  beforeImage?: string;
  description: string;
}

interface Certificate {
  id: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  status: string;
  image: string;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  reply?: {
    date: string;
    text: string;
  };
}

interface WorkerProfile {
  id: string;
  name: string;
  primarySkill: string;
  category: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  repeatCustomers: string;
  completionRate: string;
  experienceYears: number;
  hourlyRate: number;
  dailyRate: number;
  inspectionCharge: number;
  emergencyCharge: number;
  weekendCharge: number;
  holidayCharge: number;
  city: string;
  serviceRadius: string;
  nearbyAreas: string[];
  phone: string;
  email: string;
  verified: boolean;
  backgroundVerified: boolean;
  policeVerification: boolean;
  onlineStatus: boolean;
  memberSince: string;
  responseTime: string;
  languages: string[];
  avatar: string;
  coverImage: string;
  bio: string;
  professionalSummary: string;
  specialization: string[];
  serviceAreasText: string;
  secondarySkills: string[];
  experienceLevel: string;
  skillTags: string[];
  portfolio: PortfolioItem[];
  experienceTimeline: { company: string; project: string; duration: string; role: string }[];
  certificates: Certificate[];
  reviews: Review[];
  similarWorkers: { id: string; name: string; skill: string; rating: number; avatar: string; rate: string; city: string }[];
}

const mockWorkersDatabase: Record<string, WorkerProfile> = {
  "w1": {
    id: "w1",
    name: "Ramesh Kumar",
    primarySkill: "Master Electrician & Wiring Specialist",
    category: "Electrician",
    rating: 4.9,
    reviewsCount: 142,
    completedJobs: 480,
    repeatCustomers: "94%",
    completionRate: "99.2%",
    experienceYears: 8,
    hourlyRate: 350,
    dailyRate: 2200,
    inspectionCharge: 150,
    emergencyCharge: 250,
    weekendCharge: 100,
    holidayCharge: 200,
    city: "South Delhi, Delhi NCR",
    serviceRadius: "15 km",
    nearbyAreas: ["Greater Kailash", "Lajpat Nagar", "Hauz Khas", "Saket", "Vasant Vihar"],
    phone: "+91 98765 43210",
    email: "ramesh.electrician@kaamsathi.in",
    verified: true,
    backgroundVerified: true,
    policeVerification: true,
    onlineStatus: true,
    memberSince: "January 2021",
    responseTime: "15 Mins",
    languages: ["Hindi", "English", "Punjabi"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    coverImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200",
    bio: "Certified electrical contractor with over 8 years of hands-on experience in residential rewiring, heavy load MCB panel installation, smart home automation, and 24/7 emergency breakdown repairs.",
    professionalSummary: "Ramesh has successfully handled 480+ residential and commercial electrical projects across Delhi NCR. Known for strict adherence to ISI safety standards, prompt 15-minute dispatch times, and clean workmanship.",
    specialization: ["Heavy Load MCB Panels", "Inverter & Stabilizer Setup", "Smart Home LED Lighting", "Fault Diagnosis & Rewiring"],
    serviceAreasText: "South Delhi, Central Delhi, Gurgaon Phase 1-4, Noida Sector 15-62",
    secondarySkills: ["Inverter Wiring", "Earthing Testing", "AC Power Point Installation", "Generator Maintenance"],
    experienceLevel: "Senior Master Expert",
    skillTags: ["ISI Certified", "IEC Compliant", "Safety First", "Fast Diagnosis"],
    portfolio: [
      {
        id: "p1",
        title: "3-Phase Commercial MCB Panel Upgrade",
        category: "Commercial Wiring",
        date: "May 2025",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
        beforeImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
        description: "Complete upgrade of legacy fuse box to modern 3-phase modular MCB distribution board with surge protection for a 4-storey commercial office."
      },
      {
        id: "p2",
        title: "Smart Villa Lighting & Automation",
        category: "Residential Automation",
        date: "March 2025",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        description: "Concealed wiring and automated RGB ceiling lighting integration for luxury duplex villa in Greater Kailash."
      }
    ],
    experienceTimeline: [
      { company: "Delhi Metro Rail Corp (Contractor)", project: "Station Substation Maintenance", duration: "2022 - 2024", role: "Lead Senior Electrician" },
      { company: "Urban Services Pvt Ltd", project: "Residential Electrical Audits", duration: "2019 - 2022", role: "Master Technician" }
    ],
    certificates: [
      { id: "c1", name: "Certified Electrical Wireman Grade-A", issuedBy: "Govt of NCT Delhi Power Department", issueDate: "Jan 2018", status: "Verified & Active", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600" },
      { id: "c2", name: "Advanced Industrial Safety & OSHA", issuedBy: "National Safety Council India", issueDate: "Aug 2020", status: "Verified & Active", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600" }
    ],
    reviews: [
      {
        id: "r1",
        author: "Vikram Malhotra",
        rating: 5,
        date: "3 days ago",
        comment: "Ramesh arrived within 15 minutes of emergency call late at night when our main MCB tripped and started smoking. Extremely professional, solved the short circuit safely, and charged fair standard rates.",
        verified: true,
        helpfulCount: 24,
        reply: {
          date: "2 days ago",
          text: "Thank you Vikram ji! Safety is always our primary concern."
        }
      },
      {
        id: "r2",
        author: "Pooja Sharma",
        rating: 5,
        date: "2 weeks ago",
        comment: "Got my entire 3BHK apartment re-wired by Ramesh. Very neat concealed work, no wall damage, and completed right on schedule.",
        verified: true,
        helpfulCount: 16
      }
    ],
    similarWorkers: [
      { id: "w2", name: "Suresh Sharma", skill: "Senior Electrician", rating: 4.8, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", rate: "₹320/hr", city: "Connaught Place" },
      { id: "w3", name: "Vijay Singh", skill: "Wiring Specialist", rating: 4.7, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", rate: "₹300/hr", city: "Noida" }
    ]
  }
};

export function WorkerDetails() {
  const { id, workerId } = useParams<{ id?: string; workerId?: string }>();
  const activeWorkerKey = workerId || id || "w1";
  const navigate = useNavigate();

  // Load worker data or fallback to default
  const worker = mockWorkersDatabase[activeWorkerKey] || {
    ...mockWorkersDatabase["w1"],
    id: activeWorkerKey,
    name: "Suresh Sharma",
    primarySkill: "Senior Master Technician & Repair Expert",
    category: "Home Maintenance",
    rating: 4.8,
    reviewsCount: 98,
    completedJobs: 340,
    hourlyRate: 300,
    dailyRate: 2000,
  };

  // States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);
  
  // Pricing Calculator State
  const [calcHours, setCalcHours] = useState<number>(3);
  const [includeEmergency, setIncludeEmergency] = useState(false);
  const [includeWeekend, setIncludeWeekend] = useState(false);

  // Reviews sorting
  const [reviewSort, setReviewSort] = useState<"newest" | "highest" | "lowest">("newest");

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved workers" : "Worker saved to your favorites!");
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard!");
    setIsSharedModalOpen(false);
  };

  const calculatedEstimate = (calcHours * worker.hourlyRate) + 
    worker.inspectionCharge + 
    (includeEmergency ? worker.emergencyCharge : 0) + 
    (includeWeekend ? worker.weekendCharge : 0);

  return (
    <div className="min-h-screen bg-gray-50/70 pb-24 font-sans selection:bg-blue-600 selection:text-white">
      <Toaster position="top-right" />
      
      {/* SEO Head */}
      <SEOHead 
        title={`${worker.name} - ${worker.category} | KaamSathi`}
        description={worker.bio}
        keywords={[worker.category.toLowerCase(), worker.name.toLowerCase(), "verified worker", "kaamsathi"]}
        ogImage={worker.avatar}
      />

      {/* 1. Navbar / Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/workers" className="hover:text-blue-600">Workers</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-bold">{worker.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* 2. Cover Banner & Profile Header */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48 sm:h-64 bg-blue-950 overflow-hidden">
            <img 
              src={worker.coverImage} 
              alt="Cover Banner" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleSaveToggle}
                className={`p-2.5 rounded-xl backdrop-blur-md border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSaved 
                    ? "bg-rose-500 text-white border-rose-400 shadow-md" 
                    : "bg-black/40 text-white border-white/20 hover:bg-black/60"
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
                <span className="hidden sm:inline">{isSaved ? "Saved" : "Save Worker"}</span>
              </button>

              <button
                onClick={() => setIsSharedModalOpen(true)}
                className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all text-xs font-bold flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              {/* Avatar + Main Identity */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="relative">
                  <img 
                    src={worker.avatar} 
                    alt={worker.name} 
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                  />
                  {worker.onlineStatus && (
                    <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-3 border-white rounded-full shadow-md" title="Online Now"></span>
                  )}
                </div>

                <div className="space-y-1.5 pb-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{worker.name}</h1>
                    {worker.verified && (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Aadhaar Verified
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-blue-600">{worker.primarySkill}</p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-500 pt-0.5">
                    <span className="flex items-center gap-1 font-bold text-gray-800">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" /> {worker.city}
                    </span>
                    <span>•</span>
                    <span>Member since {worker.memberSince}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">⚡ Response: {worker.responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Primary CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`tel:${worker.phone}`}
                  className="px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-2xs transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-600" /> Call Now
                </a>

                <button
                  onClick={() => navigate(`/messages/conv-${worker.id}`)}
                  className="px-5 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 shadow-2xs transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" /> Live Chat
                </button>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Now (₹{worker.hourlyRate}/hr)
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-8 pt-8 border-t border-gray-100 text-center">
              <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Rating</span>
                <span className="text-base font-black text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {worker.rating}
                </span>
              </div>
              <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Reviews</span>
                <span className="text-base font-black text-gray-900 mt-0.5 block">{worker.reviewsCount}+</span>
              </div>
              <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Jobs Done</span>
                <span className="text-base font-black text-blue-900 mt-0.5 block">{worker.completedJobs}+</span>
              </div>
              <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Experience</span>
                <span className="text-base font-black text-gray-900 mt-0.5 block">{worker.experienceYears} Years</span>
              </div>
              <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Repeat Clients</span>
                <span className="text-base font-black text-emerald-700 mt-0.5 block">{worker.repeatCustomers}</span>
              </div>
              <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Completion Rate</span>
                <span className="text-base font-black text-blue-700 mt-0.5 block">{worker.completionRate}</span>
              </div>
              <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Languages</span>
                <span className="text-xs font-black text-gray-800 mt-1 block truncate">{worker.languages.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: About, Skills, Portfolio, Experience, Certificates, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Worker */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
              <h2 className="text-xl font-black text-gray-900">About {worker.name}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
              
              <div className="pt-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Professional Summary</h3>
                <p className="text-xs text-gray-600 leading-relaxed bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  {worker.professionalSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Specializations</h3>
                  <div className="space-y-1.5">
                    {worker.specialization.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Service Areas</h3>
                  <p className="text-xs text-gray-600">{worker.serviceAreasText}</p>
                </div>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">Skills & Expertise</h2>
                <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                  {worker.experienceLevel}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Primary Skill Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.skillTags.map((tag, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Secondary Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.secondarySkills.map((skill, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Gallery */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                    Verified Work
                  </span>
                  <h2 className="text-xl font-black text-gray-900 mt-2">Portfolio & Project Gallery</h2>
                </div>
                <span className="text-xs text-gray-400 font-medium">{worker.portfolio.length} Projects Showcase</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {worker.portfolio.map((proj) => (
                  <div key={proj.id} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden space-y-3 group">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img 
                        src={proj.image} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => setSelectedZoomImage(proj.image)}
                      />
                      <button 
                        onClick={() => setSelectedZoomImage(proj.image)}
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                        title="Zoom Image"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg">
                        {proj.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-sm">{proj.title}</h4>
                        <span className="text-[11px] text-gray-400">{proj.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{proj.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-black text-gray-900">Professional Experience Timeline</h2>

              <div className="space-y-6 relative border-l-2 border-blue-100 ml-3 pl-6">
                {worker.experienceTimeline.map((exp, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs"></span>
                    <span className="text-xs font-bold text-blue-600">{exp.duration}</span>
                    <h4 className="font-black text-gray-900 text-base">{exp.role}</h4>
                    <p className="text-xs font-semibold text-gray-700">{exp.company}</p>
                    <p className="text-xs text-gray-500">{exp.project}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates & Verification */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    Credentials
                  </span>
                  <h2 className="text-xl font-black text-gray-900 mt-2">Certificates & Licenses</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {worker.certificates.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4">
                    <img 
                      src={cert.image} 
                      alt={cert.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 cursor-pointer hover:opacity-90"
                      onClick={() => setSelectedZoomImage(cert.image)}
                    />
                    <div className="space-y-1 overflow-hidden">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {cert.status}
                      </span>
                      <h4 className="font-bold text-gray-900 text-xs truncate">{cert.name}</h4>
                      <p className="text-[11px] text-gray-500 truncate">{cert.issuedBy} • {cert.issueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Customer Ratings & Reviews</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Based on {worker.reviewsCount}+ completed jobs</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Sort:</span>
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>
              </div>

              <div className="space-y-5">
                {worker.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {rev.author[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs">{rev.author}</h4>
                          <span className="text-[10px] text-gray-400">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {rev.rating}.0
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                    {rev.reply && (
                      <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-100 space-y-1 ml-4 text-xs">
                        <div className="flex items-center justify-between font-bold text-blue-900">
                          <span>Response from {worker.name}</span>
                          <span className="text-[10px] text-blue-500">{rev.reply.date}</span>
                        </div>
                        <p className="text-gray-600">{rev.reply.text}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Booking
                      </span>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({rev.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pricing Calculator, Availability, Safety & Similar Workers */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Interactive Pricing Calculator */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" /> Rate Card & Estimate
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  0% Commission
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Standard Hourly Rate:</span>
                  <span className="font-black text-gray-900">₹{worker.hourlyRate} / hr</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Standard Daily Wage:</span>
                  <span className="font-black text-gray-900">₹{worker.dailyRate} / day</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Inspection / Visit Fee:</span>
                  <span className="font-black text-gray-900">₹{worker.inspectionCharge}</span>
                </div>

                {/* Calculator Controls */}
                <div className="space-y-3 pt-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="font-bold text-gray-700 block">
                    Estimated Work Duration ({calcHours} Hours):
                  </label>
                  <input 
                    type="range" 
                    min={1} 
                    max={10} 
                    value={calcHours} 
                    onChange={(e) => setCalcHours(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 font-medium text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeEmergency} 
                        onChange={(e) => setIncludeEmergency(e.target.checked)} 
                        className="rounded text-blue-600 accent-blue-600"
                      />
                      <span>Emergency Dispatch (+₹{worker.emergencyCharge})</span>
                    </label>

                    <label className="flex items-center gap-2 font-medium text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeWeekend} 
                        onChange={(e) => setIncludeWeekend(e.target.checked)} 
                        className="rounded text-blue-600 accent-blue-600"
                      />
                      <span>Weekend Booking (+₹{worker.weekendCharge})</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-gray-900 text-sm">Estimated Total:</span>
                  <span className="font-black text-blue-900 text-lg">₹{calculatedEstimate}</span>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all text-xs"
                >
                  Book at This Estimate
                </button>
              </div>
            </div>

            {/* Availability & Working Hours */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> Availability & Hours
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Today's Status:</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Available Today
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Emergency Dispatch:</span>
                  <span className="font-bold text-blue-600">Active (30-Mins)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Working Hours:</span>
                  <span className="font-bold text-gray-900">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Vacation Mode:</span>
                  <span className="font-bold text-emerald-600">OFF (Ready to Work)</span>
                </div>
              </div>
            </div>

            {/* Google Maps Location & Service Radius */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                <Navigation className="w-5 h-5 text-orange-500" /> Service Location & Radius
              </h3>

              <div className="bg-gray-100 rounded-2xl h-40 relative overflow-hidden flex items-center justify-center border border-gray-200">
                <div className="absolute inset-0 bg-blue-50/50 flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <MapPin className="w-8 h-8 text-orange-500 animate-bounce" />
                  <span className="font-bold text-gray-900 text-xs">{worker.city}</span>
                  <span className="text-[11px] text-gray-500">Service Radius: {worker.serviceRadius}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-gray-700 block">Nearby Covered Areas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {worker.nearbyAreas.map((area, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium text-[11px]">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety & Verification Checklist */}
            <div className="bg-gradient-to-r from-blue-900 to-gray-900 text-white rounded-3xl p-6 space-y-4 shadow-lg border border-blue-800">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Safety & Verification
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>100% Aadhaar Identity Verified</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Police Background Check Cleared</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Certified Skills & Trade License</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Zero Advance Cash Protection</span>
                </div>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors border border-white/20"
              >
                Report Profile / Issue
              </button>
            </div>

            {/* Similar Workers */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-black text-gray-900 text-base">Similar Workers Nearby</h3>

              <div className="space-y-3">
                {worker.similarWorkers.map((sim) => (
                  <div 
                    key={sim.id}
                    onClick={() => navigate(`/worker/${sim.id}`)}
                    className="p-3 rounded-2xl bg-gray-50 hover:bg-blue-50/50 border border-gray-200/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={sim.avatar} alt={sim.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">{sim.name}</h4>
                        <p className="text-[11px] text-blue-600">{sim.skill}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700 text-xs block">{sim.rate}</span>
                      <span className="text-[10px] text-amber-500 font-bold">★ {sim.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Image Zoom Modal */}
      {selectedZoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setSelectedZoomImage(null)}
              className="absolute -top-12 right-0 p-2 text-white bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedZoomImage} alt="Zoomed View" className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isSharedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-gray-900 text-lg">Share Worker Profile</h3>
            <p className="text-xs text-gray-500">Share {worker.name}'s verified KaamSathi profile with family or friends.</p>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleShareCopy}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Copy Link
              </button>
              <button 
                onClick={() => setIsSharedModalOpen(false)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-base">Report Worker Profile</h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <label className="font-bold text-gray-700 block">Select Reason for Report</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs">
                <option>Incorrect contact information</option>
                <option>Unprofessional behavior or misconduct</option>
                <option>Fake credentials or documents</option>
                <option>Other issue</option>
              </select>
              <textarea 
                rows={3} 
                placeholder="Please describe the issue in detail..." 
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <button 
                onClick={() => {
                  toast.success("Report submitted successfully. Our safety team will review within 24 hours.");
                  setIsReportModalOpen(false);
                }}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      <NewBookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        serviceTitle={worker.primarySkill}
        workerName={worker.name}
        startingPrice={`₹${worker.hourlyRate}/hr`}
      />
    </div>
  );
}
