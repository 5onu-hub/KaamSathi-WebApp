import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, MessageSquare, X, Send, Mic, MicOff, Volume2, Copy, Check, 
  RotateCcw, ThumbsUp, ThumbsDown, Share2, Trash2, Edit2, Maximize2, Minimize2, 
  Bot, User, ArrowRight, ShieldCheck, Zap, HelpCircle, FileText
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  liked?: boolean;
  disliked?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m_welcome",
      role: "assistant",
      content: "Namaste! I am **AI Saathi**, your intelligent assistant on KaamSathi. How can I help you today? You can ask me to find verified workers, estimate labour costs, or track your bookings.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "worker" | "admin">("customer");
  const [language, setLanguage] = useState<string>("English");
  const [conversationId, setConversationId] = useState<string>("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Fetch conversation history
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/v1/ai/history");
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch AI history:", err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim()) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}_u`,
      role: "user",
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          conversationId: conversationId || undefined,
          role,
          language,
          context: {
            url: window.location.pathname,
            location: "Delhi NCR",
            timestamp: new Date().toISOString()
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setConversationId(data.conversationId);
        if (data.history) {
          const formatted: Message[] = data.history.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            liked: m.liked,
            disliked: m.disliked
          }));
          setMessages(formatted);
        }
        fetchHistory();
      } else {
        throw new Error(data.error || "Failed to get AI response");
      }
    } catch (err: any) {
      console.error("AI chat error:", err);
      // Fallback response in chat
      const fallbackMsg: Message = {
        id: `msg_${Date.now()}_a`,
        role: "assistant",
        content: `I received your message regarding "${promptText}". As your KaamSathi AI assistant, I can help you connect with verified electricians, plumbers, and home experts instantly. How would you like to proceed?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
      toast.error("Connected with offline AI assistant fallback.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (id: string, liked: boolean) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, liked, disliked: false } : m));
    toast.success(liked ? "Thank you for your feedback!" : "Feedback recorded.");
  };

  const handleDislike = (id: string, disliked: boolean) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, disliked, liked: false } : m));
    toast.success("Feedback recorded.");
  };

  const handleVoiceToggle = () => {
    if (!isListening) {
      setIsListening(true);
      toast.success("Listening... Speak your request now (Voice simulation active).");
      setTimeout(() => {
        setIsListening(false);
        setInput("Find a plumber near Noida under ₹500");
      }, 4000);
    } else {
      setIsListening(false);
    }
  };

  const suggestionChips = [
    "Find nearby plumbers",
    "Book an electrician",
    "Estimate painting cost",
    "How does KaamSathi work?",
    "Track my booking",
    "Show verified workers"
  ];

  return (
    <>
      {/* Floating AI Action Button */}
      {!isOpen && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-5 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-sm border border-white/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Sparkles className="w-5 h-5 animate-pulse text-amber-300 relative z-10" />
            <span className="relative z-10 tracking-tight">AI Saathi</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2"></span>
          </button>
        </motion.div>
      )}

      {/* Expandable Chat Window / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 bg-white shadow-2xl border border-gray-200/80 flex flex-col overflow-hidden transition-all duration-300 ${
              isFullScreen 
                ? "inset-4 sm:inset-10 rounded-3xl" 
                : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[460px] h-[640px] max-h-[85vh] rounded-3xl"
            }`}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-gray-900 text-white flex items-center justify-between border-b border-blue-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-500 flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-white tracking-tight">AI Saathi</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Gemini 2.5 Flash
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200/80">Official KaamSathi Intelligent Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-2 rounded-xl text-xs font-bold transition-colors ${showHistory ? 'bg-white/20 text-white' : 'text-blue-200 hover:bg-white/10'}`}
                  title="Conversation History"
                >
                  History
                </button>

                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  title={isFullScreen ? "Minimize" : "Full Screen"}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Role & Language Bar */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-600">
              <div className="flex items-center gap-2">
                <span>Role:</span>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as any)}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-blue-900"
                >
                  <option value="customer">Customer</option>
                  <option value="worker">Worker / Partner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>Language:</span>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-800"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>
            </div>

            {/* Main Body: History Sidebar + Chat Container */}
            <div className="flex-1 flex overflow-hidden relative">
              
              {/* History Drawer */}
              {showHistory && (
                <div className="absolute inset-y-0 left-0 w-64 bg-gray-900 text-white z-20 p-4 flex flex-col justify-between border-r border-gray-800 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                      <span className="font-bold text-xs uppercase tracking-wider text-gray-400">Past Conversations</span>
                      <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
                      {conversations.map(conv => (
                        <div 
                          key={conv.id}
                          onClick={() => {
                            setConversationId(conv.id);
                            setShowHistory(false);
                          }}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer truncate transition-colors ${conversationId === conv.id ? 'bg-blue-600 text-white font-bold' : 'bg-gray-800/80 hover:bg-gray-800 text-gray-300'}`}
                        >
                          {conv.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      if (conversationId) {
                        await fetch(`/api/v1/ai/history/${conversationId}`, { method: "DELETE" });
                        setConversationId("");
                        setMessages([{
                          id: "m_welcome",
                          role: "assistant",
                          content: "Conversation cleared. How can I help you?",
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]);
                        fetchHistory();
                      }
                    }}
                    className="w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Current Chat
                  </button>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 flex flex-col bg-gray-50/50 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div className={`max-w-[82%] sm:max-w-[78%] rounded-2xl p-4 space-y-2 text-xs shadow-2xs ${
                        msg.role === "user" 
                          ? "bg-blue-600 text-white rounded-br-xs" 
                          : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs"
                      }`}>
                        <div className="leading-relaxed whitespace-pre-wrap font-sans">
                          {msg.content}
                        </div>

                        <div className={`flex items-center justify-between pt-2 border-t text-[10px] ${
                          msg.role === "user" ? "border-blue-500 text-blue-100" : "border-gray-100 text-gray-400"
                        }`}>
                          <span>{msg.timestamp}</span>

                          {msg.role === "assistant" && (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="hover:text-blue-600 flex items-center gap-0.5"
                                title="Copy"
                              >
                                {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                              <button 
                                onClick={() => handleLike(msg.id, !msg.liked)}
                                className={`hover:text-emerald-600 ${msg.liked ? 'text-emerald-600 font-bold' : ''}`}
                                title="Helpful"
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => handleDislike(msg.id, !msg.disliked)}
                                className={`hover:text-rose-600 ${msg.disliked ? 'text-rose-600 font-bold' : ''}`}
                                title="Not Helpful"
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-xl bg-gray-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-150"></span>
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-300"></span>
                        <span className="font-bold text-gray-700 ml-1">AI Saathi is thinking...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestion Chips */}
                <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                  {suggestionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-100 whitespace-nowrap transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                  <button
                    onClick={handleVoiceToggle}
                    className={`p-2.5 rounded-xl transition-colors ${
                      isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title="Voice Input (Speech-to-Text)"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isListening ? "Listening to your voice..." : "Ask AI Saathi anything (e.g. Find plumber, estimate cost)..."}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-blue-600 font-medium"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || loading}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors shadow-md shadow-blue-600/20"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
