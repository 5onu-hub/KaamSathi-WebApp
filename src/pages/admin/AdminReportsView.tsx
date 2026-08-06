import React, { useState } from "react";
import { FileText, Download, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export function AdminReportsView() {
  const [reportType, setReportType] = useState("payments");
  const [format, setFormat] = useState("pdf");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Generated ${reportType.toUpperCase()} report in ${format.toUpperCase()} format successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-gray-900">Enterprise Reports Generator</h3>
        <p className="text-xs text-gray-500">Generate downloadable PDF, CSV, and Excel reports for audit, taxation, and analytics</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-xl space-y-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Report Dataset</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden font-medium text-gray-700"
            >
              <option value="users">Users & Customers Report</option>
              <option value="workers">Worker Partners Report</option>
              <option value="bookings">Bookings & Dispatch Report</option>
              <option value="payments">Payments & Revenue Report</option>
              <option value="complaints">Complaints & Disputes Report</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Export Format</label>
            <select 
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden font-medium text-gray-700"
            >
              <option value="pdf">PDF Document (.pdf)</option>
              <option value="csv">Comma Separated Values (.csv)</option>
              <option value="excel">Microsoft Excel (.xlsx)</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Generate & Download Report
          </button>
        </form>
      </div>
    </div>
  );
}
