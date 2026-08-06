import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Mic, MicOff, Sparkles, Navigation, Clock, ShieldCheck, 
  Star, Zap, Building2, Home as HomeIcon, ArrowRight, Filter, SlidersHorizontal, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { SEOHead } from "../../components/common/SEOHead";

export function SearchHome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isListening, setIsListening] = useState(false);
  const [savedLocations, setSavedLocations] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState({ address: "Connaught Place, New Delhi", lat: 28.6139, lng: 77.2090 });
  const [radius, setRadius] = useState(10);
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  useEffect(() => {
    fetchSavedLocations();
    fetchSearchHistory();
  }, []);

  const fetchSavedLocations = async () => {
    try {
      const res = await fetch("/api/v1/saved-locations");
      const data = await res.json();
      if (data.success) setSavedLocations(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const res = await fetch("/api/v1/search-history");
      const data = await res.json();
      if (data.success) setSearchHistory(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && !emergencyOnly) return;

    // Save search history
    try {
      await fetch("/api/v1/search-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, filters: { radius, emergencyOnly, location: selectedLocation } })
      });
    } catch (err) {}

    navigate(`/search/results?q=${encodeURIComponent(query)}&lat=${selectedLocation.lat}&lng=${selectedLocation.lng}&radius=${radius}&emergency=${emergencyOnly}`);
  };

  const handleVoiceSearch = () => {
    if (!isListening) {
      setIsListening(true);
      toast.success("Listening... Speak your service request (e.g., 'Find plumber near Noida under ₹500')");
      setTimeout(() => {
        setIsListening(false);
        setQuery("Plumber near Noida under ₹500");
        toast.success("Recognized: 'Plumber near Noida under ₹500'");
      }, 3500);
    } else {
      setIsListening(false);
    }
  };

  const trendingSearches = [
    "Emergency Electrician",
    "Leaky Pipe Plumber",
    "AC Service & Gas Filling",
    "Modular Kitchen Carpenter",
    "Deep Home Cleaning",
    "RO Water Purifier Repair"
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans selection:bg-blue-600 selection:text-white">
      <SEOHead 
        title="Advanced Search & Nearby Workers | KaamSathi"
        description="Discover verified nearby workers, track live distances, and book instant professional home services with KaamSathi maps."
      />

      {/* Hero Banner with Search */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> Location-Aware Worker Discovery & Google Maps
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Find Trusted Workers Nearby, Instantly</h1>
          <p className="text-sm sm:text-base text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Search by worker name, skill, category, pincode or locality. View live distances, travel times, and book verified professionals with zero upfront cash.
          </p>

          {/* Search Bar Box */}
          <form onSubmit={handleSearchSubmit} className="bg-white p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-3 border border-white/20 text-gray-900">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search electrician, plumber, carpenter, city, or pincode..."
                className="w-full bg-transparent text-sm font-semibold focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                title="Voice Search"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-700">
                <MapPin className="w-4 h-4 text-rose-500" />
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="bg-transparent focus:outline-hidden"
                >
                  <option value={1}>Within 1 km</option>
                  <option value={3}>Within 3 km</option>
                  <option value={5}>Within 5 km</option>
                  <option value={10}>Within 10 km</option>
                  <option value={20}>Within 20 km</option>
                  <option value={50}>Within 50 km</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 justify-center"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Emergency Quick Action & Map View Shortcut */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setEmergencyOnly(true);
                navigate(`/search/results?emergency=true&lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`);
              }}
              className="px-4 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-bold text-xs border border-orange-500/30 flex items-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Emergency Hiring (Arrival &lt; 30 mins)
            </button>

            <button
              onClick={() => navigate("/map")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-2 transition-all"
            >
              <Navigation className="w-4 h-4 text-emerald-400" /> Open Live Map Explorer
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        
        {/* Saved Locations Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Your Saved Locations
            </h3>
            <span className="text-xs text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => navigate("/customer/profile")}>
              Manage Addresses
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {savedLocations.map((loc, idx) => (
              <div 
                key={loc._id || idx}
                onClick={() => setSelectedLocation({ address: loc.address, lat: loc.coordinates.lat, lng: loc.coordinates.lng })}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  selectedLocation.address === loc.address 
                    ? 'bg-blue-50 border-blue-600 shadow-md' 
                    : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-white shadow-xs text-blue-600">
                  {loc.title === "Home" ? <HomeIcon className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">{loc.title}</h4>
                  <p className="text-[11px] text-gray-500 truncate max-w-[220px]">{loc.address}, {loc.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending & Recent Searches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/80 space-y-4">
            <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(item);
                    navigate(`/search/results?q=${encodeURIComponent(item)}&lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 font-bold text-xs border border-gray-200 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/80 space-y-4">
            <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Recent Search History
            </h3>
            <div className="space-y-2">
              {searchHistory.slice(0, 4).map((hist, idx) => (
                <div 
                  key={hist._id || idx}
                  onClick={() => {
                    setQuery(hist.query);
                    navigate(`/search/results?q=${encodeURIComponent(hist.query)}&lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`);
                  }}
                  className="p-3 rounded-xl bg-gray-50 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <span className="font-bold text-gray-800">{hist.query}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
