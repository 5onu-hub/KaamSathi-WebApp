import React, { useState } from "react";
import { 
  User, Phone, Mail, MapPin, ShieldCheck, Camera, Save, Bell, Lock, 
  CreditCard, Sparkles, CheckCircle2 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function CustomerProfileView() {
  const [formData, setFormData] = useState({
    fullName: "Rahul Verma",
    phone: "+91 98765 43210",
    email: "rahul.verma@gmail.com",
    city: "Delhi NCR",
    address: "Flat 402, Block B, Greenwoods Apartments, South Extension, New Delhi - 110049",
    emergencyContact: "+91 98111 22233",
    notificationsEnabled: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile updated successfully!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20 font-sans">
      <Toaster position="top-right" />

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 text-blue-200 text-xs font-bold border border-blue-700/50">
            <User className="w-3.5 h-3.5 text-orange-400" /> Customer Account Management
          </div>
          <h1 className="text-3xl font-black tracking-tight">Personal Profile & Addresses</h1>
          <p className="text-blue-200 text-xs sm:text-sm">Manage your personal information, default delivery/work location, and contact preferences.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                RV
              </div>
              <button 
                type="button" 
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-colors"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{formData.fullName}</h3>
              <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Phone Verified Account
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Primary City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Default Work / Home Address</label>
            <textarea 
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full p-4 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Profile Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
