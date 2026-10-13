import { Mail, PhoneCall } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <header className="w-full text-white bg-primary">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-10 px-4 py-2.5 md:px-20 text-sm md:text-[15px]">
        {/* Phone */}
        <a
          href="tel:+2348035764123"
          className="flex items-center gap-2 transition-colors duration-200 hover:text-secondary"
        >
          <PhoneCall size={16} className="text-secondary" />
          <span>08035764123</span>
        </a>

        {/* Email */}
        <a
          href="mailto:goldbeamschools@gmail.com"
          className="flex items-center gap-2 transition-colors duration-200 hover:text-secondary"
        >
          <Mail size={16} className="text-secondary" />
          <span className="hidden sm:inline">goldbeamschools@gmail.com</span>
          <span className="sm:hidden">Email Us</span>
        </a>
      </div>
    </header>
  );
};

export default Header;