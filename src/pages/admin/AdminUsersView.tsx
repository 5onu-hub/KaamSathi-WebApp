import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, ShieldAlert, CheckCircle, Ban, Trash2, Eye, Download } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export function AdminUsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    axios.get("/api/v1/admin/users")
      .then(res => {
        if (res.data.success) setUsers(res.data.data);
      })
      .catch(() => {});
  }, []);

  const handleBanUser = (id: string) => {
    axios.put(`/api/v1/admin/user/${id}/ban`)
      .then(() => {
        toast.success("User banned successfully");
        setUsers(users.map(u => u._id === id || u.id === id ? { ...u, status: "banned" } : u));
      })
      .catch(() => toast.error("Failed to ban user"));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900">User Management</h3>
          <p className="text-xs text-gray-500">Manage customers, roles, suspension statuses, and booking histories</p>
        </div>
        <button 
          onClick={() => toast.success("Exporting user records CSV...")}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 w-fit"
        >
          <Download className="w-4 h-4" /> Export Users CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="bg-transparent text-xs w-full focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-hidden font-medium text-gray-700"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                <th className="pb-3 px-4">User Details</th>
                <th className="pb-3 px-4">Role</th>
                <th className="pb-3 px-4">City</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u, i) => (
                <tr key={u._id || u.id || i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">{u.name}</div>
                    <div className="text-gray-400 text-[11px]">{u.email} • {u.phone || "+91 9876543210"}</div>
                  </td>
                  <td className="py-4 px-4 font-semibold capitalize">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                      {u.role || "Customer"}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-700">{u.city || "Delhi NCR"}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      u.status === "banned" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {u.status || "Active"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button onClick={() => toast.success(`Viewing profile for ${u.name}`)} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleBanUser(u._id || u.id)} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100">
                      <Ban className="w-4 h-4" />
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
