import React, { useState } from "react";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { loginAdmin, isAuthenticated, isAdmin, loading } = useAuth();

  // Already logged in as admin → dashboard
  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await loginAdmin(formData.email, formData.password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Check your credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 overflow-hidden select-none bg-[#242424]">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover opacity-[0.14] pointer-events-none z-0"
        style={{
          backgroundImage: `url('/images/studentbg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-[420px] mx-auto">
        {/* Crest Logo & Portal Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <img
            src="/images/final_crest.png"
            alt="Marian Foundation Academy Crest"
            className="object-contain w-16 h-16 mb-3 sm:w-20 sm:h-20 drop-shadow-lg"
          />
          <h1 className="text-lg font-black text-white uppercase font-heading sm:text-2xl">
            MARIAN FOUNDATION ACADEMY PORTAL
          </h1>
        </div>

        {/* Login Form Card */}
        <div className="w-full p-6 bg-white border rounded-sm shadow-2xl border-gray-100/80 sm:p-9">
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="text-xl font-bold tracking-tight font-heading sm:text-2xl text-slate-700">
              Admin Login
            </h2>
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase mt-1">
              AUTHORIZED PERSONNEL ONLY
            </p>
          </div>

          {error && (
            <div className="mb-4 px-3 py-2.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
              >
                EMAIL ADDRESS:
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-0 flex items-center pl-3 transition-colors pointer-events-none text-slate-400 group-focus-within:text-sky-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@marianfoundation.edu"
                  required
                  autoComplete="email"
                  disabled={submitting}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 focus:border-sky-500 text-sm text-slate-800 placeholder-slate-400 rounded-none outline-none transition-all duration-200 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
              >
                PASSWORD:
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-0 flex items-center pl-3 transition-colors pointer-events-none text-slate-400 group-focus-within:text-sky-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  disabled={submitting}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 focus:border-sky-500 text-sm text-slate-800 placeholder-slate-400 rounded-none outline-none transition-all duration-200 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#2ba3f7] hover:bg-[#1b8cee] active:scale-[0.99] text-white font-semibold text-sm rounded-none shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Authenticate Admin"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;