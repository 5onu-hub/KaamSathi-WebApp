import React, { useState } from "react";
import { X, Star, Upload, CheckCircle2, ShieldCheck, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSubmitted?: () => void;
}

export function ReviewModal({ isOpen, onClose, booking, onSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["On Time", "Clean Work"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(`/api/v1/bookings/${booking.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, tags: selectedTags })
      });
      setIsSubmitting(false);
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black">Rate & Review Work</h3>
            <p className="text-xs text-blue-200">How was your experience with {booking.workerName}?</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Star Picker */}
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tap to Rate</span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star className={`w-8 h-8 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <span className="text-sm font-black text-gray-900 block">
              {rating === 5 && "Outstanding Service! ⭐⭐⭐⭐⭐"}
              {rating === 4 && "Very Good Experience! ⭐⭐⭐⭐"}
              {rating === 3 && "Average Work ⭐⭐⭐"}
              {rating < 3 && "Needs Improvement ⭐⭐"}
            </span>
          </div>

          {/* Tag Badges */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">What stood out?</span>
            <div className="flex flex-wrap gap-2">
              {["On Time", "Polite & Respectful", "Clean Work", "Fair Pricing", "Expert Workmanship", "Brought Own Tools"].map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected 
                        ? "bg-blue-600 text-white shadow-xs" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Detailed Review</label>
            <textarea 
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience to help other customers on KaamSathi..."
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all"
          >
            {isSubmitting ? "Submitting Review..." : "Submit Verified Review"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
