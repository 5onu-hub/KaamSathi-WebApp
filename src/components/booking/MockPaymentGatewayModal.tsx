import React, { useState } from "react";
import { 
  X, CheckCircle, AlertTriangle, ShieldCheck, CreditCard, Wallet, 
  Smartphone, Building2, Banknote, Tag, ArrowRight, Loader2, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

interface MockPaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
  amount?: number;
  serviceTitle?: string;
  customerName?: string;
  workerName?: string;
  onSuccess?: (txId: any) => void;
  bookingData?: {
    bookingId?: string;
    amount: number;
    workerName?: string;
    serviceCategory?: string;
    customerId?: string;
    customerName?: string;
  };
  onPaymentSuccess?: (result: any) => void;
}

export function MockPaymentGatewayModal({ 
  isOpen, 
  onClose, 
  bookingId,
  amount,
  serviceTitle,
  customerName,
  workerName,
  onSuccess,
  bookingData, 
  onPaymentSuccess 
}: MockPaymentGatewayModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet" | "cash">("upi");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [upiId, setUpiId] = useState("rahul@okicici");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [simulationResult, setSimulationResult] = useState<any>(null);

  if (!isOpen) return null;

  const effectiveBookingId = bookingId || bookingData?.bookingId || `b_${Date.now()}`;
  const effectiveWorkerName = workerName || bookingData?.workerName || "Ramesh Kumar";
  const effectiveCustomerName = customerName || bookingData?.customerName || "Rahul Verma";
  const effectiveCategory = serviceTitle || bookingData?.serviceCategory || "Labour Service";
  const baseAmount = amount || bookingData?.amount || 450;
  const platformFee = 25;
  const taxAmount = Math.round(baseAmount * 0.05);
  const finalTotal = Math.max(0, baseAmount + platformFee + taxAmount - discount);

  const handleCallback = (res: any) => {
    if (onSuccess) onSuccess(res);
    if (onPaymentSuccess) onPaymentSuccess(res);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    axios.post("/api/v1/coupons/apply", { code: couponCode, bookingAmount: baseAmount })
      .then(res => {
        if (res.data.success) {
          setDiscount(res.data.data.discount);
          setAppliedCoupon(res.data.data.code);
          toast.success(res.data.message);
        }
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Invalid coupon code");
      });
  };

  const handleProcessPayment = (forceFail: boolean = false) => {
    setProcessingState("processing");

    setTimeout(() => {
      if (forceFail) {
        setProcessingState("failed");
        toast.error("Payment failed. Bank server timed out.");
        return;
      }

      axios.post("/api/v1/payments/mock", {
        bookingId: effectiveBookingId,
        customerId: bookingData?.customerId || "cust_1",
        customerName: effectiveCustomerName,
        workerId: "w1",
        workerName: effectiveWorkerName,
        amount: finalTotal,
        paymentMethod: paymentMethod.toUpperCase(),
        status: "success",
        couponCode: appliedCoupon
      })
      .then(res => {
        if (res.data.success) {
          setSimulationResult(res.data.data);
          setProcessingState("success");
          toast.success("Payment Successful! Booking Confirmed.");
          setTimeout(() => {
            handleCallback(res.data.data);
          }, 1800);
        }
      })
      .catch(() => {
        // Fallback simulation
        const mockResult = {
          transactionId: `TXN_${Date.now()}`,
          amount: finalTotal,
          paymentMethod: paymentMethod.toUpperCase()
        };
        setSimulationResult(mockResult);
        setProcessingState("success");
        toast.success("Payment Successful!");
        setTimeout(() => {
          handleCallback(mockResult);
        }, 1800);
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">KaamSathi Gateway</h3>
              <p className="text-[11px] text-blue-200">256-Bit Encrypted Secure Checkout</p>
            </div>
          </div>
          {processingState === "idle" && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white/80" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {processingState === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Price Breakdown Summary */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>Base Service Fare ({bookingData.serviceCategory || "Labour"})</span>
                    <span>₹{baseAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>Platform & Convenience Fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>GST (5%)</span>
                    <span>₹{taxAmount}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-bold">
                      <span>Coupon Discount ({appliedCoupon})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center font-black text-gray-900 text-lg">
                    <span>Total Payable</span>
                    <span className="text-blue-700">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Coupon Code Accordion */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter Coupon (e.g. WELCOME50)"
                      className="pl-10 pr-3 py-2.5 rounded-2xl border border-gray-200 text-xs w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-mono font-bold"
                    />
                  </div>
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>

                {/* Payment Methods selector */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Choose Payment Method</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                        paymentMethod === "upi" ? "border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm" : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-bold text-xs">UPI / GPay</p>
                        <p className="text-[10px] text-gray-500">Instant scan & pay</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                        paymentMethod === "card" ? "border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm" : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div>
                        <p className="font-bold text-xs">Credit / Debit Card</p>
                        <p className="text-[10px] text-gray-500">Visa, Mastercard, RuPay</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("wallet")}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                        paymentMethod === "wallet" ? "border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm" : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <Wallet className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-xs">KaamSathi Wallet</p>
                        <p className="text-[10px] text-emerald-600 font-bold">Bal: ₹850</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                        paymentMethod === "netbanking" ? "border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm" : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold text-xs">Net Banking</p>
                        <p className="text-[10px] text-gray-500">HDFC, SBI, ICICI</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Selected Method Detail Inputs */}
                {paymentMethod === "upi" && (
                  <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                    <label className="text-[11px] font-bold text-blue-900 block">VPA / Virtual Payment Address</label>
                    <input 
                      type="text" 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)} 
                      className="w-full px-3 py-2 rounded-xl border border-blue-200 text-xs font-medium focus:outline-hidden"
                    />
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                    <label className="text-[11px] font-bold text-indigo-900 block">Card Number</label>
                    <input 
                      type="text" 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)} 
                      className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs font-mono font-medium focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button 
                    onClick={() => handleProcessPayment(false)}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    Pay ₹{finalTotal} Now <ArrowRight className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => handleProcessPayment(true)}
                    className="w-full py-2 text-rose-600 text-xs font-bold hover:underline"
                  >
                    [Simulate Payment Failure]
                  </button>
                </div>
              </motion.div>
            )}

            {processingState === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                <h4 className="font-black text-gray-900 text-lg">Communicating with Bank...</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">Please do not refresh or close this modal. Your mock transaction is being authenticated securely.</p>
              </motion.div>
            )}

            {processingState === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-black text-gray-900 text-xl">Payment Successful!</h4>
                <p className="text-xs text-emerald-700 font-bold bg-emerald-50 py-1.5 px-4 rounded-full inline-block">
                  Transaction ID: {simulationResult?.transactionId || `TXN_${Date.now()}`}
                </p>
                <p className="text-xs text-gray-500">Booking confirmed. Redirecting to live tracking...</p>
              </motion.div>
            )}

            {processingState === "failed" && (
              <motion.div key="failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h4 className="font-black text-gray-900 text-xl">Payment Failed</h4>
                <p className="text-xs text-rose-600">The bank server timed out or card was declined.</p>
                <button onClick={() => setProcessingState("idle")} className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl text-xs font-bold">
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
