import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, Calendar as CalendarIcon, Clock, MapPin, 
  ShieldCheck, Star, CreditCard, Wallet, Banknote, Sparkles, 
  Check, AlertCircle, ArrowRight, Building2, User, Phone, FileText 
} from "lucide-react";

export function BookingWizardPage() {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();

  // Step state: 1 to 8
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Worker data
  const [worker, setWorker] = useState<any>(null);

  // Form states
  const [selectedService, setSelectedService] = useState("Standard Repair & Inspection");
  const [serviceDuration, setServiceDuration] = useState("1 Hour");
  const [selectedDate, setSelectedDate] = useState("2026-08-07");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM");
  
  // Address state
  const [houseNo, setHouseNo] = useState("Flat 402, Block B");
  const [street, streetSet] = useState("Greenwoods Apartments, Main Street");
  const [area, setArea] = useState("Hazratganj");
  const [city, setCity] = useState("Lucknow");
  const [state, setState] = useState("Uttar Pradesh");
  const [pincode, setPincode] = useState("226001");
  const [landmark, setLandmark] = useState("Near Metro Station Gate 2");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  // Notes & Payment
  const [bookingNotes, setBookingNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash After Service");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkerDetails();
  }, [workerId]);

  const fetchWorkerDetails = async () => {
    try {
      const res = await fetch(`/api/v1/workers/${workerId || "w1"}`);
      const json = await res.json();
      if (json.success && json.data) {
        setWorker(json.data);
      } else {
        // Fallback mock worker
        setWorker({
          id: workerId || "w1",
          name: "Ramesh Kumar",
          categoryName: "Electrician",
          rating: 4.9,
          reviewsCount: 142,
          hourlyRate: 250,
          dailyRate: 1800,
          location: "Hazratganj, Lucknow",
          experienceYears: 8,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
          verified: true
        });
      }
    } catch {
      setWorker({
        id: workerId || "w1",
        name: "Ramesh Kumar",
        categoryName: "Electrician",
        rating: 4.9,
        reviewsCount: 142,
        hourlyRate: 250,
        dailyRate: 1800,
        location: "Hazratganj, Lucknow",
        experienceYears: 8,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        verified: true
      });
    }
  };

  const hourlyRate = worker?.hourlyRate || 250;
  const platformFee = 49;
  const travelFee = 30;
  const tax = Math.round((hourlyRate + platformFee + travelFee) * 0.05);
  const totalAmount = hourlyRate + platformFee + travelFee + tax;

  const handleUseCurrentLocation = () => {
    setUseCurrentLocation(true);
    setHouseNo("Plot 12, Sunrise Enclave");
    streetSet("MG Road");
    setArea("Civil Lines");
    setCity("Lucknow");
    setState("Uttar Pradesh");
    setPincode("226002");
    setLandmark("Near Central Mall");
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: worker?.id || "w1",
          workerName: worker?.name || "Ramesh Kumar",
          workerCategory: worker?.categoryName || "Electrician",
          serviceName: selectedService,
          bookingDate: selectedDate,
          bookingTime: selectedTimeSlot,
          customerAddress: `${houseNo}, ${street}, ${area}, ${city} - ${pincode}`,
          totalAmount,
          paymentMethod,
          bookingNotes
        })
      });
      const data = await res.json();
      const bookingId = data.data?.id || `b_${Date.now()}`;
      navigate(`/booking/success?bookingId=${bookingId}&workerName=${encodeURIComponent(worker?.name || "Ramesh Kumar")}&serviceName=${encodeURIComponent(selectedService)}&date=${selectedDate}&time=${selectedTimeSlot}`);
    } catch {
      const bookingId = `b_${Date.now()}`;
      navigate(`/booking/success?bookingId=${bookingId}&workerName=${encodeURIComponent(worker?.name || "Ramesh Kumar")}&serviceName=${encodeURIComponent(selectedService)}&date=${selectedDate}&time=${selectedTimeSlot}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    { time: "09:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:30 PM", available: false },
    { time: "05:00 PM", available: true },
    { time: "06:30 PM", available: true },
  ];

  const datesList = [
    { date: "2026-08-07", label: "Today", tag: "Available" },
    { date: "2026-08-08", label: "Tomorrow", tag: "Available" },
    { date: "2026-08-09", label: "Saturday", tag: "Weekend" },
    { date: "2026-08-10", label: "Sunday", tag: "Weekend" },
    { date: "2026-08-11", label: "Monday", tag: "Available" },
  ];

  const stepsMeta = [
    "Select Service",
    "Choose Date",
    "Time Slot",
    "Address",
    "Notes",
    "Price",
    "Payment",
    "Review"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 text-gray-900 dark:text-slate-100 font-sans transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Back */}
        <div className="flex items-center justify-between">
          <Link 
            to={`/workers/${workerId || "w1"}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Worker Profile
          </Link>

          <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
            Secure Booking Wizard • Step {step} of 8
          </span>
        </div>

        {/* Progress Stepper Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
            {stepsMeta.map((label, idx) => {
              const sNum = idx + 1;
              const isCurrent = step === sNum;
              const isDone = step > sNum;

              return (
                <div key={idx} className="flex items-center gap-2 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                  }`}>
                    {isDone ? <Check className="w-4 h-4" /> : sNum}
                  </div>
                  <span className={`text-xs font-bold hidden md:inline ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-slate-800 shadow-xl space-y-8">
          
          {/* Worker summary header */}
          {worker && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-800">
              <img 
                src={worker.avatar} 
                alt={worker.name} 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/20 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">Hiring Professional</span>
                <h3 className="text-base font-black text-gray-950 dark:text-white">{worker.name} ({worker.categoryName})</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">⭐ {worker.rating} • {worker.location} • ₹{worker.hourlyRate}/hr</p>
              </div>
            </div>
          )}

          {/* ================= STEP 1: SELECT SERVICE ================= */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-950 dark:text-white">Select Service & Scope</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Choose the specific repair or installation service you need from this professional.</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Standard Repair & Inspection", desc: "Diagnostic check, minor fixing, and testing", time: "1 Hour", price: `₹${hourlyRate}` },
                  { name: "Advanced Installation & Setup", desc: "Complete assembly, wiring, or mounting", time: "2 Hours", price: `₹${hourlyRate * 2}` },
                  { name: "Emergency Urgent Visit", desc: "Priority dispatch within 30 minutes", time: "1.5 Hours", price: `₹${Math.round(hourlyRate * 1.5)}` }
                ].map((serv, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedService(serv.name)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedService === serv.name 
                        ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 shadow-md' 
                        : 'border-gray-200 dark:border-slate-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-gray-950 dark:text-white">{serv.name}</h4>
                        {selectedService === serv.name && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{serv.desc}</p>
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Estimated Duration: {serv.time}
                      </span>
                    </div>

                    <span className="text-base font-black text-gray-950 dark:text-white">{serv.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: CHOOSE DATE ================= */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-950 dark:text-white">Choose Booking Date</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Select when you want the professional to arrive at your address.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {datesList.map((d, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 text-center ${
                      selectedDate === d.date 
                        ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 shadow-md' 
                        : 'border-gray-200 dark:border-slate-800'
                    }`}
                  >
                    <CalendarIcon className={`w-6 h-6 mx-auto ${selectedDate === d.date ? 'text-blue-600' : 'text-gray-400'}`} />
                    <h4 className="font-black text-base text-gray-950 dark:text-white">{d.label}</h4>
                    <span className="text-xs text-gray-500 block font-mono">{d.date}</span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                      {d.tag}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3: CHOOSE TIME SLOT ================= */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-950 dark:text-white">Choose Time Slot</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Select a convenient 2-hour arrival window.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map((slot, idx) => (
                  <button 
                    key={idx}
                    disabled={!slot.available}
                    onClick={() => setSelectedTimeSlot(slot.time)}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm font-black transition-all flex flex-col items-center justify-center gap-1 ${
                      !slot.available 
                        ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 border-gray-200 dark:border-slate-700 cursor-not-allowed opacity-60'
                        : selectedTimeSlot === slot.time
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 hover:border-blue-500'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{slot.time}</span>
                    <span className="text-[10px] font-normal">{slot.available ? "Available" : "Booked"}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= STEP 4: SERVICE ADDRESS ================= */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-950 dark:text-white">Service Location Address</h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Where should the worker arrive?</p>
                </div>
                <button 
                  onClick={handleUseCurrentLocation}
                  className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black border border-blue-200 dark:border-blue-900 flex items-center gap-1.5 shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5" /> Use Current GPS
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300">House / Flat / Block No.</label>
                  <input 
                    type="text" 
                    value={houseNo} 
                    onChange={e => setHouseNo(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Street / Society Name</label>
                  <input 
                    type="text" 
                    value={street} 
                    onChange={e => streetSet(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Area / Locality</label>
                  <input 
                    type="text" 
                    value={area} 
                    onChange={e => setArea(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300">City</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={e => setCity(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300">State & Pincode</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={state} 
                      onChange={e => setState(e.target.value)} 
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold"
                    />
                    <input 
                      type="text" 
                      value={pincode} 
                      onChange={e => setPincode(e.target.value)} 
                      className="w-28 px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Landmark (Optional)</label>
                  <input 
                    type="text" 
                    value={landmark} 
                    onChange={e => setLandmark(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 5: BOOKING NOTES ================= */}
          {step === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-950 dark:text-white">Special Instructions & Notes</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Let the professional know any specific details before arrival.</p>
              </div>

              <div className="space-y-3">
                <textarea 
                  rows={4}
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  placeholder="e.g. Please bring a ladder. Ring the doorbell twice. Main MCB is located outside the flat."
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                />

                <div className="flex flex-wrap gap-2">
                  {[
                    "Please bring a ladder",
                    "Ring doorbell twice",
                    "Urgent service required",
                    "Call before arriving"
                  ].map((preset, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setBookingNotes(prev => prev ? `${prev}. ${preset}` : preset)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 6: PRICE BREAKDOWN ================= */}
          {step === 6 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-950 dark:text-white">Transparent Price Breakdown</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Zero hidden markups. Pay directly to worker or via secure platform.</p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/60 p-6 rounded-3xl space-y-4 border border-gray-200 dark:border-slate-700">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-gray-600 dark:text-slate-300">Base Service Fee ({selectedService})</span>
                  <span>₹{hourlyRate}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-gray-600 dark:text-slate-300">KaamSathi Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-gray-600 dark:text-slate-300">Travel & Dispatch Charge</span>
                  <span>₹{travelFee}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-gray-600 dark:text-slate-300">GST (5%)</span>
                  <span>₹{tax}</span>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-black text-base sm:text-lg">Total Payable Amount</span>
                  <span className="font-black text-xl text-blue-600 dark:text-blue-400">₹{totalAmount}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 7: PAYMENT METHOD ================= */}
          {step === 7 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-950 dark:text-white">Choose Payment Method</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Pay after job completion or instantly via UPI / Wallet.</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Cash After Service", desc: "Pay cash directly to the worker once work is completed", icon: <Banknote className="w-5 h-5 text-emerald-500" /> },
                  { name: "UPI (Google Pay / PhonePe / Paytm)", desc: "Instant secure digital payment", icon: <CreditCard className="w-5 h-5 text-blue-500" /> },
                  { name: "KaamSathi Wallet", desc: "Use balance (Available: ₹2,450)", icon: <Wallet className="w-5 h-5 text-purple-500" /> },
                  { name: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: <CreditCard className="w-5 h-5 text-indigo-500" /> }
                ].map((pm, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setPaymentMethod(pm.name)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      paymentMethod === pm.name 
                        ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 shadow-md' 
                        : 'border-gray-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                        {pm.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-gray-950 dark:text-white">{pm.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{pm.desc}</p>
                      </div>
                    </div>
                    {paymentMethod === pm.name && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= STEP 8: REVIEW BOOKING ================= */}
          {step === 8 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-950 dark:text-white">Review & Confirm Booking</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Verify all details before dispatching the professional.</p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/60 p-6 rounded-3xl space-y-4 border border-gray-200 dark:border-slate-700 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-500 font-bold">Professional</span>
                  <span className="font-black text-gray-900 dark:text-white">{worker?.name} ({worker?.categoryName})</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-500 font-bold">Service</span>
                  <span className="font-black text-gray-900 dark:text-white">{selectedService}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-500 font-bold">Date & Time</span>
                  <span className="font-black text-gray-900 dark:text-white">{selectedDate} at {selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-500 font-bold">Service Address</span>
                  <span className="font-black text-gray-900 dark:text-white text-right max-w-xs truncate">{houseNo}, {area}, {city}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-500 font-bold">Payment Method</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{paymentMethod}</span>
                </div>
                {bookingNotes && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 font-bold">Notes</span>
                    <span className="font-semibold text-gray-700 dark:text-slate-300">{bookingNotes}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 pt-3 font-black text-base">
                  <span>Total Payable</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{totalAmount}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-700 font-bold text-xs hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < 8 ? (
              <button 
                onClick={() => setStep(s => s + 1)}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? "Dispatching Worker..." : "Confirm & Dispatch Worker"}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default BookingWizardPage;
