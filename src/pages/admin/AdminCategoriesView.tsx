import React, { useState } from "react";
import { Grid, Plus, Trash2, Edit, Save, X, Search, Layers, Eye, EyeOff, Check, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";
import { SERVICE_GROUPS_DATA, ServiceGroup, ServiceItem } from "../../data/servicesMasterData";

export function AdminCategoriesView() {
  const [groups, setGroups] = useState<ServiceGroup[]>(SERVICE_GROUPS_DATA);
  const [selectedGroup, setSelectedGroup] = useState<ServiceGroup | null>(SERVICE_GROUPS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  
  // Form State
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupEmoji, setGroupEmoji] = useState("🔧");
  
  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [servicePrice, setServicePrice] = useState("₹300/hr");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  const handleToggleGroupActive = (groupId: string) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, active: !g.active } : g));
    toast.success("Category status updated!");
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) return;

    const slug = groupName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newG: ServiceGroup = {
      id: `group-${Date.now()}`,
      slug,
      name: groupName,
      icon: "Home",
      emoji: groupEmoji,
      description: groupDesc || "Platform service category group.",
      bannerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200",
      serviceCount: 0,
      active: true,
      order: groups.length + 1,
      services: [],
      seoTitle: `${groupName} Services | KaamSathi`,
      seoDescription: groupDesc,
      keywords: [groupName.toLowerCase(), "skilled workers", "repair"]
    };

    setGroups([...groups, newG]);
    toast.success("Service Group created successfully!");
    setGroupModalOpen(false);
    setGroupName("");
    setGroupDesc("");
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !selectedGroup) return;

    const slug = serviceName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newS: ServiceItem = {
      id: `s-${Date.now()}`,
      slug,
      groupSlug: selectedGroup.slug,
      name: serviceName,
      description: serviceDesc || "Professional verified service.",
      shortDesc: serviceDesc,
      icon: "Wrench",
      bannerImage: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200",
      startPrice: servicePrice,
      startingPriceNumber: parseInt(servicePrice.replace(/[^0-9]/g, "")) || 300,
      avgRating: 4.9,
      reviewsCount: "120",
      totalWorkers: "1,200+",
      availableToday: "250+",
      popularTasks: [],
      faqs: [],
      seoTitle: seoTitle || `${serviceName} Services | KaamSathi`,
      seoDescription: seoDesc || serviceDesc,
      keywords: [serviceName.toLowerCase(), "near me"],
      active: true,
      order: selectedGroup.services.length + 1
    };

    const updatedGroups = groups.map(g => {
      if (g.id === selectedGroup.id) {
        return {
          ...g,
          services: [...g.services, newS],
          serviceCount: g.services.length + 1
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    setSelectedGroup({ ...selectedGroup, services: [...selectedGroup.services, newS] });
    toast.success(`New service added to ${selectedGroup.name}!`);
    setServiceModalOpen(false);
    setServiceName("");
    setServiceDesc("");
    setSeoTitle("");
    setSeoDesc("");
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Dynamic Services Management System</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage {groups.length} main categories, sub-services, rate cards, and SEO metadata in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setGroupModalOpen(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Service Group
          </button>
        </div>
      </div>

      {/* Main Grid: Groups List & Sub-Services Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Service Groups List */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Service Groups ({filteredGroups.length})
            </h4>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter groups..."
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-blue-600 w-36"
            />
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredGroups.map((g) => {
              const isSelected = selectedGroup?.id === g.id;

              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGroup(g)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? "bg-blue-50 border-blue-500 shadow-xs" 
                      : "bg-gray-50/70 hover:bg-gray-100/80 border-gray-200/80"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-xl p-2 rounded-xl bg-white shadow-2xs shrink-0">{g.emoji}</span>
                    <div className="truncate">
                      <h5 className="font-black text-gray-900 text-xs truncate">{g.name}</h5>
                      <span className="text-[11px] text-gray-500">{g.services.length} Sub-Services</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleGroupActive(g.id);
                      }}
                      className={`p-1.5 rounded-lg border text-xs ${
                        g.active ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-gray-200 text-gray-500 border-gray-300"
                      }`}
                      title={g.active ? "Enabled" : "Disabled"}
                    >
                      {g.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Group Services & SEO Editor */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-6">
          {selectedGroup ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-orange-50 border border-orange-100">{selectedGroup.emoji}</span>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">{selectedGroup.name}</h4>
                    <p className="text-xs text-gray-500">Route: <span className="font-mono text-blue-600">/services/{selectedGroup.slug}</span></p>
                  </div>
                </div>

                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Sub-Service
                </button>
              </div>

              {/* Services List inside selected group */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Sub-Services ({selectedGroup.services.length})
                </h5>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {selectedGroup.services.map((serv) => (
                    <div 
                      key={serv.id}
                      className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{serv.name}</span>
                          <span className="font-mono text-[10px] text-gray-400">/{serv.slug}</span>
                        </div>
                        <p className="text-gray-500 text-[11px] truncate">{serv.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          {serv.startPrice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Meta Box */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2 text-xs">
                <h6 className="font-black text-blue-900 flex items-center gap-1.5">
                  🔍 Dynamic SEO Metadata
                </h6>
                <div className="space-y-1 text-gray-700">
                  <p><span className="font-bold">Title:</span> {selectedGroup.seoTitle}</p>
                  <p><span className="font-bold">Meta Description:</span> {selectedGroup.seoDescription}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-400 text-xs">
              Select a service group from the left panel to manage services.
            </div>
          )}
        </div>
      </div>

      {/* Group Modal */}
      {groupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-base">Create Service Group</h3>
              <button onClick={() => setGroupModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Emoji Icon</label>
                <input 
                  type="text" 
                  value={groupEmoji} 
                  onChange={(e) => setGroupEmoji(e.target.value)} 
                  className="w-full px-3 py-2 rounded-xl border border-gray-200" 
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Group Name</label>
                <input 
                  type="text" 
                  required 
                  value={groupName} 
                  onChange={(e) => setGroupName(e.target.value)} 
                  placeholder="e.g. Solar & Energy Services" 
                  className="w-full px-3 py-2 rounded-xl border border-gray-200" 
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea 
                  rows={2} 
                  value={groupDesc} 
                  onChange={(e) => setGroupDesc(e.target.value)} 
                  className="w-full px-3 py-2 rounded-xl border border-gray-200" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md">
                Save Service Group
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {serviceModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-base">Add Sub-Service to {selectedGroup.name}</h3>
              <button onClick={() => setServiceModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Service Name</label>
                <input 
                  type="text" 
                  required 
                  value={serviceName} 
                  onChange={(e) => setServiceName(e.target.value)} 
                  placeholder="e.g. Solar Panel Cleaning" 
                  className="w-full px-3 py-2 rounded-xl border border-gray-200" 
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Starting Price</label>
                <input 
                  type="text" 
                  required 
                  value={servicePrice} 
                  onChange={(e) => setServicePrice(e.target.value)} 
                  placeholder="₹300/hr or ₹500/service" 
                  className="w-full px-3 py-2 rounded-xl border border-gray-200" 
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea 
                  rows={2} 
                  value={serviceDesc} 
                  onChange={(e) => setServiceDesc(e.target.value)} 
                  className="w-full px-3 py-2 rounded-xl border border-gray-200" 
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">SEO Title Override</label>
                <input 
                  type="text" 
                  value={seoTitle} 
                  onChange={(e) => setSeoTitle(e.target.value)} 
                  placeholder="Best Solar Cleaning Services near me" 
                  className="w-full px-3 py-2 rounded-xl border border-gray-200" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md">
                Add Sub-Service
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
