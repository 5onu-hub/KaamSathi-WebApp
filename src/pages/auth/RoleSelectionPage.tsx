import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, UserCheck, Briefcase, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<"customer" | "worker">("customer");
  const navigate = useNavigate();

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("kaamsathi_role", selectedRole);
    toast.success(`Role selected: ${selectedRole.toUpperCase()}`);
    setTimeout(() => {
      if (selectedRole === "worker") {
        navigate("/worker/onboarding");
      } else {
        navigate("/customer-dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-2xl max-w-lg w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">How do you want to use KaamSathi?</h1>
          <p className="text-sm text-gray-500">Choose your primary role to customize your experience.</p>
        </div>

        <form onSubmit={handleRoleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => setSelectedRole("customer")}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 ${
                selectedRole === "customer" 
                  ? "border-blue-600 bg-blue-50/50 shadow-md" 
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedRole === "customer" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}>
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Hire Workers</h3>
                <p className="text-xs text-gray-500 mt-1">I want to hire verified electricians, plumbers, and helpers.</p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedRole("worker")}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 ${
                selectedRole === "worker" 
                  ? "border-blue-600 bg-blue-50/50 shadow-md" 
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedRole === "worker" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}>
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Find Work</h3>
                <p className="text-xs text-gray-500 mt-1">I am a skilled daily wage worker looking for daily jobs.</p>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            Continue to Profile Setup <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
