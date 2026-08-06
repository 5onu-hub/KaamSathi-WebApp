import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShieldCheck, MapPin, Search, Filter, ArrowRight } from "lucide-react";
import { WORKER_CATEGORIES, CITIES_LIST } from "../constants";

export function Workers() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  const mockWorkers = [
    {
      id: "w1",
      name: "Ramesh Kumar",
      category: "electrician",
      categoryName: "Electrician",
      rating: 4.8,
      reviewsCount: 124,
      hourlyRate: 250,
      location: "South Delhi, Delhi",
      experienceYears: 8,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      bio: "Expert residential & commercial wiring, inverter repair, and appliance installation."
    },
    {
      id: "w2",
      name: "Suresh Sharma",
      category: "plumber",
      categoryName: "Plumber",
      rating: 4.9,
      reviewsCount: 98,
      hourlyRate: 300,
      location: "Connaught Place, Delhi",
      experienceYears: 10,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      bio: "Specialized in pipe leakage fixing, bathroom fittings, water tank cleaning, and geyser installation."
    },
    {
      id: "w3",
      name: "Amit Verma",
      category: "carpenter",
      categoryName: "Carpenter",
      rating: 4.7,
      reviewsCount: 76,
      hourlyRate: 350,
      location: "Noida Sector 62, UP",
      experienceYears: 6,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
      bio: "Custom modular furniture design, door/window repairs, bed and wardrobe assembly."
    },
    {
      id: "w4",
      name: "Pooja Devi",
      category: "helper",
      categoryName: "House Helper",
      rating: 4.9,
      reviewsCount: 210,
      hourlyRate: 200,
      location: "Gurugram Phase 4, Haryana",
      experienceYears: 5,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      bio: "Deep home cleaning, dusting, kitchen sanitization, and laundry assistance."
    }
  ];

  const filteredWorkers = mockWorkers.filter(w => {
    if (selectedCategory && w.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Find Skilled Workers</h1>
            <p className="text-sm text-gray-500">Browse verified daily wage professionals in your area</p>
          </div>
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 shadow-xs focus:outline-hidden"
            >
              <option value="">All Categories</option>
              {WORKER_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 shadow-xs focus:outline-hidden"
            >
              <option value="">All Locations</option>
              {CITIES_LIST.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredWorkers.map(worker => (
            <div 
              key={worker.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={worker.avatar} 
                      alt={worker.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-100 shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mt-0.5">
                        {worker.categoryName}
                      </span>
                      <p className="text-xs text-orange-600 font-semibold flex items-center gap-1 mt-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-gray-900">₹{worker.hourlyRate}</span>
                    <span className="block text-xs text-gray-400 font-medium">per hour</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{worker.bio}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" /> {worker.location}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" /> {worker.rating} ({worker.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => navigate(`/workers/${worker.id}`)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => navigate(`/workers/${worker.id}`)}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-colors flex items-center justify-center gap-1"
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
