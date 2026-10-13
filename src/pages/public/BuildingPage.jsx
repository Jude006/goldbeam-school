// src/pages/public/BuildingPage.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BuildingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show text after 1 second
    const textTimer = setTimeout(() => setShowText(true), 1000);

    // Animate progress bar
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // Navigate to home after progress completes
          setTimeout(() => navigate("/"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearTimeout(textTimer);
      clearInterval(progressTimer);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image - School Building */}
      <img
        src="/images/school_building3a.jpg"
        alt="Amazing Grace Academy"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />

      {/* Overlay - Dark at bottom for text, lighter at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      {/* Content - Centered */}
      <div className="relative z-10 flex h-full min-h-screen flex-col items-center justify-center px-4 text-center text-white">
        {/* Archdiocese */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase text-white/60"
        >
          Archdiocese of Onitsha
        </motion.p>

        {/* School Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Marian Foundation
          <br />
          <span className="text-secondary">Academy School</span>
        </motion.h1>

        {/* Motto */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-3 text-sm font-semibold tracking-wide text-white/70"
        >
          Love · Service · Excellence
        </motion.p>

        {/* Loading Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 w-full max-w-xs"
        >
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-secondary"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="mt-2 text-xs text-white/40">
            {progress < 100 ? "Loading..." : "Welcome!"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BuildingPage;
