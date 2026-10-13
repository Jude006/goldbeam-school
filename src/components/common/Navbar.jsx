import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const portalLinks = [
  { name: "Student Portal", path: "/auth/student-login" },
  { name: "School Admin Portal", path: "/auth/admin-login" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [mobilePortalOpen, setMobilePortalOpen] = useState(false);
  const location = useLocation();
  const portalRef = useRef(null);

  // Close menus when route changes
  useEffect(() => {
    setIsOpen(false);
    setPortalOpen(false);
    setMobilePortalOpen(false);
  }, [location]);

  // Handle navbar background shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (portalRef.current && !portalRef.current.contains(e.target)) {
        setPortalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Active check for any portal/auth subroutes or protected user routes
  const isPortalActive =
    location.pathname.startsWith("/auth") ||
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/admin");

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-1"
          : "bg-white/95 backdrop-blur-md py-2"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center min-w-0 sm:gap-3">
            <img
              src="/images/logo.png"
              alt="Golden Bunch Schools"
              loading="lazy"
              className="object-contain w-12 h-10 shrink-0 sm:w-12 sm:h-12 md:h-14 md:w-14"
            />
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-bold leading-tight truncate font-heading sm:text-base md:text-lg text-primary">
                GoldBeam Schools
              </p>

              <p className="text-[10px] sm:text-xs font-medium text-dark/70 truncate">
                Excellence and Discipline
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-8 lg:flex">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-[15px] font-body font-medium transition-colors duration-200 ${
                    active
                      ? "text-secondary font-semibold"
                      : "text-dark/80 hover:text-secondary"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Portal Dropdown */}
            <div className="relative" ref={portalRef}>
              <button
                onClick={() => setPortalOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={portalOpen}
                className={`relative flex items-center gap-1 text-[15px] font-medium transition-colors duration-200 ${
                  isPortalActive || portalOpen
                    ? "text-secondary font-semibold"
                    : "text-dark/80 hover:text-secondary"
                }`}
              >
                Portal
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${portalOpen ? "rotate-180" : ""}`}
                />
                {isPortalActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary rounded-full" />
                )}
              </button>

              {portalOpen && (
                <div className="absolute right-0 z-20 w-56 py-2 mt-3 bg-white border shadow-xl top-full rounded-xl border-light">
                  {portalLinks.map((link) => {
                    const active = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "text-secondary bg-secondary/5 font-semibold"
                            : "text-dark/80 hover:text-secondary hover:bg-light"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="items-center hidden lg:flex">
            <Link
              to="/admissions"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-full shadow-[0_10px_20px_-8px_rgba(254,98,64,0.55)] hover:bg-highlight transition-all duration-300"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="p-2 transition rounded-lg lg:hidden text-dark hover:bg-light"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      <div
        className={`lg:hidden bg-white border-t overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-[15px] font-medium transition ${
                  active
                    ? "bg-secondary/10 text-secondary"
                    : "text-dark/80 hover:bg-light"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Mobile Portal Accordion */}
          <div>
            <button
              onClick={() => setMobilePortalOpen((prev) => !prev)}
              aria-expanded={mobilePortalOpen}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-[15px] font-medium transition ${
                isPortalActive
                  ? "bg-secondary/10 text-secondary"
                  : "text-dark/80 hover:bg-light"
              }`}
            >
              Portal
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  mobilePortalOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobilePortalOpen ? "max-h-60 mt-1" : "max-h-0"
              }`}
            >
              {portalLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`block px-8 py-2.5 rounded-lg text-sm font-medium transition ${
                      active
                        ? "text-secondary font-semibold"
                        : "text-dark/70 hover:bg-light"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-light">
            <Link
              to="/admissions"
              className="block w-full px-4 py-3 text-sm font-semibold text-center text-white rounded-full bg-secondary"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;