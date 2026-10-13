// src/components/home/banner.jsx

import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const OptimizedImage = lazy(() => import("../common/OptimizedImage"));

const SLIDE_DURATION = 5500;

const slides = [
  {
    src: "/images/bg2.jpg",
    mobileSrc: "/images/bg2.jpg",
    eyebrow: "Welcome",
    heading: "Goldbeam Schools",
    subheading:
      "An educational institution committed to academic excellence, discipline, and raising future leaders.",
  },
  {
    src: "/images/classroom1.webp",
    mobileSrc: "/images/classroom1.webp",
    eyebrow: "Our Motto",
    heading: "Arise and Shine",
    subheading:
      "We nurture every student to discover their potential, build strong character, and shine in all areas of life.",
  },
  {
    src: "/images/staff3.webp",
    mobileSrc: "/images/staff3.webp",
    eyebrow: "Why Choose Us",
    heading: "Excellence in a Nurturing Environment",
    subheading:
      "Quality teaching, strong discipline, and sound moral values in a safe and supportive learning environment.",
  },
];

const stats = [
  { label: "Excellence", detail: "In Academics and Character" },
  { label: "Discipline", detail: "A Strong Foundation for Life" },
  { label: "Full Education", detail: "Nursery to Secondary" },
];

const textVariants = {
  enter: { opacity: 0, y: 24 },
  center: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.35 } },
};

const lineVariants = {
  enter: { opacity: 0, y: 18 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -8 },
};

const StatsStrip = () => (
  <div className="relative z-20 px-4 -mt-14 sm:-mt-16 sm:px-6 lg:px-8">
    <div className="grid max-w-4xl grid-cols-1 mx-auto overflow-hidden bg-white shadow-xl sm:grid-cols-3 rounded-2xl">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`px-6 py-5 text-center sm:text-left ${
            i !== stats.length - 1
              ? "border-b sm:border-b-0 sm:border-r border-light"
              : ""
          }`}
        >
          <p className="text-lg font-bold font-heading text-primary">
            {stat.label}
          </p>
          <p className="text-xs font-medium text-gray">{stat.detail}</p>
        </div>
      ))}
    </div>
  </div>
);

const HomeBanner = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const goTo = useCallback((i) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || prefersReducedMotion) return undefined;
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [index, paused, prefersReducedMotion]);

  const getImageSrc = (slide) => {
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      slide.mobileSrc
    ) {
      return slide.mobileSrc;
    }
    return slide.src;
  };

  const current = slides[index];

  return (
    <>
      <section
        className="relative h-[100dvh] min-h-[520px] max-h-[920px] w-full overflow-hidden bg-primary"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background slides */}
        <div className="absolute inset-0" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${index}`}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.02 }}
              animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : 1.04 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.7 },
                scale: {
                  duration: SLIDE_DURATION / 1000 + 0.5,
                  ease: "linear",
                },
              }}
            >
              <Suspense fallback={<div className="w-full h-full bg-primary" />}>
                <OptimizedImage
                  src={getImageSrc(current)}
                  alt={current.heading}
                  className="object-cover object-center w-full h-full"
                  effect="blur"
                />
              </Suspense>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-primary/20 to-primary/20" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-20 text-center text-white sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${index}`}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-4xl"
            >
              <motion.p
                variants={lineVariants}
                className="mb-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-white/90 font-body sm:text-xs"
              >
                Iroko Town, Ogun State
              </motion.p>

              <motion.span
                variants={lineVariants}
                className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-[0.2em] uppercase rounded-full bg-white/10 backdrop-blur-sm border border-white/20 font-body"
              >
                {current.eyebrow}
              </motion.span>

              <motion.h1
                variants={lineVariants}
                className="mb-3 text-3xl font-bold leading-tight font-heading sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-md"
              >
                {current.heading}
              </motion.h1>

              {index === 0 && (
                <motion.p
                  variants={lineVariants}
                  className="mb-3 text-sm font-semibold tracking-wide text-secondary sm:text-base font-heading"
                >
                  Arise and Shine
                </motion.p>
              )}

              <motion.p
                variants={lineVariants}
                className="max-w-2xl mx-auto text-sm font-normal leading-relaxed sm:text-base md:text-lg text-white/90 font-body"
              >
                {current.subheading}
              </motion.p>

              <motion.div
                variants={lineVariants}
                className="flex flex-wrap items-center justify-center gap-3 mt-8 sm:gap-4"
              >
                <Link
                  to="/admissions"
                  className="px-6 py-3 text-sm font-semibold transition-all duration-300 bg-white rounded-full shadow-lg sm:px-7 sm:py-3.5 text-primary hover:bg-light hover:-translate-y-0.5"
                >
                  Apply Now
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 text-sm font-semibold text-white transition-all duration-300 border-2 rounded-full sm:px-7 sm:py-3.5 border-white/50 hover:bg-white/10"
                >
                  Discover Our Story
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="absolute z-10 flex items-center gap-2 -translate-x-1/2 bottom-8 left-1/2">
          {slides.map((slide, i) => {
            const isActive = index === i;
            return (
              <button
                key={slide.src + i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show slide: ${slide.heading}`}
                className="relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-[width] duration-300"
                style={{ width: isActive ? 40 : 18 }}
              >
                {isActive && !prefersReducedMotion ? (
                  <motion.span
                    key={`bar-${index}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-secondary"
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? undefined : "100%" }}
                    transition={{
                      duration: SLIDE_DURATION / 1000,
                      ease: "linear",
                    }}
                  />
                ) : isActive ? (
                  <span className="absolute inset-0 rounded-full bg-secondary" />
                ) : null}
              </button>
            );
          })}
        </div>

        {!prefersReducedMotion && (
          <motion.div
            className="absolute z-10 hidden -translate-x-1/2 sm:block bottom-24 left-1/2 text-white/70"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={26} />
          </motion.div>
        )}
      </section>

      <Suspense fallback={<div className="h-20" />}>
        <StatsStrip />
      </Suspense>
    </>
  );
};

export default HomeBanner;