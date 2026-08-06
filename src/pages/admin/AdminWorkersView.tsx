import React, { useState, useEffect } from "react";
import { Search, ShieldCheck, Star, CheckCircle, XCircle, Ban, Eye } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export function AdminWorkersView() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/api/v1/admin/workers")
      .then(res => {
        if (res.data.success) setWorkers(res.data.data);
      })
      .catch(() => {});
  }, []);

  const handleApprove = (id: string) => {
    axios.put(`/api/v1/admin/worker/${id}/approve`)
      .then(() => {
        toast.success("Worker approved successfully");
        setWorkers(workers.map(w => w._id === id || w.id === id ? { ...w, verified: true, status: "approved" } : w));
      })
      .catch(() => toast.error("Failed to approve worker"));
  };

  const handleReject = (id: string) => {
    axios.put(`/api/v1/admin/worker/${id}/reject`)
      .then(() => {
        toast.success("Worker verification rejected");
        setWorkers(workers.map(w => w._id === id || w.id === id ? { ...w, verified: false, status: "rejected" } : w));
      })
      .catch(() => toast.error("Failed to reject worker"));
  };

  const filteredWorkers = workers.filter(w => 
    w.name?.toLowerCase().includes(search.toLowerCase()) || 
    w.skill?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-gray-900">Worker Partner Management</h3>
        <p className="text-xs text-gray-500">Approve or reject verification documents, monitor ratings, and earnings</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search worker by name or skill..."
            className="bg-transparent text-xs w-full focus:outline-hidden"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                <th className="pb-3 px-4">Worker Profile</th>
                <th className="pb-3 px-4">Skill & City</th>
                <th className="pb-3 px-4">Rating</th>
                <th className="pb-3 px-4">Verification</th>
                <th className="pb-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWorkers.map((w, i) => (
                <tr key={w._id || w.id || i} className="hover:bg-gray-50/65 transition-colors">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <img src={w.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-gray-900">{w.name}</div>
                      <div className="text-gray-400 text-[11px]">Rate: ₹{w.hourlyRate || 250}/hr</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-blue-600">{w.skill || w.category}</div>
                    <div className="text-gray-400 text-[11px]">{w.city || "Delhi NCR"}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {w.rating || 4.8}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      w.verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {w.verified ? "Verified" : "Pending Review"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button onClick={() => handleApprove(w._id || w.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700">
                      Approve
                    </button>
                    <button onClick={() => handleReject(w._id || w.id)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
