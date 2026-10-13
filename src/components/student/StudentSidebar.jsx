import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileCheck2,
  Wallet,
  BookOpen,
  User,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // adjust path

const navItems = [
  {
    name: "Dashboard",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Terminal Results",
    path: "/student/results",
    icon: FileCheck2,
    badge: "Report",
  },
  {
    name: "Fees & Payments",
    path: "/student/fees",
    icon: Wallet,
  },
  {
    name: "My Profile",
    path: "/student/profile",
    icon: User,
  },
];

const StudentSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const profile = user?.studentProfile;
  const className =
    (typeof profile === "object" && profile?.class?.name) || "";
  const classShort = className
    ? className
        .replace(/Primary/i, "P")
        .replace(/JSS/i, "J")
        .replace(/SS/i, "S")
        .replace(/\s+/g, "")
        .slice(0, 3)
        .toUpperCase()
    : "ST";

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student"
    : "Student";
  const admissionNo = user?.admissionNumber || "—";

  const handleLogout = () => {
    logout();
    navigate("/auth/student-login", { replace: true });
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 transition-opacity bg-dark/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col h-full max-h-screen transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
            <div className="flex items-center min-w-0 gap-3">
              <div className="flex items-center justify-center w-10 h-10 p-1 bg-white shadow-xs rounded-xl shrink-0">
                <img
                  src="/images/final_crest.png"
                  alt="Marian Foundation Academy Logo"
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="min-w-0 leading-tight">
                <h2 className="text-sm font-extrabold tracking-tight text-white truncate font-heading">
                  MARIAN ACADEMY
                </h2>
                <span className="text-[10px] text-highlight font-semibold uppercase tracking-wider">
                  Student Portal
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 lg:hidden transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mx-4 my-4 p-3.5 bg-accent/60 border border-white/10 rounded-xl flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 text-[10px] font-extrabold rounded-lg bg-secondary/20 text-secondary shrink-0 font-heading">
              {classShort}
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-xs font-bold text-white truncate font-heading">
                {displayName}
              </p>
              <p className="text-[10px] text-white/70 font-mono truncate">
                {admissionNo}
              </p>
              {className && (
                <p className="text-[10px] text-white/60 truncate">{className}</p>
              )}
            </div>
          </div>

          <nav className="px-3 space-y-1.5 flex-1 overflow-y-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-secondary text-white shadow-xs"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/20 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 space-y-3 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-white/70 px-2">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
            <span>Student Portal</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-rose-600 text-white text-xs font-heading font-bold rounded-xl transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;