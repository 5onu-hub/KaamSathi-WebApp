import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, MapPin, Wrench, ShieldCheck, ChevronRight, 
  MessageSquare, Phone, FileText, Star, X, CheckCircle2, Navigation, AlertCircle, Plus 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatModal } from "../../components/booking/ChatModal";
import { CallModal } from "../../components/booking/CallModal";
import { InvoiceModal } from "../../components/booking/InvoiceModal";
import { ReviewModal } from "../../components/booking/ReviewModal";
import { NewBookingModal } from "../../components/booking/NewBookingModal";

export function CustomerBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "completed" | "cancelled">("active");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [chatBooking, setChatBooking] = useState<any>(null);
  const [callBooking, setCallBooking] = useState<any>(null);
  const [invoiceBooking, setInvoiceBooking] = useState<any>(null);
  const [reviewBooking, setReviewBooking] = useState<any>(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/bookings");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBookings(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    if (activeTab === "active") {
      return bookings.filter(b => ["accepted", "worker on the way", "arrived", "work started", "pending"].includes(b.status.toLowerCase()));
    }
    if (activeTab === "upcoming") {
      return bookings.filter(b => ["accepted", "pending"].includes(b.status.toLowerCase()));
    }
    if (activeTab === "completed") {
      return bookings.filter(b => b.status.toLowerCase() === "completed");
    }
    if (activeTab === "cancelled") {
      return bookings.filter(b => b.status.toLowerCase() === "cancelled");
    }
    return bookings;
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await fetch(`/api/v1/bookings/${id}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Customer changed plans" })
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs">
                Customer Portal
              </span>
              <span className="text-xs text-gray-400 font-semibold">• Live Booking Hub</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">My Service Bookings</h1>
            <p className="text-xs text-gray-500">Track worker arrivals, communicate, manage payments and invoices.</p>
          </div>

          <button 
            onClick={() => setIsNewBookingOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Book New Worker
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-2xs max-w-xl">
          {[
            { id: "active", label: "Active & Live" },
            { id: "upcoming", label: "Upcoming" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
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

        {/* Bookings Stream List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-48" />
            ))}
          </div>
        ) : getFilteredBookings().length > 0 ? (
          <div className="space-y-6">
            {getFilteredBookings().map((booking) => {
              const isLive = ["worker on the way", "arrived", "work started", "accepted"].includes(booking.status.toLowerCase());
              return (
                <div 
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-6"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-gray-400">#{booking.bookingNumber || booking.id}</span>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {booking.serviceCategory || booking.workerCategory || "Service"}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {booking.bookingDate || "Today"} at {booking.bookingTime || "10:00 AM"}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        booking.status.toLowerCase() === 'completed' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : booking.status.toLowerCase() === 'cancelled'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Main Info Body */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Worker Details */}
                    <div className="flex items-center gap-4">
                      <img 
                        src={booking.workerAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} 
                        alt={booking.workerName}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-600/20" 
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-base flex items-center gap-1">
                          {booking.workerName || "Ramesh Kumar"}
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">{booking.workerCategory || "Electrician"} Partner</p>
                        <p className="text-xs font-bold text-amber-500 mt-0.5">★ {booking.workerRating || 4.8} Rating</p>
                      </div>
                    </div>

                    {/* Service & Location */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Requested Service</span>
                      <h5 className="font-bold text-gray-900 text-sm">{booking.serviceName || "AC Servicing"}</h5>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {booking.customerAddress || "South Extension, New Delhi"}
                      </p>
                    </div>

                    {/* Price & Status */}
                    <div className="space-y-1 text-left md:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Amount</span>
                      <p className="text-2xl font-black text-blue-700">₹{booking.totalAmount || booking.estimatedCost || 500}</p>
                      <span className="text-[11px] font-bold text-gray-500 block">
                        Status: {booking.paymentStatus || "Payment Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setChatBooking(booking)}
                        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4" /> Chat with Worker
                      </button>
                      <button 
                        onClick={() => setCallBooking(booking)}
                        className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-4 h-4" /> Call
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setInvoiceBooking(booking)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-4 h-4 text-gray-500" /> Invoice
                      </button>

                      {booking.status.toLowerCase() === 'completed' && !booking.review && (
                        <button 
                          onClick={() => setReviewBooking(booking)}
                          className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-md hover:bg-amber-600 transition-colors flex items-center gap-1.5"
                        >
                          <Star className="w-4 h-4 fill-white" /> Rate Work
                        </button>
                      )}

                      {isLive && (
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}

                      <Link 
                        to={`/bookings/${booking.id}`}
                        className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        Track & Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-gray-100 shadow-xs max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Wrench className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-900">No Bookings Found</h3>
            <p className="text-xs text-gray-500">You don't have any {activeTab} bookings right now.</p>
            <button 
              onClick={() => setIsNewBookingOpen(true)}
              className="px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors"
            >
              Book a Service Now
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {chatBooking && (
        <ChatModal 
          isOpen={!!chatBooking}
          onClose={() => setChatBooking(null)}
          bookingId={chatBooking.id}
          partnerName={chatBooking.workerName || "Ramesh Kumar"}
          partnerRole={chatBooking.workerCategory || "Worker"}
          partnerAvatar={chatBooking.workerAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
        />
      )}

      {callBooking && (
        <CallModal 
          isOpen={!!callBooking}
          onClose={() => setCallBooking(null)}
          partnerName={callBooking.workerName || "Ramesh Kumar"}
          partnerAvatar={callBooking.workerAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
          partnerPhone={callBooking.workerPhone || "+91 98765 43210"}
        />
      )}

      {invoiceBooking && (
        <InvoiceModal 
          isOpen={!!invoiceBooking}
          onClose={() => setInvoiceBooking(null)}
          booking={invoiceBooking}
        />
      )}

      {reviewBooking && (
        <ReviewModal 
          isOpen={!!reviewBooking}
          onClose={() => setReviewBooking(null)}
          booking={reviewBooking}
          onSubmitted={fetchBookings}
        />
      )}

      <NewBookingModal 
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onSuccess={() => fetchBookings()}
      />
    </div>
  );
}
