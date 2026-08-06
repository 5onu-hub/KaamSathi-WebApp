import React, { useState, useEffect, useRef } from "react";
import { X, Send, Image, Phone, ShieldCheck, CheckCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  partnerName: string;
  partnerRole: string;
  partnerAvatar: string;
}

export function ChatModal({ isOpen, onClose, bookingId, partnerName, partnerRole, partnerAvatar }: ChatModalProps) {
  const [messages, setMessages] = useState<any[]>([
    { id: "m1", sender: "worker", senderName: partnerName, text: "Hello! I am on my way to your location.", time: "10:00 AM" },
    { id: "m2", sender: "customer", senderName: "You", text: "Great! Please call me when you reach the gate.", time: "10:02 AM" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: "customer",
      senderName: "You",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInput("");

    // Simulate worker quick response after 2 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m_reply_${Date.now()}`,
          sender: "worker",
          senderName: partnerName,
          text: "Ji, noted! I am tracking the location on map now.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col h-[600px]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={partnerAvatar} alt={partnerName} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white/30" />
            <div>
              <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                {partnerName} <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </h4>
              <p className="text-[11px] text-blue-200 capitalize">{partnerRole} • Active Booking Chat</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 px-4 bg-blue-50/50 border-b border-blue-100 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="font-bold text-blue-900 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Quick Replies:
          </span>
          {["Where are you?", "Please call me", "How long will it take?", "I am at location"].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-white border border-blue-200 text-blue-700 font-semibold hover:bg-blue-600 hover:text-white transition-colors shrink-0 shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-gray-50/50">
          {messages.map((msg) => {
            const isMe = msg.sender === "customer";
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl p-3.5 space-y-1 text-xs shadow-2xs ${
                  isMe 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                }`}>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                  <div className={`flex items-center gap-1 justify-end text-[10px] ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message to your worker..."
            className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <button 
            onClick={() => handleSend()}
            className="p-3 rounded-2xl bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
