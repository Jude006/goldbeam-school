import React, { useState } from "react";
import { Settings as SettingsIcon, Save, KeyRound, Mail, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // adjust path
import {
  requestPasswordChangeCode,
  confirmPasswordChange,
} from "../../api/authApi"; // adjust path

const Settings = () => {
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1 = request code, 2 = enter code + new password
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "—";

  const handleRequestCode = async () => {
    setMessage({ type: "", text: "" });
    setLoading(true);
    try {
      const data = await requestPasswordChangeCode();
      setMessage({
        type: "success",
        text: data.message || "Code sent to your email.",
      });
      setStep(2);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Could not send code.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const data = await confirmPasswordChange({
        code: code.trim(),
        newPassword,
        confirmPassword,
      });
      setMessage({
        type: "success",
        text: data.message || "Password updated successfully.",
      });
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
      setStep(1);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Could not update password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-body text-dark select-none">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-primary">
          <SettingsIcon className="w-4 h-4 text-secondary" />
          Account
        </div>
        <h1 className="font-heading text-2xl font-extrabold mt-1">Settings</h1>
        <p className="text-xs text-gray mt-0.5">
          View your admin profile and change password.
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="font-heading text-xs font-bold text-secondary uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <User className="w-4 h-4" />
          Profile Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-gray mb-1">Full Name</p>
            <p className="font-heading font-bold">{displayName}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray mb-1">Email</p>
            <p className="font-medium flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary" />
              {user?.email || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray mb-1">Role</p>
            <p className="font-medium capitalize">{user?.role || "admin"}</p>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="font-heading text-xs font-bold text-secondary uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <KeyRound className="w-4 h-4" />
          Change Password
        </h3>

        {message.text && (
          <div
            className={`px-3 py-2.5 text-xs font-medium rounded-xl border ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray">
              We will send a <strong>6-digit code</strong> to{" "}
              <strong>{user?.email}</strong>. Enter it to set a new password.
            </p>
            <button
              type="button"
              onClick={handleRequestCode}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white text-xs font-heading font-bold rounded-xl cursor-pointer disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleConfirmPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                6-Digit Code *
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full max-w-xs px-3.5 py-2.5 text-sm tracking-[0.3em] font-bold bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars, upper, lower, number"
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-light border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setCode("");
                  setMessage({ type: "", text: "" });
                }}
                className="px-4 py-2.5 text-xs font-heading font-bold bg-light rounded-xl cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-white text-xs font-heading font-bold rounded-xl cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;