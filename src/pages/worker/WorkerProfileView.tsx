import React, { useState } from "react";
import { 
  User, ShieldCheck, Wrench, Clock, DollarSign, Camera, CheckCircle2, 
  MapPin, Sparkles, Award, FileCheck, Save 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function WorkerProfileView() {
  const [formData, setFormData] = useState({
    name: "Ramesh Kumar",
    phone: "+91 98765 12345",
    primarySkill: "Master Electrician",
    experience: "8 Years",
    hourlyRate: "250",
    city: "Delhi NCR",
    aadhaarStatus: "Verified",
    isAvailable: true,
    bio: "Experienced electrician specializing in residential wiring, MCB replacements, inverter setups, and heavy equipment repairs across Delhi NCR."
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Worker professional profile updated successfully!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified Skilled Partner
          </div>
          <h1 className="text-3xl font-black tracking-tight">Worker Professional Profile</h1>
          <p className="text-gray-300 text-xs sm:text-sm">Manage skills, set hourly charges, update Aadhaar KYC status, and switch work availability.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md space-y-8">
          {/* Avatar & KYC Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
                  alt="Ramesh Kumar" 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-200 shadow-md"
                />
                <button 
                  type="button" 
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">{formData.name}</h3>
                <p className="text-xs font-bold text-blue-600">{formData.primarySkill}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    0% Commission Partner
                  </span>
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-gray-700">Work Status:</span>
              <button
                type="button"
                onClick={() => setFormData({...formData, isAvailable: !formData.isAvailable})}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                  formData.isAvailable ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-200 text-gray-600"
                }`}
              >
                {formData.isAvailable ? "ACTIVE FOR JOBS" : "OFFLINE"}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Phone Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Primary Skill / Category</label>
              <input 
                type="text" 
                value={formData.primarySkill}
                onChange={(e) => setFormData({...formData, primarySkill: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Years of Experience</label>
              <input 
                type="text" 
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Hourly Charge (₹)</label>
              <input 
                type="number" 
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Service City</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Professional Summary & Bio</label>
            <textarea 
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full p-4 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-8 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Update Partner Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
