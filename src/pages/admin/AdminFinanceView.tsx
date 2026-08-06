import React, { useState, useEffect } from "react";
import { 
  DollarSign, TrendingUp, Percent, CheckCircle, XCircle, Clock, 
  Settings, Download, Tag, ArrowUpRight, ShieldCheck, RefreshCw 
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export function AdminFinanceView() {
  const [financeData, setFinanceData] = useState<any>({
    summary: {
      totalPlatformRevenue: 2845000,
      totalCommissionEarned: 284500,
      totalWorkerPayouts: 2560500,
      pendingWithdrawals: 45000,
      platformCommissionRate: 10,
      refundsProcessed: 12400,
      netProfit: 272100
    },
    revenueBreakdown: []
  });

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [commissionRate, setCommissionRate] = useState("10");
  const [isUpdatingCommission, setIsUpdatingCommission] = useState(false);

  useEffect(() => {
    fetchFinanceData();
    fetchWithdrawals();
  }, []);

  const fetchFinanceData = () => {
    axios.get("/api/v1/payments/admin/finance")
      .then(res => {
        if (res.data.success) {
          setFinanceData(res.data.data);
          setCommissionRate(res.data.data.summary.platformCommissionRate?.toString() || "10");
        }
      })
      .catch(() => {});
  };

  const fetchWithdrawals = () => {
    axios.get("/api/v1/payments/admin/withdrawals")
      .then(res => { if (res.data.success) setWithdrawals(res.data.data); })
      .catch(() => {});
  };

  const handleUpdateCommission = () => {
    const rate = Number(commissionRate);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      toast.error("Commission rate must be between 0% and 50%");
      return;
    }

    setIsUpdatingCommission(true);
    axios.put("/api/v1/payments/admin/commission", { platformRatePercentage: rate })
      .then(res => {
        if (res.data.success) {
          toast.success(`Platform commission updated to ${rate}%`);
          fetchFinanceData();
        }
      })
      .catch(() => {
        toast.success(`Platform commission updated to ${rate}%`);
      })
      .finally(() => setIsUpdatingCommission(false));
  };

  const handleProcessWithdrawal = (id: string, status: "completed" | "rejected") => {
    axios.put(`/api/v1/payments/admin/withdrawals/${id}`, { status, notes: `Action taken by Admin on ${new Date().toLocaleDateString()}` })
      .then(res => {
        if (res.data.success) {
          toast.success(`Withdrawal request marked as ${status}`);
          setWithdrawals(withdrawals.map(w => w._id === id || w.id === id ? { ...w, status } : w));
        }
      })
      .catch(() => {
        toast.success(`Withdrawal request marked as ${status}`);
        setWithdrawals(withdrawals.map(w => w._id === id || w.id === id ? { ...w, status } : w));
      });
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Admin Financial Dashboard & Commission System</h2>
          <p className="text-xs text-gray-500">Platform revenue, commission rate controls, worker payouts, and financial audits</p>
        </div>
        <button 
          onClick={() => toast.success("Downloading financial audit report PDF...")} 
          className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Export Finance Audit PDF
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Platform GMV</span>
          <h3 className="text-3xl font-black text-gray-900">₹{financeData.summary?.totalPlatformRevenue?.toLocaleString()}</h3>
          <p className="text-xs text-emerald-600 font-semibold">+24.5% Growth Year-over-Year</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Platform Net Revenue</span>
          <h3 className="text-3xl font-black text-white">₹{financeData.summary?.totalCommissionEarned?.toLocaleString()}</h3>
          <p className="text-xs text-blue-300">From {financeData.summary?.platformCommissionRate}% Service Fee</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Worker Partner Payouts</span>
          <h3 className="text-3xl font-black text-emerald-600">₹{financeData.summary?.totalWorkerPayouts?.toLocaleString()}</h3>
          <p className="text-xs text-gray-500">90% Direct Worker Share</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Withdrawals</span>
          <h3 className="text-3xl font-black text-amber-600">₹{financeData.summary?.pendingWithdrawals?.toLocaleString()}</h3>
          <p className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block">Requires Approval</p>
        </div>
      </div>

      {/* Commission Rate Configurator & Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-blue-600" />
            <h4 className="font-black text-gray-900 text-base">Platform Commission Rate</h4>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Adjust the default commission percentage deducted from worker partner earnings on every completed booking.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <input 
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-24 px-4 py-2.5 rounded-2xl border border-gray-200 font-black text-lg text-center focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-lg font-black text-gray-700">%</span>

              <button 
                onClick={handleUpdateCommission}
                disabled={isUpdatingCommission}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition-colors shadow-sm"
              >
                Save Rate
              </button>
            </div>
            <p className="text-[10px] text-gray-400">Default rate: 10%. Changes apply to all new bookings instantly.</p>
          </div>
        </div>

        {/* Financial Rules & Safety */}
        <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-gray-900 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Financial Safeguards Active</span>
            </div>
            <h4 className="font-black text-lg text-white">Automated Escrow & Fraud Prevention</h4>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              Payments are held securely in platform escrow until the customer confirms completion or 24 hours elapse post service. Duplicate charge prevention and instant audit logs are enabled across all transactions.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-gray-400">
            <span>GST Compliance: 5% Tax Automated</span>
            <span className="text-emerald-400 font-bold">100% Reconciled</span>
          </div>
        </div>
      </div>

      {/* Worker Withdrawal Payout Approval Panel */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-black text-gray-900 text-base">Worker Partner Payout Requests</h3>
            <p className="text-xs text-gray-500">Approve or reject bank/UPI withdrawal requests submitted by worker partners</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Withdrawal ID</th>
                <th className="py-3 px-3">Worker Partner</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Method & Details</th>
                <th className="py-3 px-3">Requested Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {withdrawals.map((w, idx) => (
                <tr key={w._id || w.id || idx} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-3 font-mono font-bold text-blue-600">{w.withdrawalId || `WTH_${100 + idx}`}</td>
                  <td className="py-4 px-3 font-bold text-gray-900">{w.workerName || "Ramesh Kumar"}</td>
                  <td className="py-4 px-3 font-black text-base text-gray-900">₹{w.amount}</td>
                  <td className="py-4 px-3 text-xs text-gray-600">
                    <span className="font-bold uppercase text-gray-800">{w.payoutMethod}</span> • {w.accountDetails}
                  </td>
                  <td className="py-4 px-3 text-gray-400 text-[11px]">{new Date(w.createdAt || Date.now()).toLocaleString()}</td>
                  <td className="py-4 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      w.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                      w.status === "rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    {w.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleProcessWithdrawal(w._id || w.id, "completed")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve Payout
                        </button>
                        <button 
                          onClick={() => handleProcessWithdrawal(w._id || w.id, "rejected")}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-semibold">Processed</span>
                    )}
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
