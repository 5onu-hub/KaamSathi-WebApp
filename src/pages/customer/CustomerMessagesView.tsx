import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Search, ShieldCheck, Clock, CheckCheck, ChevronRight } from "lucide-react";
import axios from "axios";

export function CustomerMessagesView() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/v1/messages?role=customer")
      .then(res => {
        if (res.data.success) setConversations(res.data.data);
      })
      .catch(() => {});
  }, []);

  const filtered = conversations.filter(c => 
    c.serviceCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.participants?.some((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Customer Messages</h2>
          <p className="text-xs text-gray-500">Secure real-time chats with accepted KaamSathi service partners</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
        {filtered.map(conv => {
          const worker = conv.participants?.find((p: any) => p.role === "worker") || { name: "Ramesh Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" };
          return (
            <div 
              key={conv._id}
              onClick={() => navigate(`/messages/${conv._id}`)}
              className="p-5 flex items-center justify-between hover:bg-gray-50/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={worker.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} alt={worker.name} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500" />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-gray-900 text-base group-hover:text-blue-600 transition-colors">{worker.name}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                      {conv.serviceCategory || "Electrician"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-1">{conv.lastMessage || "Tap to open secure chat"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-gray-400 font-semibold">{new Date(conv.lastMessageAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {conv.unreadCount?.cust_1 > 0 && (
                    <div className="mt-1 w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-black flex items-center justify-center mx-auto">
                      {conv.unreadCount.cust_1}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
