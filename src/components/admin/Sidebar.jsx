import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  LogOut,
  X,
  ChevronRight,
  Wallet,
  School,
  BookOpen,
  ClipboardList,
  ClipboardEdit,
  Calendar,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      title: "Students",
      icon: <Users size={20} />,
      path: "/admin/students",
    },
    {
      title: "Classes",
      icon: <School size={20} />,
      path: "/admin/classes",
    },
    {
      title: "Subjects",
      icon: <BookOpen size={20} />,
      path: "/admin/subjects",
    },
    {
      title: "Results",
      icon: <ClipboardList size={20} />,
      path: "/admin/results",
    },
    {
      title: "Enter Scores",
      icon: <ClipboardEdit size={20} />,
      path: "/admin/results/enter",
    },
    {
      title: "Fee Structure",
      icon: <Wallet size={20} />,
      path: "/admin/fees/structure",
    },
    {
      title: "Payments",
      icon: <CreditCard size={20} />,
      path: "/admin/fees/payments",
    },
    {
      title: "Academic",
      icon: <Calendar size={20} />,
      path: "/admin/settings/academic",
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      path: "/admin/settings",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col h-screen transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 shrink-0">
          <img
            src="/images/final_crest.png"
            alt="Marian Foundation"
            className="object-contain w-10 h-10 bg-white rounded-full p-0.5"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold leading-tight font-heading truncate">
              Marian Foundation
            </h1>
            <p className="text-xs text-white/70">Admin Portal</p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg lg:hidden hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1">{item.title}</span>
              <ChevronRight
                size={15}
                className="opacity-0 group-[.active]:opacity-100 group-hover:opacity-70 transition-opacity"
              />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10 shrink-0">
          <button
            onClick={() => {
              window.location.href = "/auth/admin-login";
            }}
            className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-white/80 hover:bg-secondary hover:text-white transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
