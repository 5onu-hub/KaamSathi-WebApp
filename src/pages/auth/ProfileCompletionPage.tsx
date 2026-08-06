import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, CheckCircle } from "lucide-react";
import { WORKER_CATEGORIES, CITIES_LIST } from "../../constants";
import toast, { Toaster } from "react-hot-toast";

export function ProfileCompletionPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Delhi NCR");
  const [address, setAddress] = useState("");
  const [primarySkill, setPrimarySkill] = useState("electrician");
  const [experience, setExperience] = useState("5");
  const [hourlyRate, setHourlyRate] = useState("250");
  const navigate = useNavigate();

  const role = localStorage.getItem("kaamsathi_role") || "customer";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      toast.error("Please fill in all mandatory fields");
      return;
    }
    toast.success("Profile completed successfully!");
    localStorage.setItem("kaamsathi_profile_completed", "true");
    setTimeout(() => {
      if (role === "worker") {
        navigate("/worker-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Complete Your Profile</h1>
          <p className="text-sm text-gray-500">
            {role === "worker" ? "Set up your worker profile to receive job requests" : "Set up your customer profile to book trusted workers"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ramesh Kumar"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City / Region</label>
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
              >
                {CITIES_LIST.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
            <input 
              type="text" 
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House No, Street, Landmark"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {role === "worker" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Primary Skill</label>
                  <select 
                    value={primarySkill}
                    onChange={(e) => setPrimarySkill(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  >
                    {WORKER_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Experience (Years)</label>
                  <input 
                    type="number" 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hourly Rate (₹)</label>
                <input 
                  type="number" 
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </>
          )}

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              Complete Profile & Enter Dashboard <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
