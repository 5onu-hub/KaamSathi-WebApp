import React, { useState, useEffect } from "react";
import { 
  LifeBuoy, Plus, Search, MessageSquare, Clock, CheckCircle2, AlertCircle, 
  HelpCircle, BookOpen, Send, ChevronRight, Bot, ShieldCheck, X, ThumbsUp, ArrowLeft
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function WorkerSupportView() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "tickets" | "faq" | "kb">("dashboard");
  const [stats, setStats] = useState({ total: 0, open: 0, pending: 0, closed: 0, avgResponseTime: "12 mins", supportStatus: "Online" });
  const [tickets, setTickets] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [kb, setKb] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");

  // AI Assistant
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiArticles, setAiArticles] = useState<any[]>([]);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // New Ticket Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    category: "Payment Issue",
    subject: "",
    description: "",
    priority: "High",
    bookingId: ""
  });

  // Selected Ticket detail
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tRes, fRes, kRes] = await Promise.all([
        axios.get("/api/v1/support/tickets?userId=worker_1"),
        axios.get("/api/v1/support/faqs"),
        axios.get("/api/v1/support/knowledge-base")
      ]);
      if (tRes.data.success) {
        setTickets(tRes.data.data);
        setStats(tRes.data.stats);
      }
      if (fRes.data.success) setFaqs(fRes.data.data);
      if (kRes.data.success) setKb(kRes.data.data);
    } catch (err) {
      toast.error("Failed to load worker support data");
    }
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAskingAi(true);
    try {
      const res = await axios.post("/api/v1/support/ai-help", { query: aiQuery });
      if (res.data.success) {
        setAiAnswer(res.data.answer);
        setAiArticles(res.data.suggestedArticles);
      }
    } catch (err) {
      toast.error("AI Assistant unavailable");
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/support/tickets", {
        userId: "worker_1",
        userName: "Rajesh Kumar",
        userRole: "worker",
        ...newTicket
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setShowCreateModal(false);
        setNewTicket({ category: "Payment Issue", subject: "", description: "", priority: "High", bookingId: "" });
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to create ticket");
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      const res = await axios.post(`/api/v1/support/tickets/${selectedTicket._id}/reply`, {
        senderId: "worker_1",
        senderName: "Rajesh Kumar",
        senderRole: "worker",
        message: replyMessage
      });
      if (res.data.success) {
        setSelectedTicket(res.data.data);
        setReplyMessage("");
        toast.success("Reply sent");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 space-y-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Worker Priority Support Desk</h1>
            <p className="text-xs text-slate-400">Get priority assistance for payouts, verification, and job scheduling.</p>
          </div>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Raise Worker Ticket
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto">
        {[
          { id: "dashboard", label: "Support Overview", icon: LifeBuoy },
          { id: "tickets", label: `My Tickets (${tickets.length})`, icon: MessageSquare },
          { id: "faq", label: "Worker FAQs", icon: HelpCircle },
          { id: "kb", label: "Knowledge Base", icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSelectedTicket(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" 
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400">Total Tickets</span>
              <h3 className="text-2xl font-black text-white mt-1">{stats.total}</h3>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <span className="text-[11px] font-bold text-amber-400">Open Tickets</span>
              <h3 className="text-2xl font-black text-amber-400 mt-1">{stats.open}</h3>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <span className="text-[11px] font-bold text-cyan-400">In Progress</span>
              <h3 className="text-2xl font-black text-cyan-400 mt-1">{stats.pending}</h3>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <span className="text-[11px] font-bold text-emerald-400">Resolved</span>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">{stats.closed}</h3>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 col-span-2">
              <span className="text-[11px] font-bold text-slate-400">Worker Response SLA</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-black text-white flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> {stats.avgResponseTime}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Priority Active</span>
              </div>
            </div>
          </div>

          {/* AI Help */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 rounded-3xl border border-amber-500/30 p-6 md:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Worker AI Support Assistant</h3>
                <p className="text-xs text-slate-400">Ask about instant payouts, verification badges, or customer disputes.</p>
              </div>
            </div>

            <form onSubmit={handleAskAi} className="flex gap-2 max-w-3xl">
              <input 
                type="text" 
                placeholder='e.g., "When are weekly payouts processed?"'
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button 
                type="submit"
                disabled={isAskingAi}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                {isAskingAi ? "Thinking..." : <><Send className="w-4 h-4" /> Ask AI</>}
              </button>
            </form>

            {aiAnswer && (
              <div className="bg-slate-950 border border-amber-500/20 rounded-2xl p-5 space-y-3 max-w-3xl text-xs">
                <p className="text-slate-200">{aiAnswer}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tickets tab */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          {selectedTicket ? (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
              <button 
                onClick={() => setSelectedTicket(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 w-fit"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Tickets
              </button>

              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white">{selectedTicket.subject}</h3>
                  <span className="text-xs text-amber-400 font-bold">{selectedTicket.ticketId}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase">{selectedTicket.status}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-400">Description:</span>
                <p className="text-slate-200">{selectedTicket.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Conversation</h4>
                {selectedTicket.replies?.map((rep: any, idx: number) => (
                  <div key={idx} className={`p-3 rounded-xl text-xs max-w-lg ${rep.senderRole === 'worker' ? 'bg-amber-950/30 border border-amber-500/30 ml-auto' : 'bg-slate-950 border border-slate-800'}`}>
                    <span className="font-bold text-amber-400 block mb-0.5">{rep.senderName} ({rep.senderRole})</span>
                    <p className="text-slate-200">{rep.message}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendReply} className="flex gap-2 pt-4 border-t border-slate-800">
                <input 
                  type="text" 
                  placeholder="Type reply..."
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">Send</button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((tkt) => (
                <div key={tkt._id} onClick={() => setSelectedTicket(tkt)} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center justify-between cursor-pointer hover:border-amber-500/50">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black">{tkt.ticketId}</span>
                    <h4 className="font-bold text-white text-sm mt-1">{tkt.subject}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Category: {tkt.category} • Status: {tkt.status}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">{faq.category}</span>
              <h4 className="font-bold text-white text-sm">{faq.question}</h4>
              <p className="text-xs text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* KB Tab */}
      {activeTab === "kb" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kb.map((article) => (
            <div key={article._id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">{article.category}</span>
              <h3 className="text-lg font-black text-white">{article.title}</h3>
              <p className="text-xs text-slate-300">{article.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-black text-white">Create Worker Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                <select value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Booking Issue">Booking Issue</option>
                  <option value="Verification Issue">Verification Issue</option>
                  <option value="Account Issue">Account Issue</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subject</label>
                <input type="text" placeholder="Subject..." value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea rows={4} placeholder="Details..." value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkerSupportView;
