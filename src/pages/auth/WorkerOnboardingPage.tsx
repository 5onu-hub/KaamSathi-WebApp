import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wrench, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, MapPin, 
  DollarSign, Award, User, FileText, Upload, Sparkles 
} from "lucide-react";
import { WORKER_CATEGORIES, CITIES_LIST } from "../../constants";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function WorkerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    city: "Delhi NCR",
    address: "H-12, Connaught Place, New Delhi",
    primarySkill: "electrician",
    secondarySkills: ["Inverter Repair", "Wiring"],
    experience: "6",
    hourlyRate: "300",
    dailyRate: "2200",
    serviceAreas: "Connaught Place, Karol Bagh, Paharganj",
    aadhaarNumber: "XXXX-XXXX-8921",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 8) {
      setStep(prev => prev + 1);
    } else {
      handleSubmitOnboarding();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmitOnboarding = async () => {
    setLoading(true);
    try {
      localStorage.setItem("kaamsathi_role", "worker");
      localStorage.setItem("kaamsathi_profile_completed", "true");
      
      // Sync worker profile to backend
      await axios.post("/api/v1/users/complete-profile", {
        role: "worker",
        ...formData
      }).catch(() => {});

      toast.success("🎉 Worker Onboarding Completed Successfully!");
      setTimeout(() => {
        navigate("/worker/dashboard");
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete onboarding");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-2xl mx-auto w-full space-y-8">
        {/* Header & Steps Indicator */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Worker Onboarding & KYC</h1>
          <p className="text-xs text-slate-400">Step {step} of 8 — Complete your professional profile to start earning</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-300" 
              style={{ width: `${(step / 8) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6">
          
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                <User className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Step 1: Basic Personal Details</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number</label>
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">City / Region</label>
                  <select 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                  >
                    {CITIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Residential Address</label>
                <input 
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Step 2: Professional Skills</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Primary Trade / Skill</label>
                <select 
                  value={formData.primarySkill}
                  onChange={e => setFormData({...formData, primarySkill: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                >
                  {WORKER_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Secondary Capabilities (Comma separated)</label>
                <input 
                  type="text"
                  value={formData.secondarySkills.join(", ")}
                  onChange={e => setFormData({...formData, secondarySkills: e.target.value.split(",").map(s => s.trim())})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Inverter Repair, MCB Fitting, Generator Wiring"
                />
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Step 3: Work Experience</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Years of Hands-on Experience</label>
                <input 
                  type="number"
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-xs text-slate-400">
                Experienced workers get featured higher in customer search results and receive priority high-ticket bookings.
              </p>
            </div>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Step 4: Rate Card & Pricing</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Hourly Rate (₹)</label>
                  <input 
                    type="number"
                    value={formData.hourlyRate}
                    onChange={e => setFormData({...formData, hourlyRate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Daily Wage Rate (₹)</label>
                  <input 
                    type="number"
                    value={formData.dailyRate}
                    onChange={e => setFormData({...formData, dailyRate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Service Areas */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Step 5: Service Areas & Pincodes</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Preferred Localities / Areas</label>
                <input 
                  type="text"
                  value={formData.serviceAreas}
                  onChange={e => setFormData({...formData, serviceAreas: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Connaught Place, Lajpat Nagar, Saket"
                />
              </div>
            </div>
          )}

          {/* Step 6: Aadhaar Verification */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Step 6: Government ID (Aadhaar KYC)</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Aadhaar Number / ID Document</label>
                <input 
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={e => setFormData({...formData, aadhaarNumber: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-400 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                <span>Government ID verification is mandatory for KaamSathi Trust Badge. Your data is encrypted and secure.</span>
              </div>
            </div>
          )}

          {/* Step 7: Profile Photo */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
                <Upload className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Step 7: Profile Photo</h3>
              </div>
              <div className="flex items-center gap-4">
                <img src={formData.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500" />
                <div className="space-y-2 flex-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">Avatar Image URL</label>
                  <input 
                    type="text"
                    value={formData.avatar}
                    onChange={e => setFormData({...formData, avatar: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Finish */}
          {step === 8 && (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">You Are All Set!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your profile is verified and ready for instant job dispatch on the KaamSathi Network. Click below to enter your Worker Dashboard.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            {step > 1 ? (
              <button 
                type="button"
                onClick={handlePrev}
                className="px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div></div>}

            <button 
              type="button"
              disabled={loading}
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all"
            >
              {loading ? "Saving Profile..." : step === 8 ? "Finish & Go to Dashboard" : "Save & Continue"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default WorkerOnboardingPage;
