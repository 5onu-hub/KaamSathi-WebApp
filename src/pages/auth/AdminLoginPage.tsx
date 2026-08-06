import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Lock, Mail, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@kaamsathi.com" && password === "admin123") {
        localStorage.setItem("kaamsathi_role", "admin");
        localStorage.setItem("kaamsathi_admin_auth", "true");
        localStorage.setItem("kaamsathi_mock_auth", "true");
        toast.success("Admin Authentication Successful!");
        navigate("/admin/dashboard");
      } else {
        // Allow any secure admin email in demo or fallback
        if (email.endsWith("@kaamsathi.com") && password.length >= 6) {
          localStorage.setItem("kaamsathi_role", "admin");
          localStorage.setItem("kaamsathi_admin_auth", "true");
          localStorage.setItem("kaamsathi_mock_auth", "true");
          toast.success("Admin Authentication Successful!");
          navigate("/admin/dashboard");
        } else {
          toast.error("Invalid Admin Credentials. Use admin@kaamsathi.com / admin123");
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <Toaster position="top-right" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30 mb-6">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-center text-3xl font-black tracking-tight text-white">
          Admin Portal Login
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400">
          Strictly restricted to authorized KaamSathi administrators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl border border-slate-800">
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kaamsathi.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Secure Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating Admin..." : "Authenticate Admin Session"}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Demo Admin Credentials:</span>
            <code className="text-xs text-purple-400 font-mono mt-1 block">admin@kaamsathi.com / admin123</code>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
