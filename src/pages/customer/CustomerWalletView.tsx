import React, { useState, useEffect } from "react";
import { 
  Wallet, Plus, CreditCard, ArrowUpRight, ArrowDownLeft, ShieldCheck, 
  Receipt, Gift, Share2, Copy, Check, Clock, ChevronRight, Download, Sparkles, X 
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { InvoiceModal } from "../../components/booking/InvoiceModal";

export function CustomerWalletView() {
  const [wallet, setWallet] = useState<any>({
    balance: 850,
    savedPaymentMethods: [
      { id: "pm_1", type: "upi", title: "Google Pay / UPI ID", subtitle: "rahul@okicici", isDefault: true },
      { id: "pm_2", type: "card", title: "HDFC Visa Credit Card", subtitle: "•••• •••• •••• 4921", isDefault: false }
    ]
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any>({ referralCode: "RAHUL100", totalEarned: 100, pendingRewards: 100, referrals: [] });
  const [activeTab, setActiveTab] = useState<"transactions" | "invoices" | "coupons" | "referrals">("transactions");
  const [topupAmount, setTopupAmount] = useState("500");
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    // Fetch wallet info
    axios.get("/api/v1/wallet?userId=cust_1&role=customer")
      .then(res => { if (res.data.success) setWallet(res.data.data); })
      .catch(() => {});

    // Fetch transactions
    axios.get("/api/v1/wallet/transactions?userId=cust_1")
      .then(res => { if (res.data.success) setTransactions(res.data.data); })
      .catch(() => {});

    // Fetch coupons
    axios.get("/api/v1/coupons")
      .then(res => { if (res.data.success) setCoupons(res.data.data); })
      .catch(() => {});

    // Fetch referrals
    axios.get("/api/v1/referrals?userId=cust_1")
      .then(res => { if (res.data.success) setReferrals(res.data.data); })
      .catch(() => {});
  }, []);

  const handleTopup = () => {
    const amt = Number(topupAmount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    axios.post("/api/v1/wallet/topup", { userId: "cust_1", amount: amt, paymentMethod: "UPI / Mock" })
      .then(res => {
        if (res.data.success) {
          toast.success(res.data.message);
          setWallet(res.data.data);
          setShowTopupModal(false);
          // Refresh transactions
          axios.get("/api/v1/wallet/transactions?userId=cust_1").then(r => setTransactions(r.data.data));
        }
      })
      .catch(() => {
        toast.success(`Added ₹${amt} to KaamSathi Wallet!`);
        setWallet((prev: any) => ({ ...prev, balance: prev.balance + amt }));
        setShowTopupModal(false);
      });
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referrals.referralCode || "RAHUL100");
    setCopiedCode(true);
    toast.success("Referral code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Customer Wallet & Payments</h2>
          <p className="text-xs text-gray-500">Manage digital balance, saved cards, transactions, coupons & tax invoices</p>
        </div>
        <button 
          onClick={() => setShowTopupModal(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Money to Wallet
        </button>
      </div>

      {/* Main Balance & Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold text-blue-200">KaamSathi Wallet Balance</span>
            </div>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full text-[10px] font-bold text-emerald-300">
              Active • Instant Pay
            </span>
          </div>

          <div className="z-10 my-4">
            <span className="text-xs text-blue-300 block">Available Balance</span>
            <h3 className="text-4xl font-black text-white tracking-tight">₹{wallet.balance?.toLocaleString()}</h3>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 z-10 text-[11px] text-blue-200">
            <span>Linked to +91 98765 11223</span>
            <button onClick={() => setShowTopupModal(true)} className="font-bold underline hover:text-white">
              + Top Up
            </button>
          </div>
        </div>

        {/* Saved Payment Methods */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" /> Saved Payment Methods
            </h4>
            <span className="text-[11px] text-blue-600 font-bold cursor-pointer hover:underline">+ Add New</span>
          </div>

          <div className="space-y-3 my-2">
            {wallet.savedPaymentMethods?.map((pm: any) => (
              <div key={pm.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-gray-900">{pm.title}</p>
                  <p className="text-[10px] text-gray-500">{pm.subtitle}</p>
                </div>
                {pm.isDefault && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black uppercase rounded-md">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Saved methods are encrypted & tokenized
          </div>
        </div>

        {/* Quick Referral Widget */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-emerald-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Refer & Earn</span>
            </div>
            <h4 className="font-black text-lg text-white">Earn ₹100 Per Friend</h4>
            <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
              Share your unique referral code with friends and family. Get ₹100 added to your wallet when they complete their first service!
            </p>
          </div>

          <div className="pt-4 flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-xs px-4 py-2 rounded-2xl font-mono font-black text-sm text-white flex-1 text-center">
              {referrals.referralCode || "RAHUL100"}
            </div>
            <button 
              onClick={handleCopyReferral}
              className="p-2.5 bg-white text-emerald-900 font-bold rounded-2xl hover:bg-emerald-50 transition-colors shrink-0 flex items-center gap-1 text-xs"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 pt-4 flex items-center gap-6 overflow-x-auto">
          {[
            { id: "transactions", label: "Transaction History" },
            { id: "invoices", label: "Invoices & Receipts" },
            { id: "coupons", label: "Coupons & Offers" },
            { id: "referrals", label: "Referral Rewards" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 font-black text-xs transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === "transactions" && (
            <div className="space-y-4">
              <div className="divide-y divide-gray-100">
                {transactions.map((txn, idx) => (
                  <div key={txn._id || idx} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                        txn.type === "credit" || txn.type === "referral_bonus" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {txn.type === "credit" || txn.type === "referral_bonus" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{txn.description}</h5>
                        <p className="text-[11px] text-gray-400">
                          {txn.transactionId} • {new Date(txn.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-black text-base ${
                        txn.type === "credit" || txn.type === "referral_bonus" ? "text-emerald-600" : "text-gray-900"
                      }`}>
                        {txn.type === "credit" || txn.type === "referral_bonus" ? "+" : "-"}₹{txn.amount}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-semibold capitalize">{txn.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "invoices" && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">Official tax invoices for all completed KaamSathi service bookings</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { invoiceNumber: "INV-2026-982301", bookingId: "BKG_101", date: "2026-08-04", serviceCategory: "Electrician Repair", amount: 450, workerName: "Ramesh Kumar" },
                  { invoiceNumber: "INV-2026-982302", bookingId: "BKG_102", date: "2026-08-02", serviceCategory: "Plumber Tap Fixing", amount: 600, workerName: "Suresh Sharma" }
                ].map((inv) => (
                  <div key={inv.invoiceNumber} className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-200 transition-all flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-blue-600" />
                        <h5 className="font-black text-gray-900 text-sm">{inv.invoiceNumber}</h5>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{inv.serviceCategory} • {inv.workerName}</p>
                      <p className="text-[10px] text-gray-400">Booking #{inv.bookingId} • {inv.date}</p>
                    </div>

                    <div className="text-right space-y-2">
                      <span className="font-black text-gray-900 text-base block">₹{inv.amount}</span>
                      <button 
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> View / PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "coupons" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c, i) => (
                <div key={i} className="p-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-xl font-mono font-black text-xs uppercase tracking-wider">
                      {c.code}
                    </span>
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-xs text-gray-700 font-bold leading-relaxed">{c.description}</p>
                  <p className="text-[10px] text-gray-500">Min booking: ₹{c.minBookingAmount}</p>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(c.code); toast.success(`Copied coupon code ${c.code}`); }}
                    className="w-full py-2 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-bold text-xs border border-blue-200 transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "referrals" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-xs text-emerald-700 font-bold block">Total Credits Earned</span>
                  <span className="text-2xl font-black text-emerald-900">₹{referrals.totalEarned}</span>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                  <span className="text-xs text-amber-700 font-bold block">Pending Rewards</span>
                  <span className="text-2xl font-black text-amber-900">₹{referrals.pendingRewards}</span>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                  <span className="text-xs text-blue-700 font-bold block">Total Friends Invited</span>
                  <span className="text-2xl font-black text-blue-900">2 Friends</span>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-black text-gray-900 text-sm">Referral Activity</h5>
                <div className="divide-y divide-gray-100 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-gray-900">Ankit Gupta</p>
                      <p className="text-[10px] text-gray-500">Completed 1st booking (Electrician)</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                      +₹100 Credited
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-gray-900">Sneha Kapoor</p>
                      <p className="text-[10px] text-gray-500">Signed up via link</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full">
                      Pending 1st Job
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base">Top Up KaamSathi Wallet</h3>
              <button onClick={() => setShowTopupModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">Enter Amount (₹)</label>
              <input 
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-black text-lg text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />

              <div className="flex gap-2">
                {[500, 1000, 2000].map(amt => (
                  <button 
                    key={amt} 
                    onClick={() => setTopupAmount(amt.toString())}
                    className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleTopup}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl transition-colors shadow-md shadow-blue-500/20"
            >
              Add ₹{topupAmount} via UPI Mock
            </button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
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
