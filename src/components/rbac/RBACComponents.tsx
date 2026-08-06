import React, { createContext, useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Wrench, ShieldCheck, User as UserIcon, Menu, X, Bell, LogIn, UserPlus, 
  LogOut, LayoutDashboard, Sparkles, Home, Briefcase, Search, MapPin, 
  Bookmark, MessageSquare, Wallet, FileText, Settings, Users, ShieldAlert,
  Shield, Activity, Globe
} from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";

// Role Context
interface RBACContextType {
  role: "guest" | "customer" | "worker" | "admin";
  isAuthenticated: boolean;
  user: any;
  setRole: (role: "guest" | "customer" | "worker" | "admin") => void;
  logout: () => void;
}

const RBACContext = createContext<RBACContextType>({
  role: "guest",
  isAuthenticated: false,
  user: null,
  setRole: () => {},
  logout: () => {}
});

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [role, setRoleState] = useState<"guest" | "customer" | "worker" | "admin">(() => {
    const saved = localStorage.getItem("kaamsathi_role");
    if (saved === "admin" || saved === "worker" || saved === "customer") return saved;
    return isSignedIn ? "customer" : "guest";
  });

  useEffect(() => {
    if (!isSignedIn) {
      if (window.location.pathname.startsWith("/admin")) {
        // allow admin login page
      } else if (!localStorage.getItem("kaamsathi_mock_auth")) {
        // guest if not signed in
      }
    } else {
      const storedRole = localStorage.getItem("kaamsathi_role");
      if (storedRole) {
        setRoleState(storedRole as any);
      }
    }
  }, [isSignedIn]);

  const setRole = (newRole: "guest" | "customer" | "worker" | "admin") => {
    setRoleState(newRole);
    localStorage.setItem("kaamsathi_role", newRole);
  };

  const logout = () => {
    localStorage.removeItem("kaamsathi_role");
    localStorage.removeItem("kaamsathi_mock_auth");
    localStorage.removeItem("kaamsathi_profile_completed");
    signOut();
    setRoleState("guest");
    window.location.href = "/";
  };

  const isMockAuth = localStorage.getItem("kaamsathi_mock_auth") === "true";
  const isAuthenticated = Boolean(isSignedIn || isMockAuth);

  return (
    <RBACContext.Provider value={{ role, isAuthenticated, user, setRole, logout }}>
      {children}
    </RBACContext.Provider>
  );
}

export const useRBAC = () => useContext(RBACContext);

// 1. RoleGuard Component
export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = <UnauthorizedFallback /> 
}: { 
  allowedRoles: ("guest" | "customer" | "worker" | "admin")[]; 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const { role } = useRBAC();

  if (!allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function UnauthorizedFallback() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">403 Access Denied</h1>
          <p className="text-sm text-gray-500">You do not have permission to access this page or dashboard due to role restrictions.</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => navigate("/")}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
          <button 
            onClick={() => navigate("/contact")}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. ProtectedRoute Component
export function ProtectedRoute({ 
  allowedRole, 
  children 
}: { 
  allowedRole: "customer" | "worker" | "admin" | "guest"; 
  children: React.ReactNode; 
}) {
  const { role, isAuthenticated } = useRBAC();

  if (allowedRole !== "guest" && !isAuthenticated) {
    return <UnauthorizedFallback />;
  }

  if (role !== allowedRole) {
    return <UnauthorizedFallback />;
  }

  return <>{children}</>;
}

// 3. RoleRedirect Component
export function RoleRedirect() {
  const { role } = useRBAC();
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "worker") return <Navigate to="/worker/dashboard" replace />;
  if (role === "customer") return <Navigate to="/customer/dashboard" replace />;
  return <Navigate to="/" replace />;
}

import { Navigate } from "react-router-dom";

// 4. RoleBasedNavbar Component
export function RoleBasedNavbar() {
  const { role, isAuthenticated, logout } = useRBAC();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 to-indigo-900 bg-clip-text text-transparent">
              Kaam<span className="text-orange-500">Sathi</span>
            </span>
            <span className="block text-[10px] font-medium tracking-widest text-gray-400 uppercase -mt-1">
              {role === "worker" ? "Worker Portal" : role === "customer" ? "Customer Portal" : "Digital Marketplace"}
            </span>
          </div>
        </Link>

        {/* Dynamic Desktop Navigation strictly based on Role */}
        <nav className="hidden lg:flex items-center gap-6">
          {role === "guest" && (
            <>
              <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/services" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Services</Link>
              <Link to="/workers" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Find Workers</Link>
              <Link to="/search" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Search</Link>
              <Link to="/ai" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Saathi
              </Link>
              <Link to="/role-selection" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors font-bold">
                Become a Worker
              </Link>
            </>
          )}

          {role === "customer" && (
            <>
              <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/services" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Services</Link>
              <Link to="/workers" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Find Workers</Link>
              <Link to="/map" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Search & Maps</Link>
              <Link to="/customer/bookings" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">My Bookings</Link>
              <Link to="/customer/saved" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Saved</Link>
              <Link to="/customer/messages" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Messages</Link>
              <Link to="/customer/wallet" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Wallet</Link>
              <Link to="/ai" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Saathi
              </Link>
            </>
          )}

          {role === "worker" && (
            <>
              <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/worker/dashboard" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Dashboard</Link>
              <Link to="/worker/jobs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Job Requests</Link>
              <Link to="/worker/jobs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">My Jobs</Link>
              <Link to="/worker/messages" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Messages</Link>
              <Link to="/worker/earnings" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Earnings</Link>
              <Link to="/worker/wallet" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Wallet</Link>
              <Link to="/ai" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Saathi
              </Link>
            </>
          )}

          {role === "admin" && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold">
              <Shield className="w-4 h-4 text-blue-600" /> Admin Secured Session (<Link to="/admin/dashboard" className="underline">Go to Admin Panel</Link>)
            </div>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {role === "guest" ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/sign-in")}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-gray-500" /> Sign In
              </button>
              <button 
                onClick={() => navigate("/sign-up")}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={role === "worker" ? "/worker/notifications" : "/customer/notifications"} className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500"></span>
              </Link>
              <div 
                onClick={() => navigate(role === "worker" ? "/worker/profile" : "/customer/profile")}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {role === "worker" ? "W" : "C"}
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-gray-800 block capitalize">{role} User</span>
                  <span className="text-emerald-600 font-medium">Online</span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3 shadow-xl">
          {role === "guest" && (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Home</Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Services</Link>
              <Link to="/workers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Find Workers</Link>
              <Link to="/ai" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-blue-600">AI Saathi</Link>
              <div className="pt-2 flex gap-2">
                <button onClick={() => { setMobileMenuOpen(false); navigate("/sign-in"); }} className="flex-1 py-2.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold">Sign In</button>
                <button onClick={() => { setMobileMenuOpen(false); navigate("/sign-up"); }} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">Sign Up</button>
              </div>
            </>
          )}

          {role === "customer" && (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Home</Link>
              <Link to="/customer/bookings" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">My Bookings</Link>
              <Link to="/customer/saved" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Saved Workers</Link>
              <Link to="/customer/wallet" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Wallet</Link>
              <Link to="/customer/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Profile</Link>
              <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="w-full py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold mt-2">Logout</button>
            </>
          )}

          {role === "worker" && (
            <>
              <Link to="/worker/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Dashboard</Link>
              <Link to="/worker/jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Job Requests</Link>
              <Link to="/worker/earnings" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Earnings</Link>
              <Link to="/worker/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-700">Profile</Link>
              <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="w-full py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold mt-2">Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

// 5. RoleBasedFooter Component
export function RoleBasedFooter() {
  const { role } = useRBAC();

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-black">Kaam<span className="text-orange-500">Sathi</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier verified digital labour marketplace connecting households with skilled daily wage professionals with 0% worker commission.
            </p>
          </div>

          {/* Role-Specific Footer Columns */}
          {role === "guest" && (
            <>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Company</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li><Link to="/services" className="hover:text-white">About Us</Link></li>
                  <li><Link to="/services" className="hover:text-white">Services</Link></li>
                  <li><Link to="/workers" className="hover:text-white">Careers</Link></li>
                  <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Legal & Privacy</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li><Link to="/services" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/services" className="hover:text-white">Terms of Service</Link></li>
                  <li><Link to="/services" className="hover:text-white">FAQ</Link></li>
                </ul>
              </div>
            </>
          )}

          {role === "customer" && (
            <>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Customer Portal</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li><Link to="/services" className="hover:text-white">Services Catalog</Link></li>
                  <li><Link to="/customer/bookings" className="hover:text-white">My Bookings</Link></li>
                  <li><Link to="/customer/saved" className="hover:text-white">Saved Workers</Link></li>
                  <li><Link to="/customer/wallet" className="hover:text-white">Wallet</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Support</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li><Link to="/customer/notifications" className="hover:text-white">Help Center</Link></li>
                  <li><Link to="/ai" className="hover:text-white">AI Saathi Assistant</Link></li>
                </ul>
              </div>
            </>
          )}

          {role === "worker" && (
            <>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Worker Portal</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li><Link to="/worker/dashboard" className="hover:text-white">Dashboard</Link></li>
                  <li><Link to="/worker/jobs" className="hover:text-white">Job Requests</Link></li>
                  <li><Link to="/worker/earnings" className="hover:text-white">Earnings</Link></li>
                  <li><Link to="/worker/profile" className="hover:text-white">Verification Status</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Assistance</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li><Link to="/ai" className="hover:text-white">Worker Help Desk</Link></li>
                </ul>
              </div>
            </>
          )}

          {role === "admin" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Admin Control</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link to="/admin/dashboard" className="hover:text-white">Admin Dashboard</Link></li>
                <li><Link to="/admin/reports" className="hover:text-white">Reports & Analytics</Link></li>
                <li><Link to="/admin/settings" className="hover:text-white">Settings</Link></li>
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Download App</h4>
            <p className="text-xs text-slate-400">Get the KaamSathi mobile app on Android & iOS.</p>
            <div className="flex gap-2">
              <span className="px-3 py-2 bg-slate-800 rounded-xl text-[11px] font-bold border border-slate-700">Google Play</span>
              <span className="px-3 py-2 bg-slate-800 rounded-xl text-[11px] font-bold border border-slate-700">App Store</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KaamSathi Technologies India Pvt Ltd. All rights reserved.</p>
          <p>Secure Role-Based Access Control (RBAC) System • Built with React & Node</p>
        </div>
      </div>
    </footer>
  );
}

// 6. RoleBasedSidebar Component (For Dashboards)
export function RoleBasedSidebar({ type }: { type: "customer" | "worker" | "admin" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useRBAC();

  const customerLinks = [
    { label: "Dashboard", path: "/customer/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "My Bookings", path: "/customer/bookings", icon: <FileText className="w-4 h-4" /> },
    { label: "Saved Workers", path: "/customer/saved", icon: <Bookmark className="w-4 h-4" /> },
    { label: "Messages", path: "/customer/messages", icon: <MessageSquare className="w-4 h-4" /> },
    { label: "Wallet & Payments", path: "/customer/wallet", icon: <Wallet className="w-4 h-4" /> },
    { label: "Notifications", path: "/customer/notifications", icon: <Bell className="w-4 h-4" /> },
    { label: "Profile", path: "/customer/profile", icon: <UserIcon className="w-4 h-4" /> },
  ];

  const workerLinks = [
    { label: "Dashboard", path: "/worker/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Job Requests", path: "/worker/jobs", icon: <Briefcase className="w-4 h-4" /> },
    { label: "My Bookings", path: "/worker/jobs", icon: <FileText className="w-4 h-4" /> },
    { label: "Messages", path: "/worker/messages", icon: <MessageSquare className="w-4 h-4" /> },
    { label: "Earnings & Payouts", path: "/worker/earnings", icon: <Wallet className="w-4 h-4" /> },
    { label: "Wallet", path: "/worker/wallet", icon: <Wallet className="w-4 h-4" /> },
    { label: "Notifications", path: "/worker/notifications", icon: <Bell className="w-4 h-4" /> },
    { label: "Profile & Verification", path: "/worker/profile", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const adminLinks = [
    { label: "Admin Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Users Management", path: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { label: "Workers Verification", path: "/admin/workers", icon: <ShieldCheck className="w-4 h-4" /> },
    { label: "Bookings", path: "/admin/bookings", icon: <FileText className="w-4 h-4" /> },
    { label: "Categories", path: "/admin/categories", icon: <Wrench className="w-4 h-4" /> },
    { label: "Payments", path: "/admin/payments", icon: <Wallet className="w-4 h-4" /> },
    { label: "Complaints", path: "/admin/complaints", icon: <ShieldAlert className="w-4 h-4" /> },
    { label: "Reports & Analytics", path: "/admin/reports", icon: <Activity className="w-4 h-4" /> },
    { label: "Settings", path: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const links = type === "worker" ? workerLinks : type === "admin" ? adminLinks : customerLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {type.toUpperCase()} NAVIGATION
          </span>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
