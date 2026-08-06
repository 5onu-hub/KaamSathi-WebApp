import React from "react";
import { Bot, Sparkles, TrendingUp, ShieldAlert, Zap } from "lucide-react";

export function AdminAiInsightsView() {
  const insights = [
    { title: "Demand Prediction", desc: "Electrician demand expected to surge by 35% this weekend in South Delhi and Noida due to expected heatwave.", badge: "High Confidence", color: "bg-blue-50 text-blue-700" },
    { title: "Fraud & Anomaly Detection", desc: "Zero suspicious payment reversals or fraudulent GPS check-ins detected across 3,420 recent dispatches.", badge: "Platform Secure", color: "bg-emerald-50 text-emerald-700" },
    { title: "Worker Performance Optimization", desc: "Top 10% workers maintain 4.9★ rating with <12 min average response time. Recommend priority dispatch for Ramesh Kumar.", badge: "Actionable", color: "bg-amber-50 text-amber-700" },
    { title: "Revenue Forecast", desc: "Projected monthly revenue for next quarter exceeds ₹32 Lakhs based on current seasonal growth models.", badge: "+28% Forecast", color: "bg-indigo-50 text-indigo-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900">AI Platform Intelligence & Insights</h3>
          <p className="text-xs text-gray-500">Gemini-powered demand prediction, fraud detection, and workforce analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((ins, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-gray-900 text-base">{ins.title}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${ins.color}`}>
                {ins.badge}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{ins.desc}</p>
            <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-blue-600 font-bold">
              <Sparkles className="w-4 h-4 text-orange-500" /> Powered by KaamSathi AI Engine
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
