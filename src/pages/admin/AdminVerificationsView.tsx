import React, { useState } from "react";
import { ShieldCheck, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export function AdminVerificationsView() {
  const [requests, setRequests] = useState([
    { id: "v1", name: "Manoj Tiwari", skill: "Carpenter", city: "Noida", aadhaar: "XXXX-XXXX-8921", pan: "ABCDE1234F", status: "pending" },
    { id: "v2", name: "Sunil Kumar", skill: "Electrician", city: "Gurugram", aadhaar: "XXXX-XXXX-4512", pan: "FGHIJ5678K", status: "pending" },
  ]);

  const handleAction = (id: string, status: string) => {
    toast.success(`Worker verification request ${status}`);
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-gray-900">Worker Document & Background Verifications</h3>
        <p className="text-xs text-gray-500">Review Aadhaar cards, PAN cards, police verification certificates, and portfolios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map(req => (
          <div key={req.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                  {req.name[0]}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-base">{req.name}</h4>
                  <span className="text-xs font-semibold text-blue-600">{req.skill} • {req.city}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                req.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                {req.status}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Aadhaar Number:</span>
                <span className="font-bold text-gray-800">{req.aadhaar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PAN Number:</span>
                <span className="font-bold text-gray-800">{req.pan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Police Check:</span>
                <span className="font-bold text-emerald-600">Passed / Clean</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => handleAction(req.id, "approved")}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md"
              >
                Approve Verification
              </button>
              <button 
                onClick={() => handleAction(req.id, "rejected")}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md"
              >
                Reject & Request Docs
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
