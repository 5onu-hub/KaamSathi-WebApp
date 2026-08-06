import React, { useState } from "react";
import { AlertCircle, CheckCircle, MessageSquare, User } from "lucide-react";
import toast from "react-hot-toast";

export function AdminComplaintsView() {
  const [complaints, setComplaints] = useState([
    { id: "c1", complainant: "Rahul Verma (Customer)", target: "Ramesh Kumar (Worker)", subject: "Worker arrived 30 mins late", priority: "medium", status: "open", date: "Today" },
    { id: "c2", complainant: "Suresh Sharma (Worker)", target: "Priya Sharma (Customer)", subject: "Customer refused payment after service", priority: "high", status: "investigating", date: "Yesterday" }
  ]);

  const handleResolve = (id: string) => {
    toast.success("Complaint marked as resolved");
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: "resolved" } : c));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-gray-900">Customer & Worker Complaint Management</h3>
        <p className="text-xs text-gray-500">Handle dispute resolution, assign support agents, and review ticket conversation histories</p>
      </div>

      <div className="space-y-4">
        {complaints.map(c => (
          <div key={c.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 text-base">{c.subject}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  c.priority === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {c.priority} Priority
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">Complainant: <span className="font-semibold text-gray-800">{c.complainant}</span> vs Target: <span className="font-semibold text-gray-800">{c.target}</span></p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => toast.success("Opened conversation logs")} className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> View Chat
              </button>
              <button onClick={() => handleResolve(c.id)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md">
                Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
