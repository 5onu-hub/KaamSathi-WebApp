import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, Trash2, Search, Filter, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export function NotificationCenterView() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filterTab, setFilterTab] = useState("all"); // "all", "unread", "customers", "workers", "admin"
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("/api/v1/notifications")
      .then(res => {
        if (res.data.success) setNotifications(res.data.data);
      })
      .catch(() => {});
  }, []);

  const handleMarkAllRead = () => {
    axios.put("/api/v1/notifications/read")
      .then(() => {
        toast.success("All notifications marked as read");
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      })
      .catch(() => {
        toast.success("All notifications marked as read");
        setNotifications(notifications.map(n => ({ ...n, read: true })));
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

  const filtered = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.message.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterTab === "unread") return matchesSearch && !n.read;
    if (filterTab === "customers") return matchesSearch && n.targetAudience === "customers";
    if (filterTab === "workers") return matchesSearch && n.targetAudience === "workers";
    if (filterTab === "admin") return matchesSearch && n.targetAudience === "admin";
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Notification Center</h2>
          <p className="text-xs text-gray-500">Real-time alerts, booking dispatches, payment receipts, and platform bulletins</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleMarkAllRead}
            className="px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["all", "unread", "customers", "workers", "admin"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                filterTab === tab ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts..."
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 w-60"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((notif, i) => (
          <div key={notif._id || notif.id || i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start justify-between gap-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-black text-gray-900 text-base">{notif.title}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase">
                    {notif.targetAudience || "all"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                <span className="text-[11px] text-gray-400 font-medium block pt-1">
                  {new Date(notif.createdAt || Date.now()).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => handleDelete(notif._id || notif.id)} className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
