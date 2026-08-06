import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Send, Image, Paperclip, MapPin, Smile, MoreVertical, Phone, ArrowLeft, 
  Check, CheckCheck, Trash2, Copy, CornerUpLeft, ShieldCheck, AlertCircle, Clock 
} from "lucide-react";
import io from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const socket = io();

export function ChatRoomView() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [bookingStatus, setBookingStatus] = useState("accepted"); // "accepted", "completed", "cancelled"
  const [partnerInfo, setPartnerInfo] = useState({ name: "Ramesh Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", category: "Electrician", online: true, lastSeen: "Today at 10:45 AM" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  const currentUser = { id: "cust_1", name: "Rahul Verma", role: "customer" };

  useEffect(() => {
    if (!conversationId) return;
    socket.emit("join_room", conversationId);

    // Fetch initial messages
    axios.get(`/api/v1/messages/${conversationId}`)
      .then(res => {
        if (res.data.success) {
          setMessages(res.data.data);
        }
      })
      .catch(() => {
        // Fallback mock messages
        setMessages([
          { _id: "m1", conversationId, senderId: "cust_1", senderName: "Rahul Verma", senderRole: "customer", text: "Hi Ramesh, when will you arrive for the switchboard repair?", read: true, delivered: true, createdAt: new Date(Date.now() - 3600000) },
          { _id: "m2", conversationId, senderId: "w1", senderName: "Ramesh Kumar", senderRole: "worker", text: "I am on my way, will reach in 10 mins.", read: true, delivered: true, createdAt: new Date(Date.now() - 1800000) }
        ]);
      });

    socket.on("message:receive", (msg) => {
      setMessages(prev => [...prev, msg]);
      scrollToBottom();
    });

    socket.on("message:typing", ({ userName }) => {
      setIsTyping(true);
      setTypingUser(userName);
    });

    socket.on("message:stopTyping", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("message:receive");
      socket.off("message:typing");
      socket.off("message:stopTyping");
    };
  }, [conversationId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    socket.emit("message:typing", { conversationId, userId: currentUser.id, userName: currentUser.name });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("message:stopTyping", { conversationId, userId: currentUser.id });
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (bookingStatus === "completed" || bookingStatus === "cancelled") {
      toast.error("Chat is read-only because booking is completed or cancelled.");
      return;
    }

    const payload = {
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: inputText,
      createdAt: new Date()
    };

    axios.post("/api/v1/messages", payload)
      .then(res => {
        if (res.data.success) {
          const sentMsg = res.data.data;
          setMessages(prev => [...prev, sentMsg]);
          socket.emit("message:send", sentMsg);
          setInputText("");
          socket.emit("message:stopTyping", { conversationId, userId: currentUser.id });
        }
      })
      .catch(() => {
        // Fallback local send
        const localMsg = { _id: Date.now().toString(), ...payload };
        setMessages(prev => [...prev, localMsg]);
        socket.emit("message:send", localMsg);
        setInputText("");
      });
  };

  const handleDeleteMessage = (id: string) => {
    axios.delete(`/api/v1/messages/${id}`)
      .then(() => {
        setMessages(messages.filter(m => m._id !== id));
        toast.success("Message deleted");
      })
      .catch(() => {
        setMessages(messages.filter(m => m._id !== id));
        toast.success("Message deleted");
      });
  };

  const handleSendMedia = (type: "image" | "document" | "location") => {
    if (bookingStatus === "completed" || bookingStatus === "cancelled") {
      toast.error("Chat is read-only.");
      return;
    }

    let text = type === "image" ? "📷 [Shared Image]" : type === "document" ? "📄 [Shared Document/Invoice]" : "📍 [Shared Live Location: South Delhi]";
    const payload = {
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      mediaType: type,
      mediaUrl: type === "image" ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400" : undefined,
      createdAt: new Date()
    };

    axios.post("/api/v1/messages", payload)
      .then(res => {
        if (res.data.success) {
          const sentMsg = res.data.data;
          setMessages(prev => [...prev, sentMsg]);
          socket.emit("message:send", sentMsg);
          toast.success(`Shared ${type} successfully`);
        }
      })
      .catch(() => {
        const localMsg = { _id: Date.now().toString(), ...payload };
        setMessages(prev => [...prev, localMsg]);
        socket.emit("message:send", localMsg);
        toast.success(`Shared ${type} successfully`);
      });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50 shadow-xl border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-xs z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <img src={partnerInfo.avatar} alt={partnerInfo.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base">{partnerInfo.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className="font-semibold text-emerald-600">{partnerInfo.category} Partner</span> • 
              <span>{isTyping ? <strong className="text-blue-600 animate-pulse">{typingUser} is typing...</strong> : partnerInfo.lastSeen}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => toast.success("Initiating secure audio call...")} className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Secure
          </div>
        </div>
      </div>

      {/* Read-only banner if booking is completed or cancelled */}
      {(bookingStatus === "completed" || bookingStatus === "cancelled") && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Chat is read-only because this booking has been {bookingStatus}.
          </div>
          <button onClick={() => setBookingStatus("accepted")} className="underline font-semibold hover:text-amber-900">
            [Simulate Active]
          </button>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#efeae2]">
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === currentUser.id;
          return (
            <div key={msg._id || index} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md rounded-2xl px-5 py-3.5 shadow-sm space-y-1.5 relative group ${
                isOwn ? "bg-[#d9fdd3] text-gray-900 rounded-tr-xs" : "bg-white text-gray-900 rounded-tl-xs"
              }`}>
                {!isOwn && <p className="text-[11px] font-bold text-blue-600">{msg.senderName}</p>}
                
                {msg.mediaUrl && (
                  <img src={msg.mediaUrl} alt="Shared media" className="rounded-xl w-full max-h-64 object-cover mb-2" />
                )}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                <div className="flex items-center justify-end gap-1.5 text-[10px] text-gray-500 pt-1">
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isOwn && <CheckCheck className="w-3.5 h-3.5 text-blue-600" />}
                </div>

                {/* Message action dropdown on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-xs rounded-lg p-1 shadow-md flex items-center gap-1">
                  <button onClick={() => { navigator.clipboard.writeText(msg.text); toast.success("Copied to clipboard"); }} title="Copy" className="p-1 hover:bg-gray-100 rounded text-gray-600">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {isOwn && (
                    <button onClick={() => handleDeleteMessage(msg._id)} title="Delete" className="p-1 hover:bg-rose-50 rounded text-rose-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button onClick={() => handleSendMedia("image")} title="Share Image" className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500">
            <Image className="w-5 h-5" />
          </button>
          <button onClick={() => handleSendMedia("document")} title="Share Document" className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500">
            <Paperclip className="w-5 h-5" />
          </button>
          <button onClick={() => handleSendMedia("location")} title="Share Location" className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500">
            <MapPin className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
          <input 
            type="text"
            value={inputText}
            onChange={handleInputChange}
            disabled={bookingStatus === "completed" || bookingStatus === "cancelled"}
            placeholder={bookingStatus === "completed" ? "Chat is read-only (completed)" : "Type a secure message..."}
            className="flex-1 px-5 py-3 rounded-2xl bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white text-sm focus:outline-hidden transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={bookingStatus === "completed" || bookingStatus === "cancelled" || !inputText.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
