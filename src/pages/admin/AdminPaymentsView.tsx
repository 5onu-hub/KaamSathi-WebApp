import React, { useState, useEffect } from "react";
import { CreditCard, DollarSign, Download, Search, CheckCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export function AdminPaymentsView() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/v1/admin/payments")
      .then(res => {
        if (res.data.success) setPayments(res.data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900">Payment & Transaction Management</h3>
          <p className="text-xs text-gray-500">Monitor transactions, commission splits, refund requests, and worker payouts</p>
        </div>
        <button onClick={() => toast.success("Exporting financial ledger...")} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 w-fit">
          <Download className="w-4 h-4" /> Export Ledger CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Volume Processed</span>
          <h3 className="text-3xl font-black text-gray-900">₹2,845,000</h3>
          <p className="text-xs text-emerald-600 font-semibold">+18.4% this month</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Commission (10%)</span>
          <h3 className="text-3xl font-black text-emerald-600">₹284,500</h3>
          <p className="text-xs text-gray-500">Direct platform earnings</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Payouts</span>
          <h3 className="text-3xl font-black text-blue-600">₹64,200</h3>
          <p className="text-xs text-gray-500">Scheduled for weekly auto-transfer</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-900 text-sm">Recent Transactions</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                <th className="pb-3 px-4">Transaction ID</th>
                <th className="pb-3 px-4">Customer & Worker</th>
                <th className="pb-3 px-4">Total Amount</th>
                <th className="pb-3 px-4">Commission (10%)</th>
                <th className="pb-3 px-4">Worker Payout</th>
                <th className="pb-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p, i) => (
                <tr key={p._id || p.id || i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-blue-600">{p.transactionId || "TXN_984392"}</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">{p.customerName || "Rahul Verma"}</div>
                    <div className="text-gray-400 text-[11px]">Worker: {p.workerName || "Ramesh Kumar"}</div>
                  </td>
                  <td className="py-4 px-4 font-black text-gray-900">₹{p.amount || 450}</td>
                  <td className="py-4 px-4 font-bold text-emerald-600">₹{p.commission || 45}</td>
                  <td className="py-4 px-4 font-bold text-blue-600">₹{p.workerEarnings || 405}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-700">
                      {p.status || "Success"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
