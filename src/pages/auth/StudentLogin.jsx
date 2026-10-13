import React, { useState } from "react";
import { User, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { loginStudent } = useAuth();

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await loginStudent(
        formData.userId.trim(),
        formData.password
      );

      setSuccess(data.message || "Login successful. Welcome!");
      setTimeout(() => {
        navigate("/student/dashboard", { replace: true });
      }, 700);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 overflow-hidden select-none bg-[#242424]">
      <div
        className="absolute inset-0 bg-repeat opacity-[0.14] pointer-events-none z-0"
        style={{
          backgroundImage: `url('/images/studentbg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-[420px] mx-auto">
        <div className="flex flex-col items-center mb-6 text-center">
          <img
            src="/images/final_crest.png"
            alt="Marian Foundation Academy Crest"
            className="object-contain w-16 h-16 mb-3 sm:w-20 sm:h-20 drop-shadow-lg"
          />
          <h1 className="text-lg font-black leading-snug tracking-wider text-white uppercase font-heading sm:text-2xl">
            MARIAN FOUNDATION ACADEMY PORTAL
          </h1>
        </div>

        <div className="w-full p-6 bg-white border rounded-sm shadow-2xl border-gray-100/80 sm:p-9">
          <div className="mb-5 text-center sm:mb-6">
            <h2 className="text-xl font-bold tracking-tight font-heading sm:text-2xl text-slate-700">
              Student Login
            </h2>
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase mt-1">
              Student &amp; Parent Access
            </p>
          </div>

          {/* How to sign in — correction #6 */}
          <div className="px-3 py-3 mb-5 text-left border rounded-sm border-slate-200 bg-slate-50">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              How to sign in
            </p>
            <p className="text-[12px] leading-relaxed text-slate-600">
              Use your{" "}
              <span className="font-bold text-slate-800">Admission Number</span>{" "}
              (for example{" "}
              <span className="font-mono font-semibold text-slate-800">
                MFA/2026/001
              </span>
              ) and the{" "}
              <span className="font-bold text-slate-800">password</span> given
              to you by the school.
            </p>
          </div>

          {error && (
            <div className="mb-4 px-3 py-2.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 px-3 py-2.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="userId"
                className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
              >
                ADMISSION NUMBER:
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-0 flex items-center pl-3 transition-colors pointer-events-none text-slate-400 group-focus-within:text-sky-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="userId"
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="e.g. MFA/2026/001"
                  required
                  autoComplete="username"
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 focus:border-sky-500 text-sm text-slate-800 placeholder-slate-400 rounded-none outline-none transition-all duration-200 disabled:opacity-60"
                />
              </div>
            </div>

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
                  placeholder="Password from the school"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 focus:border-sky-500 text-sm text-slate-800 placeholder-slate-400 rounded-none outline-none transition-all duration-200 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2ba3f7] hover:bg-[#1b8cee] active:scale-[0.99] text-white font-semibold text-sm rounded-none shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-500 pt-1 leading-relaxed">
              Forgot password? Contact the school office to get a new one.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;