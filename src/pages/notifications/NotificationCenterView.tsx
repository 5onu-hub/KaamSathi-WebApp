import React, { useState, useEffect } from "react";
import { 
  Bell, CheckCheck, Trash2, Search, Filter, ShieldAlert, Sparkles, CheckCircle2, 
  Clock, DollarSign, MessageSquare, Briefcase, Star, Gift, ShieldCheck, Megaphone, 
  Settings, ArrowRight, Activity, X, Volume2, VolumeX, Smartphone, Mail, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const socket = io();

export function NotificationCenterView() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filterTab, setFilterTab] = useState("all"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "timeline" | "settings">("list");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Settings state
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsAlerts: false,
    sound: true,
    vibration: true,
    bookingAlerts: true,
    offers: true,
    aiSuggestions: true
  });

  useEffect(() => {
    fetchNotifications();

    socket.on("notification:new", (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      if (soundEnabled) {
        playNotificationSound();
      }
      toast.success(newNotif.title, { icon: "🔔" });
    });

    socket.on("notification:update", (updated) => {
      setNotifications(prev => prev.map(n => (n._id === updated._id || n.id === updated.id) ? updated : n));
    });

    socket.on("notification:delete", ({ id }) => {
      setNotifications(prev => prev.filter(n => n._id !== id && n.id !== id));
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:update");
      socket.off("notification:delete");
    };
  }, [soundEnabled]);

  const fetchNotifications = () => {
    axios.get("/api/v1/notifications")
      .then(res => {
        if (res.data.success) {
          setNotifications(res.data.data);
        }
      })
      .catch(() => {
        // Fallback mock notifications
        setNotifications([
          {
            _id: "notif_1",
            title: "Booking Accepted!",
            message: "Ramesh Kumar has accepted your booking for Electrician service. You can now chat and track arrival.",
            targetAudience: "customers",
            category: "Bookings",
            priority: "High",
            read: false,
            createdAt: new Date(Date.now() - 3600000)
          },
          {
            _id: "notif_2",
            title: "Worker Arrived & Started",
            message: "Electrician Ramesh Kumar has arrived at your location in South Extension.",
            targetAudience: "customers",
            category: "Bookings",
            priority: "Urgent",
            read: false,
            createdAt: new Date(Date.now() - 1800000)
          },
          {
            _id: "notif_3",
            title: "New Job Request Assigned",
            message: "You have received a high-surge booking in Lajpat Nagar. Estimated budget: ₹550.",
            targetAudience: "workers",
            category: "Job Requests",
            priority: "Urgent",
            read: false,
            createdAt: new Date(Date.now() - 600000)
          },
          {
            _id: "notif_4",
            title: "Payment Credited Successfully",
            message: "₹450 has been credited to your KaamSathi secure partner wallet.",
            targetAudience: "workers",
            category: "Payments",
            priority: "Medium",
            read: true,
            createdAt: new Date()
          },
          {
            _id: "notif_5",
            title: "AI Peak Demand Alert",
            message: "AI Saathi predicts 40% surge in electrical repair requests between 5 PM and 8 PM.",
            targetAudience: "all",
            category: "AI Suggestions",
            priority: "Medium",
            read: false,
            createdAt: new Date(Date.now() - 7200000)
          }
        ]);
      });
  };

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // AudioContext blocked or unsupported
    }
  };

  const handleMarkAllRead = () => {
    axios.put("/api/v1/notifications/read")
      .then(() => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success("All notifications marked as read");
      })
      .catch(() => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success("All notifications marked as read");
      });
  };

  const handleDelete = (id: string) => {
    axios.delete(`/api/v1/notifications/${id}`)
      .then(() => {
        setNotifications(notifications.filter(n => n._id !== id && n.id !== id));
        toast.success("Notification deleted");
      })
      .catch(() => {
        setNotifications(notifications.filter(n => n._id !== id && n.id !== id));
        toast.success("Notification deleted");
      });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Bookings": return Briefcase;
      case "Payments": return DollarSign;
      case "Messages": return MessageSquare;
      case "Job Requests": return Briefcase;
      case "Reviews": return Star;
      case "Offers": return Gift;
      case "Verification": return ShieldCheck;
      case "Announcements": return Megaphone;
      case "AI Suggestions": return Sparkles;
      default: return Bell;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-rose-100 text-rose-700 border-rose-200";
      case "High": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filtered = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterTab === "unread") return matchesSearch && !n.read;
    if (filterTab === "Bookings") return matchesSearch && n.category === "Bookings";
    if (filterTab === "Payments") return matchesSearch && n.category === "Payments";
    if (filterTab === "Job Requests") return matchesSearch && n.category === "Job Requests";
    if (filterTab === "AI Suggestions") return matchesSearch && n.category === "AI Suggestions";
    return matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Notification & Activity Center</h2>
          <p className="text-xs text-gray-500">Real-time alerts, booking dispatches, payment receipts, and AI suggestions</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              soundEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
            title={soundEnabled ? "Sound Enabled" : "Sound Muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button 
            onClick={handleMarkAllRead}
            className="px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
          >
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        </div>
      </div>

      {/* View Mode & Filter Controls */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "list", label: "Notifications List", icon: Bell },
            { id: "timeline", label: "Activity Timeline", icon: Activity },
            { id: "settings", label: "Alert Settings", icon: Settings }
          ].map(m => {
            const Icon = m.icon;
            const active = viewMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  active ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" /> {m.label}
              </button>
            );
          })}
        </div>

        {viewMode === "list" && (
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 w-60 shadow-xs"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: NOTIFICATIONS LIST */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: "all", label: "All Alerts" },
              { id: "unread", label: `Unread (${notifications.filter(n => !n.read).length})` },
              { id: "Bookings", label: "Bookings" },
              { id: "Payments", label: "Payments" },
              { id: "Job Requests", label: "Job Requests" },
              { id: "AI Suggestions", label: "AI Insights" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterTab === tab.id ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-2">
                <Bell className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">No notifications found</h3>
                <p className="text-xs text-gray-400">You are fully caught up with all updates and dispatches.</p>
              </div>
            ) : (
              filtered.map((notif, i) => {
                const Icon = getCategoryIcon(notif.category);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={notif._id || notif.id || i} 
                    className={`bg-white rounded-3xl p-6 border transition-all shadow-sm flex items-start justify-between gap-4 hover:shadow-md ${
                      notif.read ? "border-gray-100 bg-white" : "border-blue-200 bg-blue-50/30 ring-1 ring-blue-500/10"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                        notif.read ? "bg-gray-100 text-gray-600" : "bg-blue-600 text-white shadow-md shadow-blue-500/20 animate-pulse"
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-black text-gray-900 text-base">{notif.title}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getPriorityBadge(notif.priority || "Medium")}`}>
                            {notif.priority || "Medium"}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                            {notif.category || "General"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                        <span className="text-[11px] text-gray-400 font-medium block pt-1">
                          {new Date(notif.createdAt || Date.now()).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDelete(notif._id || notif.id)} 
                        className="p-2.5 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVITY TIMELINE */}
      {viewMode === "timeline" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-black text-gray-900">Recent Activity Progression</h3>
            <p className="text-xs text-gray-500">Chronological lifecycle of recent bookings, dispatches, and secure payments.</p>
          </div>

          <div className="relative pl-6 border-l-2 border-blue-600 space-y-8 ml-4">
            {[
              { title: "Review Submitted", time: "2 hours ago", desc: "Customer rated 5 stars for Electrician wiring repair.", icon: Star, color: "bg-amber-500" },
              { title: "Payment Completed", time: "2.5 hours ago", desc: "₹450 securely transferred to wallet via UPI.", icon: DollarSign, color: "bg-emerald-600" },
              { title: "Worker Started Job", time: "3 hours ago", desc: "Ramesh Kumar commenced electrical switchboard repair.", icon: Activity, color: "bg-blue-600" },
              { title: "Worker Accepted", time: "3.5 hours ago", desc: "Booking confirmed in South Extension, New Delhi.", icon: Briefcase, color: "bg-indigo-600" },
              { title: "Booking Created", time: "4 hours ago", desc: "Customer Rahul Verma initiated booking #KS-BKG-8821.", icon: CheckCircle2, color: "bg-gray-600" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative group">
                  <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full ${item.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-gray-900 text-sm">{item.title}</h4>
                      <span className="text-[11px] font-semibold text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* VIEW 3: SETTINGS */}
      {viewMode === "settings" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900">Notification & Alert Preferences</h3>
            <p className="text-xs text-gray-500">Configure push notifications, sound effects, SMS alerts, and AI recommendation rules.</p>
          </div>

          <div className="space-y-4">
            {[
              { key: "pushNotifications", label: "Push Notifications", desc: "Receive real-time push alerts on web and mobile app", icon: Smartphone },
              { key: "emailNotifications", label: "Email Notifications", desc: "Receive weekly summary reports and invoice receipts", icon: Mail },
              { key: "sound", label: "Notification Sound Chime", desc: "Play subtle audio chime when new message or alert arrives", icon: Volume2 },
              { key: "bookingAlerts", label: "Booking & Dispatch Alerts", desc: "Get instant alerts for new dispatches and status changes", icon: Briefcase },
              { key: "aiSuggestions", label: "AI Saathi Insights", desc: "Receive smart earnings tips and peak hour demand alerts", icon: Sparkles }
            ].map(item => {
              const Icon = item.icon;
              const val = (settings as any)[item.key];
              return (
                <div key={item.key} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={val}
                    onChange={() => {
                      setSettings({ ...settings, [item.key]: !val });
                      toast.success("Preferences updated");
                    }}
                    className="w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default NotificationCenterView;
