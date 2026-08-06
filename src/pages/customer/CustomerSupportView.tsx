import React, { useState, useEffect } from "react";
import { 
  LifeBuoy, Plus, Search, MessageSquare, Clock, CheckCircle2, AlertCircle, 
  HelpCircle, BookOpen, Send, Paperclip, Image as ImageIcon, ChevronRight, 
  Bot, ShieldCheck, X, Filter, ThumbsUp, ArrowLeft
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function CustomerSupportView() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "tickets" | "faq" | "kb">("dashboard");
  const [stats, setStats] = useState({ total: 0, open: 0, pending: 0, closed: 0, avgResponseTime: "14 mins", supportStatus: "Online" });
  const [tickets, setTickets] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [kb, setKb] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");

  // AI Assistant state
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiArticles, setAiArticles] = useState<any[]>([]);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // New Ticket Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    category: "Booking Issue",
    subject: "",
    description: "",
    priority: "Medium",
    bookingId: ""
  });

  // Selected Ticket detail chat view
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, fRes, kRes] = await Promise.all([
        axios.get("/api/v1/support/tickets?userId=cust_1"),
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
      toast.error("Failed to load support data");
    } finally {
      setLoading(false);
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
      toast.error("AI Assistant is currently unavailable");
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const res = await axios.post("/api/v1/support/tickets", {
        userId: "cust_1",
        userName: "Aarav Sharma",
        userRole: "customer",
        ...newTicket
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setShowCreateModal(false);
        setNewTicket({ category: "Booking Issue", subject: "", description: "", priority: "Medium", bookingId: "" });
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
        senderId: "cust_1",
        senderName: "Aarav Sharma",
        senderRole: "customer",
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
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">KaamSathi Support Center</h1>
            <p className="text-xs text-slate-400">Get instant help, browse FAQs, or chat with our 24/7 support team.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Support Ticket
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto">
        {[
          { id: "dashboard", label: "Support Overview", icon: LifeBuoy },
          { id: "tickets", label: `My Tickets (${tickets.length})`, icon: MessageSquare },
          { id: "faq", label: "FAQ Center", icon: HelpCircle },
          { id: "kb", label: "Knowledge Base", icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSelectedTicket(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" 
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SUPPORT DASHBOARD & AI ASSISTANT */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400">Total Tickets</span>
              <h3 className="text-2xl font-black text-white mt-1">{stats.total}</h3>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-lg">
              <span className="text-[11px] font-bold text-amber-400">Open Tickets</span>
              <h3 className="text-2xl font-black text-amber-400 mt-1">{stats.open}</h3>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-lg">
              <span className="text-[11px] font-bold text-cyan-400">In Progress</span>
              <h3 className="text-2xl font-black text-cyan-400 mt-1">{stats.pending}</h3>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-lg">
              <span className="text-[11px] font-bold text-emerald-400">Resolved / Closed</span>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">{stats.closed}</h3>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-lg col-span-2">
              <span className="text-[11px] font-bold text-slate-400">Avg Response Time & Status</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-black text-white flex items-center gap-1.5"><Clock className="w-4 h-4 text-cyan-400" /> {stats.avgResponseTime}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> {stats.supportStatus}
                </span>
              </div>
            </div>
          </div>

          {/* AI Help Assistant Section */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 rounded-3xl border border-cyan-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">KaamSathi AI Help Assistant</h3>
                <p className="text-xs text-slate-400">Ask any question about bookings, payments, or services for instant answers.</p>
              </div>
            </div>

            <form onSubmit={handleAskAi} className="flex gap-2 max-w-3xl">
              <input 
                type="text" 
                placeholder='e.g., "How do I cancel my booking?" or "How are refunds handled?"'
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button 
                type="submit"
                disabled={isAskingAi}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all"
              >
                {isAskingAi ? "Thinking..." : <><Send className="w-4 h-4" /> Ask AI</>}
              </button>
            </form>

            {aiAnswer && (
              <div className="mt-6 bg-slate-950/90 border border-cyan-500/20 rounded-2xl p-5 space-y-4 max-w-3xl">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">AI Recommendation</span>
                  <p className="text-xs text-slate-200 leading-relaxed">{aiAnswer}</p>
                </div>

                {aiArticles.length > 0 && (
                  <div className="border-t border-slate-800 pt-3 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400">Suggested FAQ Articles:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {aiArticles.map((art: any) => (
                        <div key={art._id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                          <span className="font-bold text-white block">{art.question}</span>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{art.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TICKETS LIST & DETAILED CHAT */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          {selectedTicket ? (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
              <button 
                onClick={() => setSelectedTicket(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 w-fit"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Tickets
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-white">{selectedTicket.subject}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-black">{selectedTicket.ticketId}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Category: {selectedTicket.category} • Priority: {selectedTicket.priority}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedTicket.status === "Open" ? "bg-amber-500/20 text-amber-400" :
                    selectedTicket.status === "In Progress" ? "bg-cyan-500/20 text-cyan-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Initial description */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-xs space-y-1">
                <span className="font-bold text-slate-400">Initial Description:</span>
                <p className="text-slate-200">{selectedTicket.description}</p>
              </div>

              {/* Conversation Timeline */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversation Timeline</h4>
                {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
                  selectedTicket.replies.map((rep: any, idx: number) => (
                    <div key={idx} className={`p-4 rounded-2xl text-xs space-y-1 max-w-xl ${
                      rep.senderRole === 'customer' 
                        ? "bg-cyan-950/30 border border-cyan-500/30 ml-auto" 
                        : "bg-slate-950 border border-slate-800 mr-auto"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-400">{rep.senderName} ({rep.senderRole})</span>
                        <span className="text-[10px] text-slate-500">{new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-200">{rep.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No replies yet. Our support team will respond shortly.</p>
                )}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="flex gap-2 pt-4 border-t border-slate-800">
                <input 
                  type="text" 
                  placeholder="Type your reply to support team..."
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="font-bold text-white text-sm">No Support Tickets Found</h4>
                  <p className="text-xs text-slate-400 mt-1">Need help with a booking or payment? Create a ticket above.</p>
                </div>
              ) : (
                tickets.map((tkt) => (
                  <div 
                    key={tkt._id}
                    onClick={() => setSelectedTicket(tkt)}
                    className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/50 cursor-pointer transition-all shadow-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-black">{tkt.ticketId}</span>
                        <h4 className="font-bold text-white text-sm">{tkt.subject}</h4>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{tkt.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span>Category: {tkt.category}</span>
                        <span>•</span>
                        <span>Priority: {tkt.priority}</span>
                        <span>•</span>
                        <span>Updated: {new Date(tkt.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        tkt.status === "Open" ? "bg-amber-500/20 text-amber-400" :
                        tkt.status === "In Progress" ? "bg-cyan-500/20 text-cyan-400" : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {tkt.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FAQ CENTER */}
      {activeTab === "faq" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {["all", "Bookings", "Workers", "Payments", "Getting Started", "Account Issue"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                    faqCategory === cat ? "bg-cyan-500 text-slate-950" : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.filter(f => {
              const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesCat = faqCategory === "all" || f.category === faqCategory;
              return matchesSearch && matchesCat;
            }).map((faq) => (
              <div key={faq._id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase">{faq.category}</span>
                  <span className="text-[11px] text-slate-500">{faq.views} views</span>
                </div>
                <h4 className="font-bold text-white text-sm">{faq.question}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>Was this helpful?</span>
                  <button onClick={() => toast.success("Thank you for your feedback!")} className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold">
                    <ThumbsUp className="w-3.5 h-3.5" /> {faq.helpfulCount}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: KNOWLEDGE BASE */}
      {activeTab === "kb" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kb.map((article) => (
            <div key={article._id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">{article.category}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
              </div>
              <h3 className="text-lg font-black text-white">{article.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{article.content}</p>
              <button onClick={() => toast.success(`Opened ${article.title}`)} className="text-xs text-cyan-400 font-bold flex items-center gap-1 hover:underline pt-2">
                Read full article <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-white">Create Support Ticket</h3>
              <p className="text-xs text-slate-400 mt-0.5">Submit your query or issue and our support team will assist promptly.</p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Issue Category</label>
                <select 
                  value={newTicket.category}
                  onChange={e => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                >
                  <option value="Booking Issue">Booking Issue</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Refund Request">Refund Request</option>
                  <option value="Customer Complaint">Customer Complaint</option>
                  <option value="Technical Bug">Technical Bug</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="e.g. Issue with booking schedule"
                  value={newTicket.subject}
                  onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Priority</label>
                  <select 
                    value={newTicket.priority}
                    onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Booking ID (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. bk_101"
                    value={newTicket.bookingId}
                    onChange={e => setNewTicket({ ...newTicket, bookingId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Provide detailed information about your issue..."
                  value={newTicket.description}
                  onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerSupportView;
