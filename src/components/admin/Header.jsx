import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAdmissions } from "../../api/admissionApi";

const SEEN_KEY = "mfa_seen_admission_ids";

const getSeenIds = () => {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
};

const addSeenIds = (ids = []) => {
  const seen = getSeenIds();
  ids.forEach((id) => {
    if (id) seen.add(String(id));
  });
  localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
};

const Header = ({ setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Administrator"
    : "Administrator";

  const initials = user
    ? `${(user.firstName || "A")[0]}${(user.lastName || "")[0] || ""}`.toUpperCase()
    : "A";

  const refreshBadge = useCallback(async () => {
    try {
      const data = await getAdmissions({ status: "new" });
      const apps = data.applications || [];
      const seen = getSeenIds();

      // Only count "new" apps the admin has not opened/viewed yet
      const unseen = apps.filter((a) => a?._id && !seen.has(String(a._id)));
      setNewCount(unseen.length);
    } catch {
      setNewCount(0);
    }
  }, []);

  // Mark current new applications as seen when admin is on Admissions page
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const onAdmissions = location.pathname.includes("/admin/admissions");

      if (onAdmissions) {
        try {
          const data = await getAdmissions({ status: "new" });
          if (cancelled) return;
          const ids = (data.applications || []).map((a) => a._id).filter(Boolean);
          addSeenIds(ids);
          setNewCount(0); // viewed → clear badge
        } catch {
          if (!cancelled) setNewCount(0);
        }
        return;
      }

      await refreshBadge();
    };

    run();

    const onFocus = () => {
      if (!location.pathname.includes("/admin/admissions")) {
        refreshBadge();
      }
    };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [location.pathname, refreshBadge]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/auth/admin-login", { replace: true });
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 transition rounded-lg lg:hidden text-dark hover:bg-light"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-lg font-semibold font-heading text-dark">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/admin/admissions"
          className="relative p-2 transition rounded-lg hover:bg-light text-dark"
          title={
            newCount > 0
              ? `${newCount} new admission application${newCount === 1 ? "" : "s"}`
              : "Admission applications"
          }
          aria-label={
            newCount > 0
              ? `Admissions, ${newCount} new`
              : "Admission applications"
          }
        >
          <Bell size={20} />
          {newCount > 0 && (
            <span className="absolute flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white rounded-full -top-0.5 -right-0.5 bg-secondary leading-none">
              {newCount > 99 ? "99+" : newCount}
            </span>
          )}
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-lg hover:bg-light transition"
          >
            <div className="flex items-center justify-center text-sm font-semibold text-white rounded-full w-9 h-9 bg-primary">
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-dark">
                {displayName}
              </p>
              <p className="text-xs text-gray">School Admin</p>
            </div>

            <ChevronDown
              size={16}
              className={`text-gray transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 transition-all duration-200 origin-top-right
              ${
                dropdownOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-dark">{displayName}</p>
              <p className="text-xs truncate text-gray">{user?.email || "—"}</p>
            </div>

            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/admin/settings");
                }}
                className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-dark hover:bg-light transition"
              >
                <User size={17} />
                My Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;