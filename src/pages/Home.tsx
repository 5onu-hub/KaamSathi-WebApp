import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Wrench, ShieldCheck, Star, Search, MapPin, ArrowRight, Zap, Hammer, 
  Paintbrush, Sparkles, Users, CheckCircle, Clock, DollarSign, Award, 
  ChevronDown, Smartphone, HelpCircle
} from "lucide-react";
import { WORKER_CATEGORIES, CITIES_LIST, MOCK_WORKERS, TESTIMONIALS, FAQS } from "../constants";

export function Home() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [searchCity, setSearchCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/workers?city=${searchCity}&q=${searchQuery}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white pt-12 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                Connecting Workers. Creating Opportunities. Building Trust.
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.12]">
                Find Trusted Skilled Workers Near You in <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Minutes.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                Hire verified plumbers, electricians, carpenters, painters, cleaners, drivers, and daily wage workers with transparent pricing and direct booking.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl shadow-xl border border-gray-200 flex flex-col sm:flex-row gap-3 max-w-2xl">
                <div className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                  <select 
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="bg-transparent text-sm font-medium text-gray-800 w-full focus:outline-hidden"
                  >
                    <option value="">Select City</option>
                    {CITIES_LIST.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Plumbers, Electricians, Carpenters..." 
                    className="bg-transparent text-sm font-medium text-gray-800 w-full focus:outline-hidden"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Find Worker <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Popular Category Shortcuts */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500 pt-1">
                <span>Popular:</span>
                <Link to="/services/electrical" className="px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Electrician</Link>
                <Link to="/services/plumbing" className="px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Plumber</Link>
                <Link to="/services/carpentry" className="px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Carpenter</Link>
                <Link to="/services/cleaning" className="px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Deep Cleaning</Link>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                <div>
                  <h4 className="text-2xl font-black text-gray-900">50K+</h4>
                  <p className="text-xs text-gray-500 font-medium">Workers</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900">25K+</h4>
                  <p className="text-xs text-gray-500 font-medium">Customers</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900">15+</h4>
                  <p className="text-xs text-gray-500 font-medium">Services</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900">0%</h4>
                  <p className="text-xs text-gray-500 font-medium">Worker Fee</p>
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl blur-2xl opacity-15"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
                        alt="Ramesh Kumar" 
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-200 shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">Ramesh Kumar</h4>
                        <p className="text-xs text-orange-600 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                      Available
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">Primary Skill</span>
                      <span className="font-bold text-gray-800">Master Electrician</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-bold text-gray-800">8 Years</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">Hourly Rate</span>
                      <span className="font-bold text-blue-600">₹250 / hour</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">Rating</span>
                      <span className="font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500" /> 4.9 (142 reviews)
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate("/workers/w1")}
                    className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    View Verified Profile <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Preview */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Categories
              </span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Skilled Service Categories</h2>
              <p className="text-xs sm:text-sm text-gray-600">Explore verified professionals for home maintenance, repairs, and daily labour.</p>
            </div>
            <Link 
              to="/services" 
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 w-fit"
            >
              Explore All Categories &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKER_CATEGORIES.slice(0, 8).map((cat) => (
              <div 
                key={cat.id}
                onClick={() => navigate(`/services/${cat.id}`)}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600">{cat.startPrice}</span>
                  <span className="text-xs font-semibold text-gray-400">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Services Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
                Services Preview
              </span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Top Verified Workers Available Now</h2>
              <p className="text-xs sm:text-sm text-gray-600">Book experienced workers directly with transparent pricing.</p>
            </div>
            <Link 
              to="/workers" 
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-2 w-fit"
            >
              View Full Worker Marketplace &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_WORKERS.slice(0, 4).map((worker) => (
              <div key={worker.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={worker.avatar} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-100" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{worker.name}</h4>
                      <span className="text-xs font-semibold text-blue-600">{worker.skill}</span>
                      <p className="text-xs text-orange-600 font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-bold text-gray-800">{worker.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hourly Rate:</span>
                      <span className="font-bold text-blue-600">₹{worker.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-bold text-gray-800">{worker.city}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex gap-2">
                  <button 
                    onClick={() => navigate(`/workers/${worker.id}`)}
                    className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => navigate(`/workers/${worker.id}`)}
                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
                  >
                    Book Worker
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Process
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">How KaamSathi Works</h2>
            <p className="text-xs sm:text-sm text-gray-600">A transparent digital marketplace connecting customers and skilled daily workers.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">C</div>
                <h3 className="text-lg font-black text-gray-900">For Customers</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                  <p className="text-xs text-gray-600"><strong className="text-gray-900">Select Service or Skill:</strong> Browse verified plumbers, electricians, carpenters, or painters in your city.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                  <p className="text-xs text-gray-600"><strong className="text-gray-900">Check Ratings & Aadhaar Badges:</strong> Compare experience, hourly rates, and real customer reviews.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                  <p className="text-xs text-gray-600"><strong className="text-gray-900">Book & Pay Safely:</strong> Schedule date and location. Pay online via UPI/cards or cash after job completion.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">W</div>
                <h3 className="text-lg font-black text-gray-900">For Workers</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                  <p className="text-xs text-gray-600"><strong className="text-gray-900">Register Profile:</strong> Choose your skill category, daily rates, and service city.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                  <p className="text-xs text-gray-600"><strong className="text-gray-900">Instant Aadhaar Verification:</strong> Get verified to build trust with local homeowners.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                  <p className="text-xs text-gray-600"><strong className="text-gray-900">Earn 100% Income:</strong> Receive direct job requests and keep all earnings with 0% commission fees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose KaamSathi */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Trust & Safety
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Why Choose KaamSathi</h2>
            <p className="text-xs sm:text-sm text-gray-600">Our platform ensures safety, direct connections, and transparent pricing for every customer and worker.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-200/60 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Aadhaar Verified Partners</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Identity verification and safety checks for complete peace of mind.</p>
            </div>

            <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-200/60 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Zero Commission for Workers</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Workers keep 100% of their wages, ensuring fair earnings for daily labour.</p>
            </div>

            <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-200/60 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Fast Local Dispatch</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Connect with nearby available workers for urgent home repair needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
              Reviews
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Loved by Homeowners & Workers</h2>
            <p className="text-xs sm:text-sm text-gray-600">See real stories from users across India.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">"{t.content}"</p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs">{t.name}</h4>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              FAQ
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-gray-600">Everything you need to know about KaamSathi.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden transition-all"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-5 text-left font-bold text-gray-900 flex items-center justify-between gap-4 text-sm"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-200/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
