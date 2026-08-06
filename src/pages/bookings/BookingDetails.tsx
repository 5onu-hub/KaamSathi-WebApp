import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  CheckCircle2, Clock, MapPin, Calendar, Wrench, ShieldCheck, 
  MessageSquare, Phone, FileText, Share2, Star, ArrowLeft, AlertCircle, Compass, ChevronRight 
} from "lucide-react";
import { motion } from "framer-motion";
import { LiveTrackingMap } from "../../components/booking/LiveTrackingMap";
import { ChatModal } from "../../components/booking/ChatModal";
import { CallModal } from "../../components/booking/CallModal";
import { InvoiceModal } from "../../components/booking/InvoiceModal";
import { ReviewModal } from "../../components/booking/ReviewModal";

export function BookingDetails() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    fetchBookingDetail();
  }, [bookingId]);

  const fetchBookingDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/bookings/${bookingId || "b_1001"}`);
      const json = await res.json();
      if (json.success && json.data) {
        setBooking(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: `KaamSathi Booking #${booking?.bookingNumber || bookingId}`,
        text: `Live tracking for ${booking?.serviceName} with ${booking?.workerName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Booking live tracking link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 animate-spin text-white flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-500">Loading booking real-time telemetry...</p>
        </div>
      </div>
    );
  }

  const defaultBooking = booking || {
    id: bookingId || "b_1001",
    bookingNumber: "KS-BK-8901",
    customerName: "Rahul Verma",
    customerPhone: "+91 98765 11223",
    customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    customerAddress: "Flat 402, Block B, Greenwoods Apartments, South Extension, New Delhi",
    workerName: "Ramesh Kumar",
    workerPhone: "+91 98765 43210",
    workerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    workerCategory: "Electrician",
    workerRating: 4.8,
    serviceName: "AC Servicing & Master Wiring Check",
    description: "Main MCB tripping frequently when AC and Geyser are turned on together.",
    bookingDate: "2026-08-06",
    bookingTime: "10:30 AM",
    status: "Worker On The Way",
    estimatedCost: 850,
    platformFee: 50,
    taxAmount: 45,
    totalAmount: 945,
    paymentStatus: "Payment Pending",
    timeline: [
      { status: "Pending", time: "Aug 5, 09:30 AM", note: "Booking requested by customer" },
      { status: "Accepted", time: "Aug 5, 09:35 AM", note: "Job accepted by Ramesh Kumar" },
      { status: "Worker On The Way", time: "Aug 5, 10:00 AM", note: "Worker dispatched. Live tracking active" }
    ]
  };

  const statusSteps = ["Pending", "Accepted", "Worker On The Way", "Arrived", "Work Started", "Completed"];
  const currentStepIdx = statusSteps.findIndex(s => s.toLowerCase() === defaultBooking.status.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/customer/bookings" className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to My Bookings
          </Link>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleShareBooking}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" /> Share Tracking
            </button>
            <button 
              onClick={() => setIsInvoiceOpen(true)}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" /> Download Invoice
            </button>
          </div>
        </div>

        {/* Main Status Hero Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-600">Booking ID: {defaultBooking.bookingNumber}</span>
              <h1 className="text-2xl font-black text-gray-900 mt-1">{defaultBooking.serviceName}</h1>
              <p className="text-xs text-gray-500 mt-0.5">Scheduled for {defaultBooking.bookingDate} at {defaultBooking.bookingTime}</p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Current Status</span>
              <span className="inline-block mt-1 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-black border border-blue-200 animate-pulse uppercase tracking-wider">
                {defaultBooking.status}
              </span>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Real-Time Job Progress</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {statusSteps.map((step, idx) => {
                const isDone = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div 
                    key={step} 
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isCurrent 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/30" 
                        : isDone 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                        : "bg-gray-50 text-gray-400 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isDone ? (
                        <CheckCircle2 className={`w-4 h-4 ${isCurrent ? "text-white" : "text-emerald-600"}`} />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold block leading-tight">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Tracking Map Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" /> Live Worker Location Dispatch Map
            </h3>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Refreshing
            </span>
          </div>

          <LiveTrackingMap 
            workerName={defaultBooking.workerName}
            status={defaultBooking.status}
            onCallWorker={() => setIsCallOpen(true)}
          />
        </div>

        {/* Worker & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Worker Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 md:col-span-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Worker</h3>
            <div className="flex items-center gap-4">
              <img 
                src={defaultBooking.workerAvatar} 
                alt={defaultBooking.workerName} 
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-600/20" 
              />
              <div>
                <h4 className="font-bold text-gray-900 text-base flex items-center gap-1">
                  {defaultBooking.workerName}
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h4>
                <p className="text-xs text-gray-500 font-medium">{defaultBooking.workerCategory} Partner</p>
                <p className="text-xs font-bold text-amber-500 mt-0.5">★ {defaultBooking.workerRating} Rating</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Open In-App Chat
              </button>
              <button 
                onClick={() => setIsCallOpen(true)}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Voice Call Worker
              </button>
            </div>
          </div>

          {/* Job Details & Price Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 md:col-span-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service & Address Info</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-700">
              <div>
                <span className="text-gray-400 font-bold block mb-1">Service Address</span>
                <p className="font-bold text-gray-900 flex items-start gap-1">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  {defaultBooking.customerAddress}
                </p>
              </div>

              <div>
                <span className="text-gray-400 font-bold block mb-1">Work Description</span>
                <p className="font-medium text-gray-800">{defaultBooking.description}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Payment Breakdown</h4>
              <div className="text-xs space-y-1.5 text-gray-700">
                <div className="flex justify-between">
                  <span>Service Labour Charges</span>
                  <span className="font-bold">₹{defaultBooking.estimatedCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform & Insurance Fee</span>
                  <span className="font-bold">₹{defaultBooking.platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Government Taxes (5% GST)</span>
                  <span className="font-bold">₹{defaultBooking.taxAmount}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 flex justify-between text-sm font-black text-blue-900">
                  <span>Total Amount</span>
                  <span className="text-base text-blue-700">₹{defaultBooking.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline History */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status Activity Logs</h3>
          <div className="space-y-3">
            {(defaultBooking.timeline || []).map((t: any, i: number) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="font-bold text-gray-900 w-32">{t.status}</span>
                <span className="text-gray-400 font-mono">{t.time}</span>
                <span className="text-gray-600 pl-4 border-l border-gray-100">{t.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        bookingId={defaultBooking.id}
        partnerName={defaultBooking.workerName}
        partnerRole={defaultBooking.workerCategory}
        partnerAvatar={defaultBooking.workerAvatar}
      />

      <CallModal 
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        partnerName={defaultBooking.workerName}
        partnerAvatar={defaultBooking.workerAvatar}
        partnerPhone={defaultBooking.workerPhone}
      />

      <InvoiceModal 
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        booking={defaultBooking}
      />

      <ReviewModal 
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        booking={defaultBooking}
      />
    </div>
  );
}
