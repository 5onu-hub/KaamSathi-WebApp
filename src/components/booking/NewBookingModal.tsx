import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, Wrench, ShieldCheck, CheckCircle2, ChevronRight, DollarSign, AlertCircle, Sparkles, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MockPaymentGatewayModal } from "./MockPaymentGatewayModal";

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: any;
  defaultWorker?: any;
  onSuccess?: (bookingId: string) => void;
}

export function NewBookingModal({ isOpen, onClose, worker, defaultWorker: propDefaultWorker, onSuccess }: NewBookingModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const activeWorker = worker || propDefaultWorker;

  // Form State
  const [serviceName, setServiceName] = useState(activeWorker ? `${activeWorker.category || activeWorker.skill || "Service"} General Work` : "Home Electrical Repair");
  const [selectedDate, setSelectedDate] = useState("2026-08-06");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [address, setAddress] = useState("Flat 402, Block B, Greenwoods Apartments, South Extension, New Delhi");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const defaultWorker = activeWorker || {
    id: "w1",
    name: "Ramesh Kumar",
    category: "Electrician",
    hourlyRate: 250,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 4.8,
    location: "South Delhi"
  };

  const hourlyCost = defaultWorker.hourlyRate * estimatedHours;
  const platformFee = 40;
  const taxes = Math.round(hourlyCost * 0.05);
  const totalAmount = hourlyCost + platformFee + taxes;

  const handleSubmitBooking = async (payOnline: boolean = false) => {
    setIsSubmitting(true);
    try {
      const payload = {
        workerId: defaultWorker.id,
        workerName: defaultWorker.name,
        workerCategory: defaultWorker.category,
        serviceName,
        description,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        customerName: "Rahul Verma",
        customerPhone: "+91 98765 11223",
        customerAddress: address,
        estimatedCost: hourlyCost
      };

      const res = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      const bookingId = data.data?.id || `b_${Date.now()}`;
      setIsSubmitting(false);

      if (payOnline) {
        setCreatedBookingId(bookingId);
        setShowPaymentGateway(true);
      } else {
        onClose();
        if (onSuccess) {
          onSuccess(bookingId);
        } else {
          navigate(`/bookings/${bookingId}`);
        }
      }
    } catch (err) {
      console.error("Booking error:", err);
      setIsSubmitting(false);
      navigate(`/bookings/b_1001`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 flex items-center justify-between">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              Step {step} of 4
            </span>
            <h3 className="text-xl font-black mt-1">Book {defaultWorker.name}</h3>
            <p className="text-xs text-blue-200">{defaultWorker.category} • ₹{defaultWorker.hourlyRate}/hr</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5">
          <div 
            className="bg-blue-600 h-1.5 transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: SERVICE & WORK DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <img src={defaultWorker.avatar} alt={defaultWorker.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20" />
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{defaultWorker.name}</h4>
                  <p className="text-xs text-gray-600 font-medium">{defaultWorker.category} • ★ {defaultWorker.rating} Rating</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Background Verified
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Service Type</label>
                <input 
                  type="text" 
                  value={serviceName} 
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="e.g. AC Servicing, Switchboard repair..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Estimated Work Duration</label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setEstimatedHours(hrs)}
                      className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                        estimatedHours === hrs 
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" 
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Describe the Work / Problem</label>
                <textarea 
                  rows={3} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the issue or required work to help the worker prepare..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-600" /> Select Booking Date
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Today", date: "2026-08-05" },
                    { label: "Tomorrow", date: "2026-08-06" },
                    { label: "Day After", date: "2026-08-07" },
                  ].map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDate(d.date)}
                      className={`p-3 rounded-2xl text-xs font-bold border text-center transition-all ${
                        selectedDate === d.date 
                          ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="block font-black text-sm">{d.label}</span>
                      <span className="text-[10px] opacity-80">{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-600" /> Preferred Time Slot
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "05:00 PM", "07:00 PM"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                        selectedTime === t 
                          ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION ADDRESS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" /> Service Location Address
                </label>
                <textarea 
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Enter house no., building name, street, city..."
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Live GPS Dispatch
                </span>
                <p className="text-[11px] text-amber-800">
                  Worker will receive live GPS directions directly to this address once the booking is confirmed.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: SUMMARY & PRICING */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">Booking Summary</h4>
                <div className="text-xs space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Worker:</span>
                    <span className="font-bold text-gray-900">{defaultWorker.name} ({defaultWorker.category})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span className="font-bold text-gray-900">{serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Schedule:</span>
                    <span className="font-bold text-gray-900">{selectedDate} at {selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address:</span>
                    <span className="font-bold text-gray-900 truncate max-w-[200px]">{address}</span>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Estimated Charges</h4>
                <div className="text-xs space-y-1.5 text-gray-700">
                  <div className="flex justify-between">
                    <span>Labor Cost ({estimatedHours} hrs @ ₹{defaultWorker.hourlyRate}/hr)</span>
                    <span className="font-bold">₹{hourlyCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety & Platform Convenience Fee</span>
                    <span className="font-bold">₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST / Taxes (5%)</span>
                    <span className="font-bold">₹{taxes}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between text-sm font-black text-blue-900">
                    <span>Total Amount Payable</span>
                    <span className="text-base text-blue-700">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pay directly to the worker via Cash or UPI after work completion.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button 
              onClick={() => setStep((s) => (s - 1) as any)} 
              className="px-5 py-2.5 rounded-2xl border border-gray-200 font-semibold text-xs text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
          ) : (
            <span className="text-xs font-semibold text-gray-400">Total: ₹{totalAmount}</span>
          )}

          {step < 4 ? (
            <button 
              onClick={() => setStep((s) => (s + 1) as any)} 
              className="px-6 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleSubmitBooking(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-all"
              >
                Book & Pay Later
              </button>
              <button 
                onClick={() => handleSubmitBooking(true)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" /> Pay Now Online (₹{totalAmount})
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mock Payment Gateway Overlay */}
      {showPaymentGateway && createdBookingId && (
        <MockPaymentGatewayModal 
          isOpen={showPaymentGateway}
          onClose={() => {
            setShowPaymentGateway(false);
            onClose();
            if (onSuccess) onSuccess(createdBookingId);
            else navigate(`/bookings/${createdBookingId}`);
          }}
          bookingId={createdBookingId}
          amount={totalAmount}
          serviceTitle={serviceName}
          customerName="Rahul Verma"
          workerName={defaultWorker.name}
          onSuccess={(txId) => {
            setShowPaymentGateway(false);
            onClose();
            if (onSuccess) onSuccess(createdBookingId);
            else navigate(`/bookings/${createdBookingId}`);
          }}
        />
      )}
    </div>
  );
}
