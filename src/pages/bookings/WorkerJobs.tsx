import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, XCircle, Navigation, MapPin, Clock, Calendar, 
  Phone, MessageSquare, ShieldCheck, Play, Pause, Camera, DollarSign, Check, ChevronRight, AlertCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatModal } from "../../components/booking/ChatModal";
import { CallModal } from "../../components/booking/CallModal";
import { InvoiceModal } from "../../components/booking/InvoiceModal";

export function WorkerJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"requests" | "in_progress" | "completed">("requests");
  const [loading, setLoading] = useState(true);

  // Modals
  const [chatJob, setChatJob] = useState<any>(null);
  const [callJob, setCallJob] = useState<any>(null);
  const [invoiceJob, setInvoiceJob] = useState<any>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/bookings?workerId=w1");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setJobs(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobId: string, newStatus: string, note?: string) => {
    try {
      await fetch(`/api/v1/bookings/${jobId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note })
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoUpload = (jobId: string) => {
    const fakePhoto = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400";
    setUploadedPhotos(prev => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), fakePhoto]
    }));
  };

  const getFilteredJobs = () => {
    if (activeTab === "requests") {
      return jobs.filter(j => j.status.toLowerCase() === "pending");
    }
    if (activeTab === "in_progress") {
      return jobs.filter(j => ["accepted", "worker on the way", "arrived", "work started"].includes(j.status.toLowerCase()));
    }
    if (activeTab === "completed") {
      return jobs.filter(j => j.status.toLowerCase() === "completed");
    }
    return jobs;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                Worker Partner Portal
              </span>
              <span className="text-xs text-gray-400 font-semibold">• Real-Time Job Dispatch</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">Worker Job Management</h1>
            <p className="text-xs text-gray-500">Accept job dispatches, navigate to locations, update job progress, and receive payments.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-black text-gray-900">Online & Ready for Jobs</span>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-2xs max-w-lg">
          {[
            { id: "requests", label: "New Requests" },
            { id: "in_progress", label: "In Progress / On The Way" },
            { id: "completed", label: "Completed Jobs" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-48" />
            ))}
          </div>
        ) : getFilteredJobs().length > 0 ? (
          <div className="space-y-6">
            {getFilteredJobs().map((job) => {
              const currentStatus = job.status.toLowerCase();
              return (
                <div key={job.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
                  {/* Top Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-gray-400">#{job.bookingNumber || job.id}</span>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {job.serviceName || "Electrical Repairs"}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {job.bookingDate} at {job.bookingTime}
                      </span>
                    </div>

                    <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                      {job.status}
                    </span>
                  </div>

                  {/* Customer Info & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={job.customerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                        alt={job.customerName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-600/20" 
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{job.customerName || "Rahul Verma"}</h4>
                        <p className="text-xs text-gray-500 font-medium">{job.customerPhone || "+91 98765 11223"}</p>
                        <span className="text-[10px] font-bold text-emerald-600">★ Customer Rating 4.9</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Service Address</span>
                      <p className="text-xs text-gray-800 font-bold flex items-start gap-1">
                        <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" /> {job.customerAddress || "South Extension, New Delhi"}
                      </p>
                      <p className="text-[11px] text-gray-500 pt-1">Note: {job.description || "Main switchboard tripping."}</p>
                    </div>

                    <div className="space-y-1 text-left md:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Payout Earnings</span>
                      <p className="text-2xl font-black text-emerald-600">₹{job.estimatedCost || 500}</p>
                      <span className="text-[11px] font-bold text-gray-500 block">Collect via Cash/UPI on site</span>
                    </div>
                  </div>

                  {/* Work Photos Attachment section */}
                  {(uploadedPhotos[job.id] || job.workPhotos) && (
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-500">Completion Photos:</span>
                      <div className="flex gap-2">
                        {(uploadedPhotos[job.id] || job.workPhotos || []).map((imgUrl: string, idx: number) => (
                          <img key={idx} src={imgUrl} alt="Work photo" className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-200" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Workflow Action Controls */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setChatJob(job)}
                        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4" /> Chat
                      </button>
                      <button 
                        onClick={() => setCallJob(job)}
                        className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-4 h-4" /> Call Customer
                      </button>
                    </div>

                    {/* Step-by-Step Status Action Buttons */}
                    <div className="flex items-center gap-2">
                      {currentStatus === "pending" && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(job.id, "Rejected", "Worker unavailable")}
                            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(job.id, "Accepted", "Accepted by worker")}
                            className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700"
                          >
                            Accept Job Request
                          </button>
                        </>
                      )}

                      {currentStatus === "accepted" && (
                        <button 
                          onClick={() => handleUpdateStatus(job.id, "Worker On The Way", "Worker started journey")}
                          className="px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 flex items-center gap-1.5"
                        >
                          <Navigation className="w-4 h-4" /> Start Journey (On The Way)
                        </button>
                      )}

                      {currentStatus === "worker on the way" && (
                        <button 
                          onClick={() => handleUpdateStatus(job.id, "Arrived", "Worker reached customer location")}
                          className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 flex items-center gap-1.5"
                        >
                          <MapPin className="w-4 h-4" /> Mark Arrived at Customer
                        </button>
                      )}

                      {currentStatus === "arrived" && (
                        <button 
                          onClick={() => handleUpdateStatus(job.id, "Work Started", "Service initiated")}
                          className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 flex items-center gap-1.5"
                        >
                          <Play className="w-4 h-4" /> Start Work
                        </button>
                      )}

                      {currentStatus === "work started" && (
                        <>
                          <button 
                            onClick={() => handlePhotoUpload(job.id)}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                          >
                            <Camera className="w-4 h-4 text-blue-600" /> Upload Work Photo
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(job.id, "Completed", "Work finished & tested")}
                            className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md shadow-emerald-500/20 hover:bg-emerald-700 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Complete Work
                          </button>
                        </>
                      )}

                      <button 
                        onClick={() => setInvoiceJob(job)}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                      >
                        Invoice
                      </button>

                      <Link 
                        to={`/bookings/${job.id}`}
                        className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-1"
                      >
                        View Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-gray-100 max-w-md mx-auto">
            <h3 className="text-base font-black text-gray-900">No {activeTab} Jobs</h3>
            <p className="text-xs text-gray-500">When new service requests arrive in your city, they will appear here live.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {chatJob && (
        <ChatModal 
          isOpen={!!chatJob}
          onClose={() => setChatJob(null)}
          bookingId={chatJob.id}
          partnerName={chatJob.customerName || "Rahul Verma"}
          partnerRole="Customer"
          partnerAvatar={chatJob.customerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
        />
      )}

      {callJob && (
        <CallModal 
          isOpen={!!callJob}
          onClose={() => setCallJob(null)}
          partnerName={callJob.customerName || "Rahul Verma"}
          partnerAvatar={callJob.customerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
          partnerPhone={callJob.customerPhone || "+91 98765 11223"}
        />
      )}

      {invoiceJob && (
        <InvoiceModal 
          isOpen={!!invoiceJob}
          onClose={() => setInvoiceJob(null)}
          booking={invoiceJob}
        />
      )}
    </div>
  );
}
