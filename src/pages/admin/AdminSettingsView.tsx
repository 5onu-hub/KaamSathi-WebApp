import React, { useState } from "react";
import { Settings, Save } from "lucide-react";
import toast from "react-hot-toast";

export function AdminSettingsView() {
  const [platformName, setPlatformName] = useState("KaamSathi");
  const [commission, setCommission] = useState("10");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Platform settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-gray-900">Platform Configuration & Settings</h3>
        <p className="text-xs text-gray-500">Configure global commissions, maintenance mode, API integrations, and security parameters</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-2xl space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Platform Name</label>
            <input 
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Commission Percentage (%)</label>
            <input 
              type="number"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Maintenance Mode</h4>
              <p className="text-[11px] text-gray-500">Temporarily pause customer bookings during system upgrades</p>
            </div>
            <input 
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Platform Settings
          </button>
        </form>
      </div>
    </div>
  );
}
