import React, { useState, useEffect } from "react";
import { Search, CreditCard, Download, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";
import axios from "axios";
import { InvoiceModal } from "../../components/booking/InvoiceModal";

export function CustomerPaymentsView() {
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    axios.get("/api/v1/payments/history?userId=cust_1&role=customer")
      .then(res => { if (res.data.success) setPayments(res.data.data); })
      .catch(() => {});
  }, []);

  const filtered = payments.filter(p => 
    p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.workerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Payment Statements & Transactions</h2>
          <p className="text-xs text-gray-500">History of all service payments, digital receipts, and refunds</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Txn ID or Worker..."
            className="pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
        {filtered.map((pay) => (
          <div key={pay._id || pay.transactionId} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-gray-900 text-base">{pay.workerName}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    {pay.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Txn ID: <span className="font-mono font-bold text-gray-700">{pay.transactionId}</span> • Booking #{pay.bookingId}
                </p>
                <p className="text-[11px] text-gray-400">
                  Paid via {pay.paymentMethod || "GPay UPI"} • {new Date(pay.createdAt || Date.now()).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 pt-3 sm:pt-0">
              <div className="text-left sm:text-right">
                <span className="text-2xl font-black text-gray-900 block">₹{pay.amount}</span>
                <span className="text-[10px] text-gray-400">Incl. platform fee & taxes</span>
              </div>

              <button 
                onClick={() => setSelectedInvoice(pay)}
                className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedInvoice && (
        <InvoiceModal 
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          booking={selectedInvoice}
        />
      )}
    </div>
  );
}
