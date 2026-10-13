import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Wallet,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const StudentHeader = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const ref = useRef(null);

  const profile =
    user?.studentProfile && typeof user.studentProfile === "object"
      ? user.studentProfile
      : null;

  const className = profile?.class?.name || profile?.className || "";

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student"
    : "Student";

  const admissionNo = user?.admissionNumber || profile?.admissionNumber || "—";
  const initial = (displayName[0] || "S").toUpperCase();
  const passportUrl = profile?.passportUrl || "";

  // Reset image error when user / photo changes
  useEffect(() => {
    setImgFailed(false);
  }, [passportUrl, user?._id]);

  const balanceDue = null; // wire fees later if needed

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/auth/student-login", { replace: true });
  };

  const Avatar = ({ className: boxClass }) => {
    const showPhoto = passportUrl && !imgFailed;
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden text-sm font-black text-white bg-primary font-heading shadow-2xs ${boxClass}`}
      >
        {showPhoto ? (
          <img
            src={passportUrl}
            alt={displayName}
            className="object-cover w-full h-full"
            onError={() => setImgFailed(true)}
          />
        ) : (
          initial
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200/80 sm:px-6 shadow-2xs">
      <div className="flex items-center min-w-0 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 transition-colors cursor-pointer text-dark hover:bg-light rounded-xl lg:hidden shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight truncate font-heading sm:text-lg text-dark">
              Welcome, <span className="text-primary">{displayName}</span>
            </h1>
            {className ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-heading font-bold rounded-full border border-primary/20">
                <Sparkles className="w-3 h-3 text-secondary" />
                {className}
              </span>
            ) : null}
          </div>
          <p className="text-[11px] font-mono text-gray truncate">
            ID: <span className="font-bold text-dark">{admissionNo}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {balanceDue !== null && (
          <Link
            to="/student/fees"
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-heading font-bold transition-all ${
              balanceDue > 0
                ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>
              {balanceDue > 0
                ? `Owes: ₦${Number(balanceDue).toLocaleString()}`
                : "Fees Cleared"}
            </span>
          </Link>
        )}

        <button
          type="button"
          className="relative p-2 transition-colors cursor-pointer text-gray hover:text-primary hover:bg-light rounded-xl"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="hidden w-px h-6 bg-slate-200 sm:block" />

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 p-1 transition-colors cursor-pointer hover:bg-light rounded-xl group"
          >
            <Avatar className="w-9 h-9 rounded-xl" />
            <div className="hidden leading-tight text-left xl:block">
              <span className="block text-xs font-bold font-heading text-dark group-hover:text-primary truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="block text-[10px] text-gray">Student</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray hidden sm:block transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 z-50 w-52 mt-2 overflow-hidden bg-white border shadow-lg rounded-xl border-slate-100">
              <div className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-100">
                <Avatar className="w-10 h-10 rounded-xl shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate text-dark">
                    {displayName}
                  </p>
                  <p className="text-[10px] font-mono text-gray truncate">
                    {admissionNo}
                  </p>
                </div>
              </div>
              <Link
                to="/student/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-dark hover:bg-light"
              >
                <User className="w-3.5 h-3.5" />
                My Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center w-full gap-2 px-3 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;