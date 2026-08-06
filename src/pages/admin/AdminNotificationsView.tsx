import React, { useState } from "react";
import { Bell, Send, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export function AdminNotificationsView() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [city, setCity] = useState("all");

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please enter title and message");
      return;
    }
    toast.success(`Broadcast notification sent successfully to ${targetAudience}!`);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-gray-900">Notification & Broadcast Center</h3>
        <p className="text-xs text-gray-500">Send push announcements, targeted city-wise alerts, or schedule notifications</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-2xl space-y-6">
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Notification Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Special Weekend Bonus for Electricians!"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Audience</label>
              <select 
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden font-medium text-gray-700"
              >
                <option value="all">All Users & Workers</option>
                <option value="customers">Customers Only</option>
                <option value="workers">Workers Only</option>
                <option value="city">City Wise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City Filter</label>
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden font-medium text-gray-700"
              >
                <option value="all">All Cities (PAN India)</option>
                <option value="delhi">Delhi NCR</option>
                <option value="mumbai">Mumbai</option>
                <option value="bangalore">Bangalore</option>
                <option value="pune">Pune</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message Body</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter push notification message..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Broadcast Notification Now
          </button>
        </form>
      </div>
    </div>
  );
}
