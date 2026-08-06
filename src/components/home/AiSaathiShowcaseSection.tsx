import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, Mic, Send, Bot, User, Star, ShieldCheck, 
  ArrowRight, Zap, DollarSign, MapPin, 
  Languages, Wrench 
} from "lucide-react";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  type?: "text" | "worker_card" | "price_card";
  workerData?: {
    name: string;
    role: string;
    rating: number;
    experience: string;
    rate: string;
    image: string;
  };
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { sender: "user", text: "I need an electrician in Lucknow." },
  { 
    sender: "ai", 
    text: "I found 5 verified ITI & Govt certified electricians near Hazratganj, Lucknow with 4.8+ ratings." 
  },
  { sender: "user", text: "How much does AC servicing usually cost?" },
  { 
    sender: "ai", 
    text: "Typical split & window AC servicing ranges between ₹500–₹900 depending on gas top-up and foam jet cleaning." 
  },
  { sender: "user", text: "Recommend the best plumber." },
  { 
    sender: "ai", 
    text: "Here is our top AI-recommended plumbing expert in your locality:",
    type: "worker_card",
    workerData: {
      name: "Ramesh Kumar",
      role: "Master Plumber & Pipe Specialist",
      rating: 4.9,
      experience: "7 Years Exp.",
      rate: "₹250/hour",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  }
];

const AI_FEATURES = [
  { icon: <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />, title: "Smart Worker Match", desc: "Instantly matches your exact repair requirement with verified local experts." },
  { icon: <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, title: "Fair Price Estimation", desc: "Real-time government-vetted rate calculations with 0% platform markups." },
  { icon: <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />, title: "Hyper-Local Search", desc: "GPS-driven OpenStreetMap radius search to find workers minutes away." },
  { icon: <Languages className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />, title: "Hinglish & Regional", desc: "Speaks Hindi, English, and local dialects fluently via voice or text." },
  { icon: <Mic className="w-6 h-6 text-purple-600 dark:text-purple-400" />, title: "Voice Commands", desc: "Speak naturally to book services without typing on mobile keypads." },
  { icon: <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />, title: "Aadhaar Verified", desc: "AI background checks police records and Aadhaar IDs automatically." },
  { icon: <Wrench className="w-6 h-6 text-amber-600 dark:text-amber-400" />, title: "Instant Diagnostics", desc: "Diagnoses household appliance and electrical faults from your photo or description." },
  { icon: <Zap className="w-6 h-6 text-rose-600 dark:text-rose-400" />, title: "Lightning Fast", desc: "Connects you with an available technician in under 60 seconds." }
];

const QUICK_CHIPS = [
  "⚡ Find Electrician",
  "🚰 Find Plumber",
  "🎨 Find Painter",
  "🧹 Book Cleaning",
  "💰 Estimate Price",
  "📍 Nearby Workers"
];

export function AiSaathiShowcaseSection() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleChipClick = (chip: string) => {
    const userMsg: ChatMessage = { sender: "user", text: chip };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let aiReply: ChatMessage = { sender: "ai", text: `I can help you with ${chip.toLowerCase().replace(/[^a-z]/g, '')}. Would you like me to dispatch the nearest verified professional now?` };
      if (chip.includes("Electrician")) {
        aiReply = { sender: "ai", text: "Found 12 verified electricians ready for booking in your area with instant arrival guarantee." };
      } else if (chip.includes("Plumber")) {
        aiReply = { sender: "ai", text: "Top rated plumber Ramesh Kumar (4.9★) is available for booking right now." };
      } else if (chip.includes("Price")) {
        aiReply = { sender: "ai", text: "Our pricing is 100% transparent: Standard hourly rate starts at ₹200 with zero hidden charges." };
      }
      setMessages(prev => [...prev, aiReply]);
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText;
    setInputText("");
    setMessages(prev => [...prev, { sender: "user", text: query }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { sender: "ai", text: `I understand you are looking for "${query}". I have notified verified technicians nearby who will respond instantly.` }
      ]);
    }, 1500);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-indigo-950/5 to-slate-900 text-gray-900 dark:text-white relative overflow-hidden transition-colors">
      
      {/* Background Decorative Gradient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-orange-500/10 dark:bg-orange-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5 fill-blue-600 text-blue-600 dark:text-blue-400" />
            Next-Gen AI Labour Assistant
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-950 dark:text-white">
            Meet AI Saathi
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
            Your intelligent assistant for finding trusted workers, estimating prices, and booking services in seconds.
          </p>
        </div>

        {/* Main Desktop Two-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* ================= LEFT SIDE: ILLUSTRATION & WAVEFORM ================= */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Bot className="w-4 h-4" /> Powered by Gemini & Neural Speech Engine
              </div>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-950 dark:text-white">
                Intelligent Conversations with Local Expertise
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                AI Saathi understands regional nuances, negotiates standard fair wages, and coordinates directly with verified daily wage workers across India.
              </p>
            </div>

            {/* Voice Waveform Animation Widget */}
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md animate-pulse">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-gray-950 dark:text-white">Voice & Text Active</h4>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Listening in Hindi & English...</span>
                  </div>
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Sound Wave Bars */}
              <div className="flex items-center justify-center gap-1.5 h-12 py-2">
                {[40, 70, 95, 60, 30, 85, 100, 75, 45, 90, 65, 35, 80, 50, 95, 60].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${height}%`, `${Math.max(20, height * 0.4)}%`, `${height}%`] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.08 }}
                    className="w-1.5 bg-gradient-to-t from-blue-600 to-orange-500 rounded-full"
                  />
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <span>"Bhai ek achha plumber bhejo"</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">Recognized 99.4%</span>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Try asking AI Saathi:
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_CHIPS.map((chip, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChipClick(chip)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-800 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-all"
                  >
                    {chip}
                  </motion.button>
                ))}
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDE: INTERACTIVE CHAT WINDOW ================= */}
          <div className="lg:col-span-7">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[560px]">
              
              {/* Chat Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white shadow-inner">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm flex items-center gap-2">
                      AI Saathi Assistant 
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </h4>
                    <p className="text-[11px] text-blue-100">Always online • Instant Worker Match</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-extrabold text-white">
                  v2.5 Live
                </span>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-md ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`space-y-3 max-w-[80%] sm:max-w-[70%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-orange-500 text-white rounded-tr-none' 
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-tl-none border border-gray-200 dark:border-slate-700'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Optional Worker Card inside Chat */}
                      {msg.type === 'worker_card' && msg.workerData && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img 
                                src={msg.workerData.image} 
                                alt={msg.workerData.name} 
                                className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500/20"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-500" /> AI Recommended
                                </span>
                                <h5 className="font-black text-gray-900 dark:text-white text-sm">{msg.workerData.name}</h5>
                                <p className="text-[11px] text-gray-500 dark:text-slate-400">{msg.workerData.role}</p>
                              </div>
                            </div>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                              {msg.workerData.rate}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800 text-xs">
                            <span className="text-gray-500 dark:text-slate-400 font-medium">⭐ {msg.workerData.rating} • {msg.workerData.experience}</span>
                            <button 
                              onClick={() => navigate("/workers")}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1"
                            >
                              <span>Book Now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-800 px-4 py-3 rounded-2xl flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask AI Saathi for workers, prices, or advice..." 
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
                <button 
                  type="submit"
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md transition-all flex items-center justify-center shrink-0"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* ================= AI FEATURES GRID ================= */}
        <div className="space-y-8 pt-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
              Powerful Capabilities Built Into AI Saathi
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
              Designed specifically for the Indian workforce ecosystem to bridge skill gaps instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_FEATURES.map((feat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-lg space-y-4 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  {feat.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-gray-950 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate("/ai")}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Try AI Saathi Full Experience</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => navigate("/workers")}
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>Browse Workers</span>
          </button>
        </div>

      </div>
    </section>
  );
}

export default AiSaathiShowcaseSection;
