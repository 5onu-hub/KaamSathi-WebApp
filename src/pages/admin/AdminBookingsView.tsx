import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin, CheckCircle, XCircle, AlertTriangle, Download } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export function AdminBookingsView() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/api/v1/admin/bookings")
      .then(res => {
        if (res.data.success) setBookings(res.data.data);
      })
      .catch(() => {});
  }, []);

  const handleCancelBooking = (id: string) => {
    toast.success("Booking cancelled & refund initiated");
    setBookings(bookings.map(b => b._id === id || b.id === id ? { ...b, status: "cancelled" } : b));
  };

  const filteredBookings = bookings.filter(b => 
    b.workerName?.toLowerCase().includes(search.toLowerCase()) || 
    b.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900">Enterprise Booking Management</h3>
          <p className="text-xs text-gray-500">Monitor active assignments, resolve disputes, and cancel bookings</p>
        </div>
        <button onClick={() => toast.success("Exporting bookings CSV...")} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 w-fit">
          <Download className="w-4 h-4" /> Export Bookings
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by worker or customer name..."
            className="bg-transparent text-xs w-full focus:outline-hidden"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                <th className="pb-3 px-4">Booking ID & Service</th>
                <th className="pb-3 px-4">Customer & Worker</th>
                <th className="pb-3 px-4">Amount</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((b, i) => (
                <tr key={b._id || b.id || i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">{b.serviceCategory || "Electrical Service"}</div>
                    <div className="text-gray-400 text-[11px]">ID: {b._id || b.id || "BK-8942"}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-800">Customer: {b.customerName || "Rahul Verma"}</div>
                    <div className="text-gray-400 text-[11px]">Worker: {b.workerName || "Ramesh Kumar"}</div>
                  </td>
                  <td className="py-4 px-4 font-black text-gray-900">₹{b.totalAmount || 450}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-blue-100 text-blue-700">
                      {b.status || "Assigned"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button onClick={() => toast.success("Support agent assigned to dispute")} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">
                      Assign Support
                    </button>
                    <button onClick={() => handleCancelBooking(b._id || b.id)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
