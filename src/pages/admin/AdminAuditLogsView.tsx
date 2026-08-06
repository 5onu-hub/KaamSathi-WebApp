import React from "react";
import { Shield, Clock, Search } from "lucide-react";

export function AdminAuditLogsView() {
  const logs = [
    { id: "l1", admin: "admin@kaamsathi.com", action: "APPROVE_WORKER", target: "Worker #w1 (Ramesh Kumar)", time: "10 mins ago", ip: "127.0.0.1" },
    { id: "l2", admin: "admin@kaamsathi.com", action: "CREATE_CATEGORY", target: "Category: Appliance Repair", time: "2 hours ago", ip: "127.0.0.1" },
    { id: "l3", admin: "admin@kaamsathi.com", action: "BAN_USER", target: "User #u3 (Amit Patel)", time: "Yesterday", ip: "127.0.0.1" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-gray-900">System Audit Logs</h3>
        <p className="text-xs text-gray-500">Immutable audit stream recording all admin logins, user updates, and verification actions</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                <th className="pb-3 px-4">Admin Email</th>
                <th className="pb-3 px-4">Action</th>
                <th className="pb-3 px-4">Target Entity</th>
                <th className="pb-3 px-4">IP Address</th>
                <th className="pb-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log, i) => (
                <tr key={log.id || i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">{log.admin}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-700">{log.target}</td>
                  <td className="py-4 px-4 font-mono text-gray-500">{log.ip}</td>
                  <td className="py-4 px-4 text-right text-gray-400 font-semibold">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
