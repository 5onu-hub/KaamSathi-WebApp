import React from "react";
import { X, Printer, Download, Share2, CheckCircle, Wrench, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export function InvoiceModal({ isOpen, onClose, booking }: InvoiceModalProps) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Invoice downloaded as PDF (KS-INV-" + (booking.bookingNumber || booking.id) + ".pdf)");
  };

  const laborCost = booking.estimatedCost || 500;
  const platformFee = booking.platformFee || 40;
  const taxAmount = booking.taxAmount || 30;
  const totalAmount = booking.totalAmount || (laborCost + platformFee + taxAmount);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Top Control Bar */}
        <div className="bg-gray-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-400" />
            <span className="font-black text-sm tracking-tight">KaamSathi Official Tax Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button 
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors ml-2">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1 bg-white text-gray-800 print:p-0">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-blue-700">Kaam<span className="text-orange-500">Sathi</span></span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-100">Tax Invoice</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Digital Labour Marketplace India Pvt. Ltd.</p>
              <p className="text-[11px] text-gray-400">GSTIN: 07AAACK8901K1ZS • Regd. Delhi NCR</p>
            </div>
            <div className="text-right">
              <h3 className="text-base font-black text-gray-900">INVOICE #{booking.bookingNumber || booking.id}</h3>
              <p className="text-xs text-gray-500 mt-1">Date: {booking.bookingDate || "2026-08-05"}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                booking.paymentStatus === 'Payment Completed' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {booking.paymentStatus || "PAID ONLINE"}
              </span>
            </div>
          </div>

          {/* Customer & Worker Details Grid */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Billed To (Customer)</span>
              <p className="font-bold text-sm text-gray-900">{booking.customerName || "Rahul Verma"}</p>
              <p className="text-xs text-gray-600">{booking.customerPhone || "+91 98765 11223"}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{booking.customerAddress || "South Extension, New Delhi"}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Service Provider (Worker)</span>
              <p className="font-bold text-sm text-gray-900 flex items-center gap-1">
                {booking.workerName || "Ramesh Kumar"}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </p>
              <p className="text-xs text-gray-600">{booking.workerCategory || "Electrician"} Partner</p>
              <p className="text-xs text-gray-500 mt-1">Contact: {booking.workerPhone || "+91 98765 43210"}</p>
            </div>
          </div>

          {/* Service Line Items */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 pr-4">Description</th>
                  <th className="py-3 px-2 text-center">Category</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                <tr>
                  <td className="py-3 pr-4">
                    <span className="font-bold text-gray-900 block">{booking.serviceName || "Electrical Service"}</span>
                    <span className="text-[11px] text-gray-400">{booking.description || "General maintenance and repair work"}</span>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-gray-600">{booking.serviceCategory || "Labour"}</td>
                  <td className="py-3 px-2 text-right font-bold text-gray-900">₹{laborCost}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Safety Guarantee & Convenience Fee</td>
                  <td className="py-3 px-2 text-center font-bold text-gray-600">Platform</td>
                  <td className="py-3 px-2 text-right font-bold text-gray-900">₹{platformFee}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">GST / Taxes (5%)</td>
                  <td className="py-3 px-2 text-center font-bold text-gray-600">Government Tax</td>
                  <td className="py-3 px-2 text-right font-bold text-gray-900">₹{taxAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
            <div>
              <span className="text-[11px] text-gray-400 block font-bold">Payment Method</span>
              <span className="text-xs font-bold text-gray-800">{booking.paymentMethod || "UPI / Cash"}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Grand Total Paid</span>
              <span className="text-2xl font-black text-blue-700">₹{totalAmount}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-center text-[11px] text-gray-500 space-y-1">
            <p className="font-bold text-blue-900">Thank you for choosing KaamSathi!</p>
            <p>For support or disputes regarding this booking invoice, contact support@kaamsathi.in or call 1800-KAAMSATHI.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
