import React, { useState } from "react";
import { X, Sparkles, Calculator, CheckCircle2, Clock, ShieldCheck, ArrowRight, DollarSign } from "lucide-react";

interface AiRateEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  onProceedToBooking: (estimateData: { serviceName: string; estHours: number; estCost: number }) => void;
}

export function AiRateEstimatorModal({ isOpen, onClose, categoryName, onProceedToBooking }: AiRateEstimatorModalProps) {
  const [selectedTask, setSelectedTask] = useState("Standard Repair & Fitting");
  const [complexity, setComplexity] = useState<"minor" | "standard" | "major">("standard");
  const [urgent, setUrgent] = useState(false);

  if (!isOpen) return null;

  const taskOptions: Record<string, string[]> = {
    Plumbing: ["Tap Leakage Repair", "Pipe Burst & Drainage", "Bathroom Fitting Installation", "Water Tank Cleaning", "Geyser Mounting & Repair"],
    Electrical: ["MCB Fault & Short Circuit", "Fan / Switchboard Fitting", "Whole House Wiring Check", "Inverter Installation", "Light Fixture Setup"],
    Carpentry: ["Door Lock Repair & Hinge", "Modular Cabinet Fitting", "Custom Furniture Assembly", "Bed & Wardrobe Repair", "Wooden Polishing"],
    Painting: ["Wall Patching & Touchup", "Full Room Interior Paint", "Exterior Waterproofing", "Texture Wall Art", "Stencil Design"],
    Cleaning: ["Sofa & Carpet Shampooing", "Bathroom Deep Scrubbing", "Kitchen Degreasing", "Full House Deep Cleaning", "Window & Balcony Wash"],
    Default: ["General Repair & Fitting", "Inspection & Maintenance", "Emergency Fixing", "Installation & Setup", "Custom Project"]
  };

  const tasks = taskOptions[categoryName] || taskOptions.Default;

  // Rate calculations
  let baseRate = 250;
  if (categoryName.toLowerCase().includes("plumb")) baseRate = 300;
  if (categoryName.toLowerCase().includes("electric")) baseRate = 280;
  if (categoryName.toLowerCase().includes("carpent")) baseRate = 350;
  if (categoryName.toLowerCase().includes("paint")) baseRate = 400;

  let multiplier = complexity === "minor" ? 1 : complexity === "standard" ? 1.8 : 3.2;
  let estimatedHours = complexity === "minor" ? 1 : complexity === "standard" ? 2.5 : 5;
  if (urgent) multiplier *= 1.25;

  const totalEstimate = Math.round(baseRate * multiplier);
  const partsEstimate = Math.round(totalEstimate * 0.35);
  const labourCharge = totalEstimate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Rate & Cost Estimator</span>
          </div>

          <h3 className="text-xl font-black">
            Estimate {categoryName} Job Cost
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            Get instant transparent cost breakdown powered by local market rate cards.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-gray-700">
          {/* Select Task */}
          <div className="space-y-2">
            <label className="font-bold text-gray-900 block">Select Specific Task:</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 font-semibold focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all text-xs"
            >
              {tasks.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Complexity Selection */}
          <div className="space-y-2">
            <label className="font-bold text-gray-900 block">Work Complexity:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "minor", label: "Minor", desc: "< 1 hr quick fix" },
                { id: "standard", label: "Standard", desc: "1 - 3 hrs work" },
                { id: "major", label: "Major", desc: "Half / Full Day" }
              ].map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setComplexity(comp.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    complexity === comp.id
                      ? "border-blue-600 bg-blue-50/80 text-blue-700 font-bold shadow-xs"
                      : "border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"
                  }`}
                >
                  <div className="font-bold text-xs">{comp.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{comp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Urgent Dispatch Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-orange-50/80 rounded-2xl border border-orange-200/80">
            <div>
              <span className="font-bold text-orange-900 block">Need Emergency 30-Min Dispatch?</span>
              <span className="text-[11px] text-orange-700">Priority local dispatch within 30 minutes.</span>
            </div>
            <input 
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded-md focus:ring-orange-500 cursor-pointer accent-orange-500"
            />
          </div>

          {/* Calculation Breakdown Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-blue-950 text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="text-gray-300">Labour Charge ({estimatedHours} hrs est.)</span>
              <span className="font-bold">₹{labourCharge}</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="text-gray-300">Est. Spare Parts & Consumables</span>
              <span className="font-bold">~ ₹{partsEstimate}</span>
            </div>
            {urgent && (
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2 text-orange-300">
                <span>Emergency Express Surcharge</span>
                <span className="font-bold">+ 25%</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1 text-sm font-black text-orange-400">
              <span>Estimated Total Range</span>
              <span className="text-lg">₹{totalEstimate} - ₹{totalEstimate + 200}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Final charges depend on exact work done. No hidden commission fees.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onProceedToBooking({
                serviceName: `${categoryName}: ${selectedTask}`,
                estHours: estimatedHours,
                estCost: totalEstimate
              });
            }}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Book Worker With This Estimate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
