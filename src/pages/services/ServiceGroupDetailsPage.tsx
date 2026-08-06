import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Wrench, Zap, Hammer, Paintbrush, Home, Sparkles, Building2, Trees, 
  Truck, Flame, Wind, Tv, Car, UserCheck, Users, Search, ChevronRight, 
  Star, ShieldCheck, ArrowRight, ArrowLeft, Filter, CheckCircle2, Clock
} from "lucide-react";
import { getServiceGroup, getAllServiceGroups } from "../../data/servicesMasterData";
import { SEOHead } from "../../components/common/SEOHead";

const iconMap: Record<string, React.ElementType> = {
  Wrench, Zap, Hammer, Paintbrush, Home, Sparkles, Building2, Trees, Truck, Flame, Wind, Tv, Car, UserCheck, Users
};

export function ServiceGroupDetailsPage() {
  const { groupSlug } = useParams<{ groupSlug: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const group = getServiceGroup(groupSlug || "");

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4 border border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl font-black">
            404
          </div>
          <h2 className="text-xl font-black text-gray-900">Service Category Not Found</h2>
          <p className="text-xs text-gray-500">
            We couldn't find any category matching "{groupSlug}". Please browse all available categories.
          </p>
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Services
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[group.icon] || Home;

  const filteredServices = group.services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20 font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic SEO Head */}
      <SEOHead 
        title={group.seoTitle}
        description={group.seoDescription}
        keywords={group.keywords}
        ogImage={group.bannerImage}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-gray-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-blue-200/90 tracking-wide">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-orange-400 font-bold">{group.name}</span>
          </nav>

          {/* Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold border border-blue-700/50 backdrop-blur-md shadow-xs">
                <span className="text-base">{group.emoji}</span>
                <span>{group.services.length} Verified Sub-Services Available</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {group.name}
              </h1>

              <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed font-normal">
                {group.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold text-blue-200">
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Aadhaar Verified
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="w-4 h-4 text-orange-400" /> 30-Min Emergency Dispatch
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 Average Rating
                </span>
              </div>
            </div>

            {/* Quick Search inside Group */}
            <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 space-y-3">
              <label className="text-xs font-bold text-blue-100 uppercase tracking-widest block">
                Filter {group.name}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${group.name}...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 rounded-xl text-xs font-medium focus:outline-hidden border border-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              All {group.name} Services
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select a service below to view rate cards, verified workers, customer reviews, and instant booking.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-2xs">
            {filteredServices.length} Services
          </span>
        </div>

        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-md mx-auto space-y-3">
            <Search className="w-8 h-8 text-orange-500 mx-auto" />
            <h3 className="font-bold text-gray-900 text-base">No Matching Service</h3>
            <p className="text-xs text-gray-500">No service matched "{searchQuery}". Try a different keyword.</p>
            <button onClick={() => setSearchQuery("")} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/services/${group.slug}/${service.slug}`)}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-2xl hover:border-blue-400 transition-all cursor-pointer overflow-hidden group flex flex-col justify-between"
              >
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img 
                    src={service.bannerImage} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>

                  <span className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white text-xs font-black rounded-full shadow-md">
                    Starting {service.startPrice}
                  </span>

                  <div className="absolute bottom-3 left-4 right-4 text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black group-hover:text-orange-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-[11px] text-gray-200 font-medium">
                        {service.totalWorkers} Workers • {service.availableToday} Today
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{service.avgRating}</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-orange-500 transition-colors">
                    <span>View Rates & Book</span>
                    <span className="flex items-center gap-1">
                      Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
