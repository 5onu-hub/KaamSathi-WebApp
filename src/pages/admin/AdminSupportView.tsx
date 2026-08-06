import React, { useState, useEffect } from "react";
import { 
  LifeBuoy, Search, Filter, MessageSquare, Clock, CheckCircle2, AlertTriangle, 
  UserCheck, Send, X, ChevronRight, ArrowLeft, ShieldCheck, Check, Trash2, RefreshCw
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function AdminSupportView() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, pending: 0, closed: 0, avgResponseTime: "12 mins", supportStatus: "Online" });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected Ticket for managing / replying
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [assignAgentName, setAssignAgentName] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/support/tickets?role=admin");
      if (res.data.success) {
        setTickets(res.data.data);
        setStats(res.data.stats);
      }
    } catch (err) {
      toast.error("Failed to load admin support tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await axios.put(`/api/v1/support/tickets/${id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Ticket status updated to ${newStatus}`);
        setSelectedTicket(res.data.data);
        fetchTickets();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleAssignAgent = async (id: string) => {
    if (!assignAgentName.trim()) return;
    try {
      const res = await axios.put(`/api/v1/support/tickets/${id}`, { assignedAgent: assignAgentName, status: "Assigned" });
      if (res.data.success) {
        toast.success(`Assigned to ${assignAgentName}`);
        setSelectedTicket(res.data.data);
        setAssignAgentName("");
        fetchTickets();
      }
    } catch (err) {
      toast.error("Failed to assign agent");
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      const res = await axios.post(`/api/v1/support/tickets/${selectedTicket._id}/reply`, {
        senderId: "admin_1",
        senderName: "Support Team Lead",
        senderRole: "admin",
        message: replyMessage
      });
      if (res.data.success) {
        setSelectedTicket(res.data.data);
        setReplyMessage("");
        toast.success("Reply posted successfully");
        fetchTickets();
      }
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.ticketId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Admin Support Help Desk</h1>
            <p className="text-xs text-slate-400">Manage all customer and worker support tickets, assign agents, and resolve issues.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchTickets}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-2 hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
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
          <span className="text-[11px] font-bold text-slate-400">Avg Response Time</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg font-black text-white flex items-center gap-1.5"><Clock className="w-4 h-4 text-cyan-400" /> {stats.avgResponseTime}</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">SLA Healthy</span>
          </div>
        </div>
      </div>

      {selectedTicket ? (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <button 
              onClick={() => setSelectedTicket(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Tickets List
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select 
                value={selectedTicket.status}
                onChange={e => handleUpdateStatus(selectedTicket._id || selectedTicket.ticketId, e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-bold focus:outline-none"
              >
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting for User">Waiting for User</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-bold">{selectedTicket.ticketId}</span>
                  <h3 className="text-lg font-black text-white">{selectedTicket.subject}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">Submitted by: <strong className="text-white">{selectedTicket.userName}</strong> ({selectedTicket.userRole}) • Category: {selectedTicket.category}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-400">Issue Description:</span>
                <p className="text-slate-200">{selectedTicket.description}</p>
              </div>

              {/* Conversation Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Conversation Timeline</h4>
                {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
                  selectedTicket.replies.map((rep: any, idx: number) => (
                    <div key={idx} className={`p-4 rounded-2xl text-xs space-y-1 ${
                      rep.senderRole === 'admin' 
                        ? "bg-cyan-950/30 border border-cyan-500/30 ml-auto max-w-xl" 
                        : "bg-slate-950 border border-slate-800 max-w-xl"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-400">{rep.senderName} ({rep.senderRole})</span>
                        <span className="text-[10px] text-slate-500">{new Date(rep.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-200">{rep.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No replies yet.</p>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendAdminReply} className="flex gap-2 pt-4 border-t border-slate-800">
                <input 
                  type="text" 
                  placeholder="Type official support reply..."
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Reply & Update
                </button>
              </form>
            </div>

            {/* Sidebar Details & Assignment */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Ticket Management</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Assigned Agent</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Agent Name..."
                      value={assignAgentName}
                      onChange={e => setAssignAgentName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                    <button 
                      onClick={() => handleAssignAgent(selectedTicket._id || selectedTicket.ticketId)}
                      className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                    >
                      Assign
                    </button>
                  </div>
                  <span className="text-[11px] text-cyan-400 mt-1 block">Current: {selectedTicket.assignedAgent || "Unassigned"}</span>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <span className="text-slate-500 block">Quick Actions</span>
                  <button 
                    onClick={() => handleUpdateStatus(selectedTicket._id || selectedTicket.ticketId, "Resolved")}
                    className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Mark Resolved
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedTicket._id || selectedTicket.ticketId, "Closed")}
                    className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Close Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                placeholder="Search by ID, subject, user..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting for User">Waiting for User</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              <select 
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="all">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>

              <select 
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="all">All Categories</option>
                <option value="Booking Issue">Booking Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Refund Request">Refund Request</option>
                <option value="Customer Complaint">Customer Complaint</option>
                <option value="Technical Bug">Technical Bug</option>
              </select>
            </div>
          </div>

          {/* Tickets Table / List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading support tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-900 rounded-3xl border border-slate-800">
                No tickets match the selected filters.
              </div>
            ) : (
              filteredTickets.map((tkt) => (
                <div 
                  key={tkt._id}
                  onClick={() => setSelectedTicket(tkt)}
                  className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/50 cursor-pointer transition-all shadow-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-black">{tkt.ticketId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        tkt.priority === "Urgent" ? "bg-rose-500/20 text-rose-400" :
                        tkt.priority === "High" ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-300"
                      }`}>
                        {tkt.priority}
                      </span>
                      <h4 className="font-bold text-white text-sm">{tkt.subject}</h4>
                    </div>
                    <p className="text-xs text-slate-400">User: <strong className="text-slate-300">{tkt.userName}</strong> ({tkt.userRole}) • Category: {tkt.category} • Agent: <span className="text-cyan-400">{tkt.assignedAgent || "Unassigned"}</span></p>
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
        </div>
      )}
    </div>
  );
}

export default AdminSupportView;
