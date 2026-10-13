// src/components/gallery/GallerySection.jsx

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpandAlt,
  FaGraduationCap,
  FaCamera,
} from "react-icons/fa";

const galleryData = [
  // Excursion – River Niger, Onitsha
  {
    id: 1,
    title: "Excursion to Basilica of the Most Holy Trinity",
    tag: "Educational Excursion",
    src: "/images/gallery1.webp",
    span: "col-span-1 row-span-1",
  },
  {
    id: 2,
    title: "Basilica of the Most Holy Trinity",
    tag: "Educational Excursion",
    src: "/images/gallery5.webp",
    span: "col-span-1 row-span-2",
  },
  {
    id: 3,
    title: "Learning Outside the Classroom",
    tag: "Educational Excursion",
    src: "/images/gallery12.webp",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    title: "MFAS Student on Excursion",
    tag: "Educational Excursion",
    src: "/images/gallery6.webp",
    span: "col-span-1 row-span-1",
  },
  // Free Scholarship Programme
  {
    id: 5,
    title: "Free Scholarship Programme",
    tag: "Scholarship",
    src: "/images/gallery7.webp",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    title: "Scholarship Beneficiaries",
    tag: "Scholarship",
    src: "/images/gallery13.webp",
    span: "col-span-1 row-span-2",
  },
  {
    id: 7,
    title: "Supporting Bright Futures",
    tag: "Scholarship",
    src: "/images/gallery14.webp",
    span: "col-span-1 row-span-1",
  },
  // Food & Nutrition Practical
  {
    id: 8,
    title: "Food and Nutrition Practical",
    tag: "Practical Learning",
    src: "/images/gallery10.webp",
    span: "col-span-1 row-span-2",
  },
  {
    id: 9,
    title: "Hands-on Cooking Session",
    tag: "Practical Learning",
    src: "/images/gallery11.webp",
    span: "col-span-1 row-span-2",
  },
  {
    id: 10,
    title: "Students in the Nutrition Lab",
    tag: "Practical Learning",
    src: "/images/gallery8.webp",
    span: "col-span-1 row-span-1",
  },
  {
    id: 11,
    title: "Student Learning On Baking and Nutrition",
    tag: "Practical Learning",
    src: "/images/gallery9.webp",
    span: "col-span-1 row-span-1",
  },
];

const OptimizedImage = React.memo(function OptimizedImage({
  src,
  alt,
  className,
  loading = "lazy",
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-200">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 bg-slate-100">
          Image unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
});

const GalleryItem = React.memo(function GalleryItem({ image, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      onClick={() => onClick(index)}
      className={`relative overflow-hidden transition-all duration-300 bg-white border shadow-sm cursor-pointer group  border-slate-200/80 hover:shadow-xl ${image.span}`}
    >
      <div className="relative w-full h-full min-h-[200px]">
        <OptimizedImage
          src={image.src}
          alt={image.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay - appears on hover */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent group-hover:opacity-100" />

        {/* Content - appears on hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-block px-2.5 py-0.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-md w-fit bg-secondary/90">
            {image.tag}
          </span>
          <h3 className="text-sm font-bold leading-tight font-heading line-clamp-2">
            {image.title}
          </h3>
        </div>

        {/* Expand icon - always visible */}
        <div className="absolute p-1.5 text-white rounded-full opacity-70 top-2 right-2 bg-black/30 backdrop-blur-sm group-hover:bg-secondary/80 group-hover:opacity-100 transition-all duration-300">
          <FaExpandAlt className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
});

const GallerySection = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const activeImage =
    activeImageIndex !== null ? galleryData[activeImageIndex] : null;

  const handleNext = useCallback(() => {
    setActiveImageIndex((prev) =>
      prev === null ? null : (prev + 1) % galleryData.length
    );
  }, []);

  const handlePrev = useCallback(() => {
    setActiveImageIndex((prev) =>
      prev === null
        ? null
        : (prev - 1 + galleryData.length) % galleryData.length
    );
  }, []);

  const handleClose = useCallback(() => setActiveImageIndex(null), []);

  useEffect(() => {
    if (activeImageIndex === null) return;

    const onKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeImageIndex, handleNext, handlePrev, handleClose]);

  return (
    <section className="w-full px-4 py-12 bg-light md:py-20 sm:px-6 lg:px-8 font-body">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full text-secondary bg-secondary/10">
            <FaCamera className="w-3 h-3" />
            School Life
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl font-heading text-dark">
            Our Campus <span className="text-primary">Gallery</span>
          </h1>
          <p className="max-w-xl mx-auto mt-2 text-sm leading-relaxed text-gray md:text-base">
            Excursions, scholarship programmes, and practical learning at Marian
            Foundation Academy Schools, Oraukwu.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[200px] md:auto-rows-[220px] xl:auto-rows-[240px]">
          {galleryData.map((image, index) => (
            <GalleryItem
              key={image.id}
              image={image}
              index={index}
              onClick={setActiveImageIndex}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-14 sm:grid-cols-4">
          <div className="p-5 text-center transition-all duration-300 bg-white border shadow-sm hover:shadow-md rounded-xl border-slate-100">
            <p className="text-2xl font-bold text-primary">3+</p>
            <p className="mt-1 text-xs font-medium text-gray">Event Categories</p>
          </div>
          <div className="p-5 text-center transition-all duration-300 bg-white border shadow-sm hover:shadow-md rounded-xl border-slate-100">
            <p className="text-2xl font-bold text-secondary">22+</p>
            <p className="mt-1 text-xs font-medium text-gray">Years of Excellence</p>
          </div>
          <div className="p-5 text-center transition-all duration-300 bg-white border shadow-sm hover:shadow-md rounded-xl border-slate-100">
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="mt-1 text-xs font-medium text-gray">Christ-Centered</p>
          </div>
          <div className="p-5 text-center transition-all duration-300 bg-white border shadow-sm hover:shadow-md rounded-xl border-slate-100">
            <p className="text-2xl font-bold text-secondary">{galleryData.length}+</p>
            <p className="mt-1 text-xs font-medium text-gray">Moments Captured</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImageIndex !== null && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={handleClose}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute z-20 p-3 text-white transition-all duration-300 rounded-full left-4 bg-white/10 hover:bg-white/20 hover:scale-110"
              aria-label="Previous"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>

            <div
              className="relative z-10 flex flex-col items-center w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full overflow-hidden rounded-2xl bg-black/50">
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  className="object-contain w-full max-h-[75vh]"
                />
              </div>
              <div className="mt-5 text-center text-white">
                <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full text-secondary bg-secondary/20">
                  {activeImage.tag}
                </span>
                <p className="mt-2 text-lg font-medium sm:text-xl">
                  {activeImage.title}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  {activeImageIndex + 1} of {galleryData.length}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute z-20 p-3 text-white transition-all duration-300 rounded-full right-4 bg-white/10 hover:bg-white/20 hover:scale-110"
              aria-label="Next"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="absolute z-20 p-2.5 text-white transition-all duration-300 rounded-full top-4 right-4 bg-white/10 hover:bg-white/20 hover:rotate-90"
              aria-label="Close"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;