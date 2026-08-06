import React, { useState, useEffect } from "react";
import { 
  Star, Shield, CheckCircle, EyeOff, Trash2, Pin, AlertTriangle, MessageSquare, ThumbsUp, Search, X, Check
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function AdminReviewsView() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/reviews/admin/all");
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, updates: any) => {
    try {
      await axios.patch(`/api/v1/reviews/admin/${id}`, updates);
      toast.success("Review updated successfully");
      fetchReviews();
    } catch (err) {
      toast.error("Failed to update review");
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const matchesReported = filterStatus === "reported" ? (r.reports && r.reports.length > 0) : true;
    return matchesSearch && matchesStatus && matchesReported;
  });

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Review Moderation & Trust</h1>
            <p className="text-xs text-slate-400">Moderate customer ratings, handle reported reviews, and manage pinned testimonials.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="hidden">Hidden</option>
            <option value="reported">Reported</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-900 rounded-3xl border border-slate-800">
            No reviews match the current filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev._id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 font-black flex items-center justify-center">
                    {rev.rating}★
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{rev.customerName}</h4>
                      {rev.isPinned && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">Pinned</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">Booking: {rev.bookingId} • Worker ID: {rev.workerId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    rev.status === "approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {rev.status}
                  </span>
                  {rev.reports && rev.reports.length > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {rev.reports.length} Reports
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-white text-xs">{rev.title}</h5>
                <p className="text-xs text-slate-300 mt-1">{rev.comment}</p>
              </div>

              {rev.reviewImages && rev.reviewImages.length > 0 && (
                <div className="flex gap-2 pt-2">
                  {rev.reviewImages.map((img: string, idx: number) => (
                    <img key={idx} src={img} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
                  ))}
                </div>
              )}

              {rev.reply && (
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 text-xs">
                  <span className="font-bold text-amber-400 block mb-0.5">Worker Reply:</span>
                  <p className="text-slate-300">{rev.reply.comment}</p>
                </div>
              )}

              {/* Reports details */}
              {rev.reports && rev.reports.length > 0 && (
                <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-900/30 text-xs text-rose-300 space-y-1">
                  <span className="font-bold block">Report Reasons:</span>
                  {rev.reports.map((rep: any, idx: number) => (
                    <div key={idx} className="text-[11px]">• {rep.reason} (User: {rep.userId})</div>
                  ))}
                </div>
              )}

              {/* Moderation Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> {rev.helpfulCount || 0} helpful</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleModerate(rev._id, { isPinned: !rev.isPinned })}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      rev.isPinned ? "bg-amber-500 text-slate-950" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" /> {rev.isPinned ? "Unpin" : "Pin Review"}
                  </button>
                  {rev.status === "approved" ? (
                    <button 
                      onClick={() => handleModerate(rev._id, { status: "hidden" })}
                      className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 font-bold flex items-center gap-1.5"
                    >
                      <EyeOff className="w-3.5 h-3.5" /> Hide
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleModerate(rev._id, { status: "approved" })}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  <button 
                    onClick={() => handleModerate(rev._id, { status: "deleted" })}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminReviewsView;
