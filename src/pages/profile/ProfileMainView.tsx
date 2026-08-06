import React, { useState, useEffect } from "react";
import { 
  User, Mail, Phone, MapPin, ShieldCheck, Award, Briefcase, Calendar, 
  Download, Trash2, Shield, Settings, Key, Globe, Bell, CheckCircle2, 
  AlertTriangle, Edit3, X, Loader2, RefreshCw
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function ProfileMainView() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "edit" | "settings" | "security" | "preferences" | "addresses" | "activity" | "export">("overview");
  
  // Edit form state
  const [editForm, setEditForm] = useState<any>({});
  
  // Settings & Activity
  const [settings, setSettings] = useState<any>({});
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({ title: "Home", addressLine: "", city: "", pincode: "", isDefault: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const userId = "cust_1"; // Can be switched to worker_1 or dynamic

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, aRes, addrRes] = await Promise.all([
        axios.get(`/api/v1/profile?userId=${userId}`),
        axios.get(`/api/v1/settings?userId=${userId}`),
        axios.get(`/api/v1/activity?userId=${userId}`),
        axios.get(`/api/v1/addresses?userId=${userId}`)
      ]);

      if (pRes.data.success) {
        setProfile(pRes.data.data);
        setEditForm(pRes.data.data);
        if (pRes.data.data.addresses) setAddresses(pRes.data.data.addresses);
      }
      if (sRes.data.success) setSettings(sRes.data.data);
      if (aRes.data.success) setActivityLogs(aRes.data.data);
      if (addrRes.data.success) setAddresses(addrRes.data.data);
    } catch (err) {
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/v1/profile", { userId, ...editForm });
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setProfile(res.data.data);
        setActiveTab("overview");
      }
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/v1/settings", { userId, ...settings });
      if (res.data.success) {
        toast.success("Preferences & settings saved!");
      }
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/addresses", { userId, action: "add", addressData: newAddress });
      if (res.data.success) {
        toast.success("Address added successfully");
        setNewAddress({ title: "Home", addressLine: "", city: "", pincode: "", isDefault: false });
        fetchProfileData();
      }
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await axios.post("/api/v1/addresses", { userId, action: "delete", addressId });
      toast.success("Address deleted");
      fetchProfileData();
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const handleExportData = (format: "json" | "pdf") => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ profile, settings, addresses, activityLogs }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kaamsathi_profile_export.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Profile data exported as ${format.toUpperCase()} successfully!`);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.post("/api/v1/account/delete", { userId, reason: deleteReason });
      if (res.data.success) {
        toast.success("Account deactivated");
        window.location.href = "/role-selection";
      }
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-10 space-y-8">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 rounded-3xl border border-cyan-500/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={profile?.profilePhoto} 
              alt={profile?.fullName} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-xl"
            />
            {profile?.isVerified && (
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-md" title="Verified Account">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white">{profile?.fullName}</h1>
              <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">{profile?.role}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400" /> {profile?.email} • 
              <Phone className="w-3.5 h-3.5 text-cyan-400" /> {profile?.phone} • 
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {profile?.city}, {profile?.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Profile Completion</span>
            <span className="text-lg font-black text-cyan-400">{profile?.profileCompletion || 88}%</span>
          </div>
          <button 
            onClick={() => setActiveTab("edit")}
            className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: "overview", label: "Profile Overview", icon: User },
          { id: "edit", label: "Edit Profile", icon: Edit3 },
          { id: "settings", label: "Account Settings", icon: Settings },
          { id: "security", label: "Security & Clerk", icon: Shield },
          { id: "preferences", label: "Preferences", icon: Bell },
          { id: "addresses", label: "Saved Addresses", icon: MapPin },
          { id: "activity", label: "Activity Log", icon: Calendar },
          { id: "export", label: "Data Export & Delete", icon: Download }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" 
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" /> About Me & Bio
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{profile?.bio}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-500 font-bold">Gender</span>
                  <p className="text-xs font-bold text-white mt-0.5">{profile?.gender}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-bold">Date of Birth</span>
                  <p className="text-xs font-bold text-white mt-0.5">{profile?.dob}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-bold">Member Since</span>
                  <p className="text-xs font-bold text-white mt-0.5">{new Date(profile?.memberSince).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-500 font-bold">Languages Spoken</span>
                <div className="flex gap-2 flex-wrap">
                  {profile?.languages?.map((lang: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-bold">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {profile?.role === "worker" && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" /> Professional & Worker Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold">Experience</span>
                    <p className="text-xs font-bold text-white mt-0.5">{profile?.experience}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold">Hourly Rate</span>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">₹{profile?.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold">Daily Rate</span>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">₹{profile?.dailyRate}/day</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-500 font-bold">Skills</span>
                  <div className="flex gap-2 flex-wrap">
                    {profile?.skills?.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-500 font-bold">Certificates</span>
                  <div className="flex gap-2 flex-wrap">
                    {profile?.certificates?.map((cert: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Emergency Contact</h3>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">{profile?.emergencyContact?.relation}</span>
                <h4 className="font-bold text-white text-sm">{profile?.emergencyContact?.name}</h4>
                <p className="text-xs text-slate-300">{profile?.emergencyContact?.phone}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900 rounded-3xl border border-cyan-500/30 p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Security Status</h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center justify-between">
                  <span>Clerk Auth Session</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Two-Factor Auth</span>
                  <span className="text-cyan-400 font-bold">Enabled</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Phone Verification</span>
                  <span className="text-emerald-400 font-bold">Verified</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PROFILE */}
      {activeTab === "edit" && (
        <form onSubmit={handleSaveProfile} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl max-w-4xl">
          <h3 className="text-lg font-black text-white">Edit Personal & Professional Profile</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
              <input 
                type="text" 
                value={editForm.fullName || ""}
                onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number</label>
              <input 
                type="text" 
                value={editForm.phone || ""}
                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">City</label>
              <input 
                type="text" 
                value={editForm.city || ""}
                onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">State</label>
              <input 
                type="text" 
                value={editForm.state || ""}
                onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Gender</label>
              <select 
                value={editForm.gender || ""}
                onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Date of Birth</label>
              <input 
                type="date" 
                value={editForm.dob || ""}
                onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Bio / About Me</label>
            <textarea 
              rows={3}
              value={editForm.bio || ""}
              onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button 
              type="button"
              onClick={() => setActiveTab("overview")}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: ACCOUNT SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-slate-950 max-w-4xl space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
            <h3 className="text-lg font-black text-white">App & Account Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Language</label>
                <select 
                  value={settings.language || "English"}
                  onChange={e => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Theme</label>
                <select 
                  value={settings.theme || "dark"}
                  onChange={e => setSettings({ ...settings, theme: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="dark">Dark Luxury</option>
                  <option value="light">Light Mode</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Timezone</label>
                <select 
                  value={settings.timezone || "IST (UTC+5:30)"}
                  onChange={e => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY */}
      {activeTab === "security" && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl max-w-4xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white">Security & Clerk Authentication</h3>
              <p className="text-xs text-slate-400">Manage passwords, sessions, and multi-factor authentication securely.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">Clerk Managed</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm">Change Account Password</h4>
                <p className="text-xs text-slate-400">Update your login password securely via Clerk portal.</p>
              </div>
              <button onClick={() => toast.success("Redirecting to Clerk Security Portal...")} className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30">
                Change Password
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-slate-400">Add an extra layer of security with SMS or Authenticator app.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm">Active Sessions & Devices</h4>
                <p className="text-xs text-slate-400">Logged in from Chrome on Macintosh (New Delhi, India)</p>
              </div>
              <button onClick={() => toast.success("Signed out from all other devices")} className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/30">
                Logout All Other Devices
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PREFERENCES */}
      {activeTab === "preferences" && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl max-w-4xl">
          <h3 className="text-lg font-black text-white">Notification & Privacy Preferences</h3>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Notification Channels</h4>
            {[
              { key: "bookingUpdates", label: "Booking Updates & Schedule Alerts" },
              { key: "messages", label: "Chat Messages from Workers / Customers" },
              { key: "payments", label: "Payment Receipts & Payout Confirmations" },
              { key: "offers", label: "Promotional Offers & Discounts" },
              { key: "aiSuggestions", label: "AI Saathi Recommendations" },
              { key: "supportTickets", label: "Support Ticket Replies" }
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-200 font-bold">{item.label}</span>
                <input 
                  type="checkbox"
                  checked={settings?.notifications?.[item.key] ?? true}
                  onChange={e => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, [item.key]: e.target.checked }
                  })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </label>
            ))}

            <div className="pt-4 flex justify-end">
              <button onClick={handleSaveSettings} className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold shadow-lg">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SAVED ADDRESSES */}
      {activeTab === "addresses" && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-white">Add New Saved Address</h3>
            <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Title (e.g. Home, Office)</label>
                <input 
                  type="text" 
                  value={newAddress.title}
                  onChange={e => setNewAddress({...newAddress, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">City</label>
                <input 
                  type="text" 
                  value={newAddress.city}
                  onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-1">Address Line</label>
                <input 
                  type="text" 
                  placeholder="Street, Building, Flat number..."
                  value={newAddress.addressLine}
                  onChange={e => setNewAddress({...newAddress, addressLine: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Pincode</label>
                <input 
                  type="text" 
                  value={newAddress.pincode}
                  onChange={e => setNewAddress({...newAddress, pincode: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input 
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                    className="accent-cyan-500 w-4 h-4"
                  /> Set as Default Address
                </label>
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold">
                  Add Address
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr._id || addr.title} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{addr.title}</span>
                    {addr.isDefault && <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">Default</span>}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{addr.addressLine}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{addr.city} - {addr.pincode}</p>
                </div>
                <button onClick={() => handleDeleteAddress(addr._id)} className="text-rose-400 hover:text-rose-300 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: ACTIVITY LOG */}
      {activeTab === "activity" && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-4 shadow-2xl max-w-4xl">
          <h3 className="text-lg font-black text-white">Account Activity & Login Log</h3>
          <div className="space-y-3">
            {activityLogs.map((log, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-cyan-400 block">{log.action}</span>
                  <p className="text-slate-300 mt-0.5">{log.details}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{log.device} • IP: {log.ipAddress}</span>
                </div>
                <span className="text-[11px] text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: DATA EXPORT & DELETE */}
      {activeTab === "export" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-white">Download Your Data</h3>
            <p className="text-xs text-slate-300">Export your complete KaamSathi profile data, booking history, payment records, and support tickets in JSON or PDF format.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => handleExportData("json")} className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2">
                <Download className="w-4 h-4" /> Export as JSON
              </button>
              <button onClick={() => handleExportData("pdf")} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Report (PDF)
              </button>
            </div>
          </div>

          <div className="bg-rose-950/20 rounded-3xl border border-rose-500/30 p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Delete Account
            </h3>
            <p className="text-xs text-slate-300">Permanently deactivate and soft delete your profile data. This action is irreversible.</p>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-md p-6 md:p-8 space-y-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-rose-400">Confirm Account Deletion</h3>
            <p className="text-xs text-slate-300">Please provide a reason for deleting your KaamSathi account:</p>
            <textarea 
              rows={3}
              placeholder="Reason for leaving..."
              value={deleteReason}
              onChange={e => setDeleteReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold">
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMainView;
