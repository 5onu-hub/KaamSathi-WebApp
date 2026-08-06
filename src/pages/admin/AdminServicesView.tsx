import React, { useState, useEffect } from "react";
import { 
  Wrench, Plus, Search, Filter, Edit3, Trash2, Copy, CheckCircle, XCircle, 
  Sparkles, Shield, DollarSign, Clock, Layers, Eye, AlertCircle, Save, X, Check,
  Zap, Building, Cpu, Car, Utensils, Flower2, Laptop, HeartHandshake, ShieldCheck
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function AdminServicesView() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Electrical",
    subCategory: "General",
    description: "",
    shortDescription: "",
    serviceIcon: "Zap",
    bannerImage: "",
    thumbnail: "",
    basePrice: 299,
    hourlyPrice: 300,
    estimatedDuration: "1-2 Hours",
    emergencyAvailable: true,
    popularBadge: false,
    trendingBadge: false,
    featuredBadge: false,
    minExperienceRequired: 2,
    requiredSkills: "Wiring, Testing",
    requiredTools: "Multimeter, Screwdriver",
    seoTitle: "",
    seoDescription: "",
    keywords: "electrician, repair",
    status: "active",
    subServices: [
      { name: "Basic Inspection", slug: "basic-inspection", price: 199, duration: "30 mins" }
    ]
  });

  const categories = [
    "Electrical", "Plumbing", "Appliance Repair", "Cleaning & Pest", 
    "Construction", "Transport", "Cooking", "Digital", "Security"
  ];

  const iconOptions = ["Zap", "Wrench", "Cpu", "Sparkles", "Building", "Car", "Utensils", "Flower2", "Laptop", "ShieldCheck"];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/services");
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err: any) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      name: "",
      slug: "",
      category: "Electrical",
      subCategory: "General",
      description: "",
      shortDescription: "",
      serviceIcon: "Zap",
      bannerImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
      thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
      basePrice: 299,
      hourlyPrice: 300,
      estimatedDuration: "1-2 Hours",
      emergencyAvailable: true,
      popularBadge: false,
      trendingBadge: false,
      featuredBadge: false,
      minExperienceRequired: 2,
      requiredSkills: "Wiring, Safety",
      requiredTools: "Multimeter, Tester",
      seoTitle: "",
      seoDescription: "",
      keywords: "service, expert",
      status: "active",
      subServices: [
        { name: "Standard Checkup", slug: "standard-checkup", price: 249, duration: "45 mins" }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      slug: service.slug || "",
      category: service.category || "Electrical",
      subCategory: service.subCategory || "General",
      description: service.description || "",
      shortDescription: service.shortDescription || "",
      serviceIcon: service.serviceIcon || "Zap",
      bannerImage: service.bannerImage || "",
      thumbnail: service.thumbnail || "",
      basePrice: service.basePrice || 299,
      hourlyPrice: service.hourlyPrice || 300,
      estimatedDuration: service.estimatedDuration || "1 Hour",
      emergencyAvailable: service.emergencyAvailable ?? true,
      popularBadge: service.popularBadge ?? false,
      trendingBadge: service.trendingBadge ?? false,
      featuredBadge: service.featuredBadge ?? false,
      minExperienceRequired: service.minExperienceRequired || 2,
      requiredSkills: Array.isArray(service.requiredSkills) ? service.requiredSkills.join(", ") : service.requiredSkills || "",
      requiredTools: Array.isArray(service.requiredTools) ? service.requiredTools.join(", ") : service.requiredTools || "",
      seoTitle: service.seoTitle || "",
      seoDescription: service.seoDescription || "",
      keywords: Array.isArray(service.keywords) ? service.keywords.join(", ") : service.keywords || "",
      status: service.status || "active",
      subServices: service.subServices || []
    });
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
        requiredTools: formData.requiredTools.split(",").map(s => s.trim()).filter(Boolean),
        keywords: formData.keywords.split(",").map(s => s.trim()).filter(Boolean),
      };

      if (editingService) {
        await axios.put(`/api/v1/admin/services/${editingService._id || editingService.slug}`, payload);
        toast.success("Service updated successfully!");
      } else {
        await axios.post("/api/v1/admin/services", payload);
        toast.success("New service created successfully!");
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`/api/v1/admin/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await axios.post(`/api/v1/admin/services/duplicate/${id}`);
      toast.success("Service duplicated successfully");
      fetchServices();
    } catch (err) {
      toast.error("Failed to duplicate service");
    }
  };

  const handleBulkStatus = async (status: string) => {
    if (selectedIds.length === 0) return toast.error("No services selected");
    try {
      await axios.patch("/api/v1/admin/services/status", {
        ids: selectedIds,
        status,
        action: "bulk-status"
      });
      toast.success(`Updated status for ${selectedIds.length} services`);
      setSelectedIds([]);
      fetchServices();
    } catch (err) {
      toast.error("Bulk update failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return toast.error("No services selected");
    if (!confirm(`Delete ${selectedIds.length} selected services?`)) return;
    try {
      await axios.patch("/api/v1/admin/services/status", {
        ids: selectedIds,
        action: "bulk-delete"
      });
      toast.success(`Deleted ${selectedIds.length} services`);
      setSelectedIds([]);
      fetchServices();
    } catch (err) {
      toast.error("Bulk delete failed");
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || s.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Dynamic Service Management</h1>
              <p className="text-xs text-slate-400">Create, edit, and manage services across customer, worker, and booking systems.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input 
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400">{selectedIds.length} selected</span>
            <button 
              onClick={() => handleBulkStatus("active")}
              className="px-3 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30"
            >
              Enable
            </button>
            <button 
              onClick={() => handleBulkStatus("inactive")}
              className="px-3 py-2 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-600/30"
            >
              Disable
            </button>
            <button 
              onClick={handleBulkDelete}
              className="px-3 py-2 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-600/30"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Services Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold border-b border-slate-700">
              <tr>
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    onChange={e => {
                      if (e.target.checked) setSelectedIds(filteredServices.map(s => s._id));
                      else setSelectedIds([]);
                    }}
                    checked={selectedIds.length > 0 && selectedIds.length === filteredServices.length}
                    className="rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500"
                  />
                </th>
                <th className="p-4">Service Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Badges</th>
                <th className="p-4">Sub-services</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">Loading dynamic services...</td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">No services found matching filters.</td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(service._id)}
                        onChange={() => {
                          setSelectedIds(prev => 
                            prev.includes(service._id) ? prev.filter(id => id !== service._id) : [...prev, service._id]
                          );
                        }}
                        className="rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={service.thumbnail || service.bannerImage || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100"} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0" />
                        <div>
                          <div className="font-bold text-white text-sm">{service.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">slug: {service.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 font-medium text-slate-300">
                        {service.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-400">
                      ₹{service.basePrice} <span className="text-[10px] text-slate-400 font-normal">base</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {service.featuredBadge && <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[10px] font-bold">Featured</span>}
                        {service.popularBadge && <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold">Popular</span>}
                        {service.trendingBadge && <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">Trending</span>}
                        {service.emergencyAvailable && <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded text-[10px] font-bold">SOS</span>}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">
                      {service.subServices?.length || 0} items
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        service.status === "active" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDuplicate(service._id)}
                          title="Duplicate"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(service)}
                          title="Edit"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(service._id)}
                          title="Delete"
                          className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-white">
                {editingService ? "Edit Dynamic Service" : "Create New Dynamic Service"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Service Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    placeholder="e.g. Solar Panel Maintenance"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Slug (URL friendly)</label>
                  <input 
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    placeholder="solar-panel-maintenance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sub-Category</label>
                  <input 
                    type="text"
                    value={formData.subCategory}
                    onChange={e => setFormData({...formData, subCategory: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    placeholder="e.g. Renewable Energy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Short Description</label>
                <input 
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  placeholder="Brief one-line summary for cards"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Description</label>
                <textarea 
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  placeholder="Detailed explanation of the service..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Base Price (₹)</label>
                  <input 
                    type="number"
                    value={formData.basePrice}
                    onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Hourly Rate (₹)</label>
                  <input 
                    type="number"
                    value={formData.hourlyPrice}
                    onChange={e => setFormData({...formData, hourlyPrice: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Duration</label>
                  <input 
                    type="text"
                    value={formData.estimatedDuration}
                    onChange={e => setFormData({...formData, estimatedDuration: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Thumbnail / Icon Image URL</label>
                  <input 
                    type="text"
                    value={formData.thumbnail}
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Banner Image URL</label>
                  <input 
                    type="text"
                    value={formData.bannerImage}
                    onChange={e => setFormData({...formData, bannerImage: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <input 
                    type="checkbox"
                    checked={formData.featuredBadge}
                    onChange={e => setFormData({...formData, featuredBadge: e.target.checked})}
                    className="rounded bg-slate-700 text-amber-500"
                  />
                  <span className="text-xs font-bold">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <input 
                    type="checkbox"
                    checked={formData.popularBadge}
                    onChange={e => setFormData({...formData, popularBadge: e.target.checked})}
                    className="rounded bg-slate-700 text-amber-500"
                  />
                  <span className="text-xs font-bold">Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <input 
                    type="checkbox"
                    checked={formData.trendingBadge}
                    onChange={e => setFormData({...formData, trendingBadge: e.target.checked})}
                    className="rounded bg-slate-700 text-amber-500"
                  />
                  <span className="text-xs font-bold">Trending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <input 
                    type="checkbox"
                    checked={formData.emergencyAvailable}
                    onChange={e => setFormData({...formData, emergencyAvailable: e.target.checked})}
                    className="rounded bg-slate-700 text-amber-500"
                  />
                  <span className="text-xs font-bold">SOS Ready</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServicesView;
