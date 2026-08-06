import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Heart, Star, ShieldCheck, MapPin, Wrench, ArrowRight, Trash2, Calendar 
} from "lucide-react";
import { MOCK_WORKERS } from "../../constants";
import { NewBookingModal } from "../../components/booking/NewBookingModal";

export function CustomerSavedView() {
  const navigate = useNavigate();
  const [savedWorkers, setSavedWorkers] = useState(MOCK_WORKERS.slice(0, 3));
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<any | null>(null);

  const handleRemove = (id: string) => {
    setSavedWorkers(savedWorkers.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" /> Favorites List
          </div>
          <h1 className="text-3xl font-black tracking-tight">Saved & Favorite Workers</h1>
          <p className="text-blue-200 text-xs sm:text-sm">Quickly hire professionals you have worked with or saved for future jobs.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {savedWorkers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">No Saved Workers Yet</h3>
            <p className="text-xs text-gray-500">Save top-rated workers from the discovery view to hire them instantly when needed.</p>
            <Link to="/workers" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">
              Browse Available Workers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedWorkers.map((worker) => (
              <div key={worker.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={worker.avatar} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-100" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{worker.name}</h4>
                        <span className="text-xs font-semibold text-blue-600">{worker.skill}</span>
                        <p className="text-xs text-orange-600 font-semibold flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemove(worker.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-bold text-gray-800">{worker.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hourly Charge:</span>
                      <span className="font-bold text-blue-600">₹{worker.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-bold text-gray-800">{worker.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => navigate(`/workers/${worker.id}`)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => setSelectedWorkerForBooking(worker)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedWorkerForBooking && (
        <NewBookingModal 
          isOpen={!!selectedWorkerForBooking}
          onClose={() => setSelectedWorkerForBooking(null)}
          defaultWorker={{
            id: selectedWorkerForBooking.id,
            name: selectedWorkerForBooking.name,
            skill: selectedWorkerForBooking.skill,
            hourlyRate: selectedWorkerForBooking.hourlyRate,
            city: selectedWorkerForBooking.city,
            avatar: selectedWorkerForBooking.avatar
          }}
          onSuccess={(bookingId) => {
            setSelectedWorkerForBooking(null);
            navigate(`/bookings/${bookingId}`);
          }}
        />
      )}
    </div>
  );
}
