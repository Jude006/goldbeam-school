import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Replace with your preferred school facility/campus image path
import bannerBg from "/images/school_building3a.jpg";

const AboutBanner = () => {
  return (
    <div className="w-full bg-white select-none">
      {/* 1. Main Short Header Banner */}
      <div className="relative flex items-center w-full h-48 overflow-hidden sm:h-56 md:h-64 lg:h-72">
        {/* Background Image */}
        <img
          src={bannerBg}
          alt="Marian Foundation Academy Campus"
          className="absolute inset-0 object-cover w-full h-full"
        />

        {/* Dark Contrast Overlay */}
        <div className="absolute inset-0 bg-black/35 backdrop-brightness-90" />

        {/* Content Container */}
        <div className="relative z-10 w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Left Vertical Accent Line (Matching the reference screenshot) */}
            <div className="w-1.5 h-12 sm:h-16 bg-red-600 rounded-full shrink-0" />

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-wider text-white uppercase font-heading sm:text-4xl md:text-5xl">
              ABOUT US
            </h1>
          </div>
        </div>
      </div>

      {/* 2. Breadcrumb Bar */}
      <div className="py-3 border-b border-gray-100 bg-slate-50/50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-medium sm:text-sm text-slate-500">
            <Link to="/" className="transition-colors hover:text-sky-600">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">About Us</span>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AboutBanner;
