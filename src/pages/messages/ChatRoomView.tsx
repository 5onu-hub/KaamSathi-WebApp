import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Send, Image, Paperclip, MapPin, Smile, MoreVertical, Phone, ArrowLeft, 
  Check, CheckCheck, Trash2, Copy, CornerUpLeft, ShieldCheck, AlertCircle, Clock,
  Video, Mic, Eye, Download, X, Search, Flag, UserX, Share2, FileText, CheckCircle2, PhoneCall
} from "lucide-react";
import io from "socket.io-client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const socket = io();

export function ChatRoomView() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [bookingStatus, setBookingStatus] = useState("accepted"); // "accepted", "completed", "cancelled"
  const [partnerInfo, setPartnerInfo] = useState({ 
    name: "Ramesh Kumar", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", 
    category: "Electrician", 
    online: true, 
    lastSeen: "Today at 10:45 AM",
    phone: "+91 98765 43210",
    rating: "4.8 ★"
  });

  // Feature modals state
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState("calling"); // "calling", "connected", "ended"
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);

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

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText !== undefined ? customText : inputText;
    if (!textToSend.trim()) return;

    if (isBlocked) {
      toast.error("Cannot send message. User is blocked.");
      return;
    }

    if (bookingStatus === "completed" || bookingStatus === "cancelled") {
      toast.error("Chat is read-only because booking is completed or cancelled.");
      return;
    }

    const payload = {
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: textToSend,
      replyTo: replyingTo ? replyingTo.text : undefined,
      createdAt: new Date()
    };

    axios.post("/api/v1/messages", payload)
      .then(res => {
        if (res.data.success) {
          const sentMsg = res.data.data;
          setMessages(prev => [...prev, sentMsg]);
          socket.emit("message:send", sentMsg);
          setInputText("");
          setReplyingTo(null);
          socket.emit("message:stopTyping", { conversationId, userId: currentUser.id });
        }
      })
      .catch(() => {
        const localMsg = { _id: Date.now().toString(), ...payload, delivered: true, read: false };
        setMessages(prev => [...prev, localMsg]);
        socket.emit("message:send", localMsg);
        setInputText("");
        setReplyingTo(null);
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

  const handleSendMedia = (type: "image" | "document" | "location" | "booking_card") => {
    if (bookingStatus === "completed" || bookingStatus === "cancelled") {
      toast.error("Chat is read-only.");
      return;
    }

    let text = type === "image" ? "📷 [Shared Photo - Switchboard Wiring]" : 
               type === "document" ? "📄 [Shared Service Invoice #KS-INV-882]" : 
               type === "location" ? "📍 [Shared Live Location: South Extension, New Delhi]" :
               "📋 [Booking Card: KS-BKG-9921 - Electrical Repair - ₹450]";

    const payload = {
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      mediaType: type,
      mediaUrl: type === "image" ? "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600" : undefined,
      createdAt: new Date()
    };

    axios.post("/api/v1/messages", payload)
      .then(res => {
        if (res.data.success) {
          const sentMsg = res.data.data;
          setMessages(prev => [...prev, sentMsg]);
          socket.emit("message:send", sentMsg);
          toast.success(`Shared ${type.replace('_', ' ')} successfully`);
        }
      })
      .catch(() => {
        const localMsg = { _id: Date.now().toString(), ...payload, delivered: true };
        setMessages(prev => [...prev, localMsg]);
        socket.emit("message:send", localMsg);
        toast.success(`Shared ${type.replace('_', ' ')} successfully`);
      });
  };

  const filteredMessages = messages.filter(m => 
    m.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50 shadow-2xl border border-gray-100 font-sans relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-xs z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative cursor-pointer" onClick={() => toast("Viewing partner public profile", { icon: "ℹ️" })}>
            <img src={partnerInfo.avatar} alt={partnerInfo.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-gray-900 text-base">{partnerInfo.name}</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                {partnerInfo.category}
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTyping ? <strong className="text-blue-600 animate-pulse">{typingUser} is typing...</strong> : partnerInfo.lastSeen}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setCallModalOpen(true); setCallStatus("calling"); setTimeout(() => setCallStatus("connected"), 3000); }} 
            className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Voice Call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setSearchOpen(!searchOpen)} 
            className="p-2.5 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Search in Chat"
          >
            <Search className="w-5 h-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setMoreMenuOpen(!moreMenuOpen)} 
              className="p-2.5 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              title="More Options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30">
                <button 
                  onClick={() => { setIsBlocked(!isBlocked); setMoreMenuOpen(false); toast(isBlocked ? "User unblocked" : "User blocked", { icon: isBlocked ? "🔓" : "🔒" }); }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <UserX className="w-4 h-4 text-rose-500" /> {isBlocked ? "Unblock User" : "Block User"}
                </button>
                <button 
                  onClick={() => { setMoreMenuOpen(false); toast.success("Partner reported to KaamSathi Support."); }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" /> Report Partner
                </button>
                <button 
                  onClick={() => { setMessages([]); setMoreMenuOpen(false); toast.success("Chat history cleared."); }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" /> Clear Chat History
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar Bar */}
      {searchOpen && (
        <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-blue-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages in conversation..."
            className="flex-1 bg-transparent text-xs text-gray-900 focus:outline-hidden font-medium"
          />
          <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="text-xs font-bold text-blue-600">Close</button>
        </div>
      )}

      {/* Read-only banner if booking is completed or cancelled */}
      {(bookingStatus === "completed" || bookingStatus === "cancelled") && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Chat is read-only because this booking has been {bookingStatus}.
          </div>
          <button onClick={() => setBookingStatus("accepted")} className="underline font-semibold hover:text-amber-900">
            [Simulate Active Booking]
          </button>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#efeae2]">
        {filteredMessages.map((msg, index) => {
          const isOwn = msg.senderId === currentUser.id;
          return (
            <div key={msg._id || index} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md rounded-2xl px-5 py-3.5 shadow-sm space-y-1.5 relative group ${
                isOwn ? "bg-[#d9fdd3] text-gray-900 rounded-tr-xs" : "bg-white text-gray-900 rounded-tl-xs"
              }`}>
                {!isOwn && <p className="text-[11px] font-bold text-blue-600">{msg.senderName}</p>}
                
                {msg.replyTo && (
                  <div className="bg-black/5 rounded-xl p-2 text-xs border-l-2 border-blue-600 mb-2 italic">
                    {msg.replyTo}
                  </div>
                )}

                {msg.mediaUrl && (
                  <div className="relative group/img cursor-pointer" onClick={() => setZoomImage(msg.mediaUrl)}>
                    <img src={msg.mediaUrl} alt="Shared media" className="rounded-xl w-full max-h-64 object-cover mb-2" />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                      <Eye className="w-4 h-4" /> Click to Zoom
                    </div>
                  </div>
                )}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                <div className="flex items-center justify-end gap-1.5 text-[10px] text-gray-500 pt-1">
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isOwn && <CheckCheck className="w-3.5 h-3.5 text-blue-600" />}
                </div>

                {/* Message action dropdown on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-xs rounded-lg p-1 shadow-md flex items-center gap-1">
                  <button onClick={() => setReplyingTo(msg)} title="Reply" className="p-1 hover:bg-gray-100 rounded text-gray-600">
                    <CornerUpLeft className="w-3.5 h-3.5" />
                  </button>
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

      {/* Quick Replies Bar */}
      <div className="px-4 py-2 bg-white/80 backdrop-blur-xs border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Quick Replies:</span>
        {[
          "I am on my way!",
          "Please confirm exact address.",
          "Thanks for the excellent service!",
          "Can we reschedule by 30 mins?"
        ].map((reply, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(undefined, reply)}
            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 text-xs font-semibold whitespace-nowrap transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Replying Preview Banner */}
      {replyingTo && (
        <div className="px-6 py-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CornerUpLeft className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-blue-900">Replying to {replyingTo.senderName}:</span>
            <span className="text-gray-600 truncate max-w-md">{replyingTo.text}</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-700 font-bold">✕</button>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button onClick={() => handleSendMedia("image")} title="Share Image" className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500">
            <Image className="w-5 h-5" />
          </button>
          <button onClick={() => handleSendMedia("document")} title="Share Document / Invoice" className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500">
            <Paperclip className="w-5 h-5" />
          </button>
          <button onClick={() => handleSendMedia("location")} title="Share Location" className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500">
            <MapPin className="w-5 h-5" />
          </button>
          <button onClick={() => handleSendMedia("booking_card")} title="Share Booking Card" className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500">
            <FileText className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
          <input 
            type="text"
            value={inputText}
            onChange={handleInputChange}
            disabled={bookingStatus === "completed" || bookingStatus === "cancelled" || isBlocked}
            placeholder={isBlocked ? "User is blocked" : bookingStatus === "completed" ? "Chat is read-only (completed)" : "Type a secure message..."}
            className="flex-1 px-5 py-3 rounded-2xl bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white text-sm focus:outline-hidden transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={bookingStatus === "completed" || bookingStatus === "cancelled" || isBlocked || !inputText.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Zoom Image Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-3xl w-full">
            <button onClick={() => setZoomImage(null)} className="absolute -top-12 right-0 p-2 text-white hover:bg-white/20 rounded-full">
              <X className="w-6 h-6" />
            </button>
            <img src={zoomImage} alt="Zoomed view" className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            <div className="mt-4 flex justify-center">
              <a href={zoomImage} download target="_blank" rel="noreferrer" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Original Image
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Voice Call Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center space-y-6 shadow-2xl border border-gray-100">
            <div className="relative w-24 h-24 mx-auto">
              <img src={partnerInfo.avatar} alt={partnerInfo.name} className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-lg" />
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]">✓</span>
            </div>
            
            <div>
              <h3 className="text-xl font-black text-gray-900">{partnerInfo.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{partnerInfo.category} Partner • KaamSathi Secure VoIP</p>
              <div className="mt-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  callStatus === "calling" ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {callStatus === "calling" ? "Calling Ramesh Kumar..." : "Connected (01:24)"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4">
              <button 
                onClick={() => { setCallModalOpen(false); toast("Call ended"); }}
                className="w-14 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105"
                title="End Call"
              >
                <PhoneCall className="w-6 h-6 rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoomView;
