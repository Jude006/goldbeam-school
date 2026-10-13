import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, HelpCircle } from "lucide-react";

const NotFound = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    // Decrement timer every second
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect when countdown hits 0
    const redirect = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen p-4 overflow-hidden select-none bg-slate-50">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute rounded-full pointer-events-none top-1/4 -left-20 w-72 h-72 bg-sky-200/40 blur-3xl" />
      <div className="absolute rounded-full pointer-events-none bottom-1/4 -right-20 w-72 h-72 bg-amber-200/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md p-8 text-center bg-white border shadow-xl border-slate-200/80 rounded-2xl"
      >
        {/* Crest Crest / Icon Header */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img
              src="/images/final_crest.png"
              alt="Marian Foundation Academy Crest"
              className="object-contain w-16 h-16 drop-shadow-sm"
            />
            <div className="absolute p-1 text-white rounded-full shadow-xs -bottom-1 -right-1 bg-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 404 Large Badge */}
        <div className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest uppercase border rounded-full bg-sky-50 border-sky-100 text-sky-600 font-heading">
          Error 404
        </div>

        <h1 className="mb-2 text-2xl font-extrabold tracking-tight font-heading sm:text-3xl text-slate-800">
          Page Not Found
        </h1>

        <p className="mb-6 text-xs leading-relaxed sm:text-sm text-slate-500">
          The page you are looking for doesn't exist or has been moved. Don't worry, we are taking you back home!
        </p>

        {/* Countdown Auto-Redirect Bar */}
        <div className="flex items-center justify-between p-3 mb-6 border bg-slate-50 border-slate-100 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-sky-400"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
            Redirecting automatically...
          </div>
          <span className="font-heading font-black text-sky-600 text-sm px-2 py-0.5 bg-sky-100 rounded-md">
            {countdown}s
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Link
            to="/"
            className="w-full py-3 px-4 bg-[#0f2a4a] hover:bg-sky-900 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home Page</span>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-slate-100 text-slate-600 font-medium text-xs rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back Previous Page</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;