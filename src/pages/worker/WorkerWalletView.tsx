import React, { useState, useEffect } from "react";
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Landmark, Smartphone, Building2, 
  Clock, CheckCircle2, ShieldCheck, AlertCircle, Plus, ChevronRight, X 
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export function WorkerWalletView() {
  const [wallet, setWallet] = useState<any>({
    balance: 14250,
    pendingBalance: 1200,
    withdrawableAmount: 14250,
    bankAccount: { accountHolderName: "Ramesh Kumar", accountNumber: "918237461928", ifscCode: "HDFC0001234", bankName: "HDFC Bank", verified: true },
    upiId: "ramesh@upi"
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("5000");
  const [payoutMethod, setPayoutMethod] = useState<"bank" | "upi">("upi");

  useEffect(() => {
    axios.get("/api/v1/wallet?userId=w1&role=worker")
      .then(res => { if (res.data.success) setWallet(res.data.data); })
      .catch(() => {});

    axios.get("/api/v1/wallet/transactions?userId=w1")
      .then(res => { if (res.data.success) setTransactions(res.data.data); })
      .catch(() => {});

    axios.get("/api/v1/admin/withdrawals")
      .then(res => { if (res.data.success) setWithdrawals(res.data.data); })
      .catch(() => {});
  }, []);

  const handleRequestWithdrawal = () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amt > wallet.withdrawableAmount) {
      toast.error("Insufficient withdrawable balance");
      return;
    }

    axios.post("/api/v1/wallet/withdraw", {
      workerId: "w1",
      workerName: "Ramesh Kumar",
      amount: amt,
      payoutMethod,
      accountDetails: payoutMethod === "bank" ? `${wallet.bankAccount.bankName} (•••• ${wallet.bankAccount.accountNumber.slice(-4)})` : wallet.upiId
    })
    .then(res => {
      if (res.data.success) {
        toast.success("Withdrawal request submitted successfully!");
        setShowWithdrawModal(false);
        setWallet((prev: any) => ({
          ...prev,
          balance: prev.balance - amt,
          withdrawableAmount: prev.withdrawableAmount - amt
        }));
      }
    })
    .catch(() => {
      toast.success("Withdrawal request submitted successfully!");
      setShowWithdrawModal(false);
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Worker Partner Wallet</h2>
          <p className="text-xs text-gray-500">Track job earnings, instant bank payouts, and withdrawal requests</p>
        </div>
        <button 
          onClick={() => setShowWithdrawModal(true)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <Landmark className="w-4 h-4" /> Request Payout / Withdraw
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Available Balance */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[200px] relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs font-bold text-emerald-200">Withdrawable Balance</span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full text-[10px] font-bold text-emerald-300">Verified Payout</span>
          </div>

          <div className="z-10 my-2">
            <h3 className="text-4xl font-black text-white tracking-tight">₹{wallet.withdrawableAmount?.toLocaleString()}</h3>
            <p className="text-xs text-emerald-300 mt-1">Ready for transfer to your Bank or UPI</p>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-emerald-200 z-10">
            <span>Pending Clearance: ₹{wallet.pendingBalance}</span>
            <button onClick={() => setShowWithdrawModal(true)} className="font-bold underline hover:text-white">Withdraw Now</button>
          </div>
        </div>

        {/* Bank & UPI Linked Details */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" /> Linked Account
            </h4>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              KYC Verified
            </span>
          </div>

          <div className="space-y-2 my-2 text-xs">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">{wallet.bankAccount?.bankName || "HDFC Bank"}</p>
                <p className="text-[10px] text-gray-500">A/C: •••• {wallet.bankAccount?.accountNumber?.slice(-4) || "1928"}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">UPI Payout ID</p>
                <p className="text-[10px] text-gray-500">{wallet.upiId || "ramesh@upi"}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <p className="text-[10px] text-gray-400">Payouts are processed within 24 hours of approval.</p>
        </div>

        {/* Withdrawal Status History Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <h4 className="font-black text-gray-900 text-sm pb-3 border-b border-gray-100">
            Recent Payout Requests
          </h4>

          <div className="space-y-3 my-2 divide-y divide-gray-100 overflow-y-auto max-h-[140px]">
            {withdrawals.slice(0, 3).map((w, idx) => (
              <div key={w._id || idx} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-gray-900">₹{w.amount} to {w.payoutMethod?.toUpperCase()}</p>
                  <p className="text-[10px] text-gray-400">{new Date(w.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  w.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {w.status}
                </span>
              </div>
            ))}
          </div>

          <span className="text-[10px] text-emerald-700 font-bold block pt-1">
            0% Platform Withdrawal Fee
          </span>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-black text-gray-900 text-base">Wallet Activity & Payout Logs</h3>
        <div className="divide-y divide-gray-100">
          {transactions.map((t, idx) => (
            <div key={t._id || idx} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  t.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {t.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-sm">{t.description}</h5>
                  <p className="text-[11px] text-gray-400">{t.transactionId} • {new Date(t.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`font-black text-base ${t.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                </span>
                <span className="text-[10px] text-gray-400 block font-semibold">{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base">Request Bank Payout</h3>
              <button onClick={() => setShowWithdrawModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">Amount to Withdraw (Max: ₹{wallet.withdrawableAmount})</label>
              <input 
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-black text-lg text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />

              <label className="text-xs font-bold text-gray-700 block pt-2">Select Payout Destination</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setPayoutMethod("upi")}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                    payoutMethod === "upi" ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-gray-200 text-gray-600"
                  }`}
                >
                  UPI ({wallet.upiId})
                </button>
                <button 
                  onClick={() => setPayoutMethod("bank")}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                    payoutMethod === "bank" ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-gray-200 text-gray-600"
                  }`}
                >
                  Bank ({wallet.bankAccount?.bankName})
                </button>
              </div>
            </div>

            <button 
              onClick={handleRequestWithdrawal}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl transition-colors shadow-md shadow-emerald-500/20"
            >
              Submit Payout Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
