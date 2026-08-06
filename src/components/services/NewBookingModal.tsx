import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, User, Phone, FileText, AlertCircle } from "lucide-react";

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  workerName?: string;
  startingPrice?: string;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  workerName,
  startingPrice = "₹250/hr"
}) => {
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Immediate Dispatch (Within 30 Mins)");
  const [address, setAddress] = useState("H.No 42, Green Park Main, South Delhi, Delhi - 110016");
  const [notes, setNotes] = useState("");
  const [paymentType, setPaymentType] = useState<"cash" | "online" | "upi">("upi");
  const [bookingId, setBookingId] = useState("");

  if (!isOpen) return null;

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `KS-BOOK-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(generatedId);
    setStep("confirmed");
  };

  const handleReset = () => {
    setStep("form");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-gray-900 text-white p-6 relative">
            <button
              onClick={handleReset}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Aadhaar Verified Booking</span>
            </div>
            <h3 className="text-xl font-black text-white">Book {serviceTitle}</h3>
            {workerName && (
              <p className="text-xs text-blue-200 mt-0.5">Assigned Worker: <span className="font-bold text-white">{workerName}</span></p>
            )}
          </div>

          {step === "form" ? (
            <form onSubmit={handleBookNow} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Service & Rate Info */}
              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 font-medium">Estimated Starting Rate:</span>
                  <div className="font-black text-blue-900 text-sm">{startingPrice}</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
                  0% Commission Fee
                </span>
              </div>

              {/* Date & Time Slot */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" /> Choose Booking Schedule
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 block mb-1">Date</span>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 block mb-1">Time Slot</span>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                    >
                      <option value="Immediate Dispatch (Within 30 Mins)">⚡ Immediate Dispatch (30 Mins)</option>
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                      <option value="Evening (3:00 PM - 7:00 PM)">Evening (3:00 PM - 7:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Service Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" /> Service Location Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter house no, street, landmark, city and pincode..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Problem / Work Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" /> Problem / Work Details (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Tap leakage in master bathroom, geyser not heating..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-gray-700 block">
                  Select Payment Method (Paid directly to worker after completion)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType("upi")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentType === "upi"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    UPI / GooglePay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("cash")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentType === "cash"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    Cash After Work
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("online")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentType === "online"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    KaamSathi Wallet
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all"
                >
                  Confirm & Dispatch Worker Now
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                  Booking Confirmed!
                </span>
                <h3 className="text-xl font-black text-gray-900 pt-2">Worker Dispatched</h3>
                <p className="text-xs text-gray-500">
                  Booking ID: <span className="font-mono font-bold text-gray-800">{bookingId}</span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl text-left text-xs space-y-2 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-bold text-gray-900">{serviceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Schedule:</span>
                  <span className="font-bold text-gray-900">{timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-bold text-gray-900 truncate max-w-[200px]">{address}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 italic">
                A verified worker partner will call your phone number within 5 minutes to confirm exact location details.
              </p>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
