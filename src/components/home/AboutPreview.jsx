// src/components/home/AboutPreview.jsx - FIXED

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lightbulb, Landmark, Zap, GraduationCap, Trophy } from "lucide-react";

// ✅ FIXED: All images imported correctly
import img1 from "/images/classroom.jpg";
import img2 from "/images/img2.webp";
import img3 from "/images/img3.webp"; // ✅ ADDED THIS

const stats = [
  {
    value: "100%",
    label: "Integrity",
    icon: Landmark,
    color: "border-teal-300 text-teal-600 bg-teal-50",
  },
  {
    value: "99%",
    label: "Hardwork",
    icon: Zap,
    color: "border-amber-300 text-amber-500 bg-amber-50",
  },
  {
    value: "100%",
    label: "Discipline",
    icon: GraduationCap,
    color: "border-red-300 text-red-500 bg-red-50",
  },
  {
    value: "100%",
    label: "Moral Value",
    icon: Trophy,
    color: "border-blue-300 text-blue-500 bg-blue-50",
  },
];

const PencilDoodle = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 56 56"
    fill="none"
    className="text-teal-400"
  >
    <path
      d="M10 44 L34 12 C36 9 40 9 42 12 C44 15 44 19 41 21 L17 46 L8 48 Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30 17 L36 22"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const BookDoodle = () => (
  <svg
    width="60"
    height="40"
    viewBox="0 0 72 48"
    fill="none"
    className="text-teal-400"
  >
    <path
      d="M36 10 C30 4 18 3 6 6 V38 C18 35 30 36 36 42 C42 36 54 35 66 38 V6 C54 3 42 4 36 10 Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d="M36 10 V42" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

const MathDoodle = () => (
  <svg
    width="90"
    height="50"
    viewBox="0 0 100 50"
    fill="none"
    className="text-emerald-400"
  >
    <path
      d="M10 25 L18 25 L24 40 L35 10 L85 10"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="40"
      y="32"
      fill="currentColor"
      fontSize="22"
      fontFamily="sans-serif"
      fontWeight="bold"
    >
      x + Y
    </text>
  </svg>
);

const AboutPreview = () => {
  return (
    <section className="relative py-16 overflow-hidden bg-white md:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative lg:col-span-6"
          >
            <div className="mb-20 -rotate-12">
              <PencilDoodle />
            </div>

            <h2 className="mb-6 text-3xl font-black tracking-tight leading-[1.15] text-[#0f2a4a] sm:text-4xl lg:text-5xl font-heading">
              We are building <br />
              <span className="text-[#0f2a4a] font-heading">
                foundations for the future
              </span>
            </h2>

            <p className="mb-4 text-base font-medium leading-relaxed sm:text-lg text-slate-600">
              Our aim is to raise a generation of creative, disciplined, and
              God-fearing students who will impact society positively.
            </p>

            <p className="mb-8 text-sm leading-relaxed sm:text-base text-slate-500">
              At Goldbeam Schools, Oraukwu, we provide a memorable academic
              experience in a Christ-centered environment. At Marian Foundation
              Academy; School feels like home.
            </p>

            <div className="flex items-center gap-6">
              <div className="hidden shrink-0 sm:block">
                <BookDoodle />
              </div>

              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-[#0f2a4a] border-2 border-amber-400 rounded-full hover:bg-amber-400 transition-all duration-300 shadow-sm"
              >
                Learn More
              </Link>

              <div className="shrink-0 text-emerald-400">
                <Lightbulb size={38} strokeWidth={2} />
              </div>
            </div>
          </motion.div>

          {/* Right Image Composition */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center lg:col-span-6 min-h-[380px] sm:min-h-[440px] pt-8 lg:pt-0"
          >
            <div className="absolute top-0 z-0 right-2 sm:right-6 rotate-6">
              <MathDoodle />
            </div>

            <div className="relative flex items-center justify-center w-full max-w-[460px]">
              <div className="relative z-10 w-[270px] sm:w-[320px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
                <img
                  src={img1}
                  alt="Marian Foundation Academy main"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="absolute left-0 sm:-left-4 -bottom-6 sm:-bottom-8 z-20 w-[170px] sm:w-[210px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src={img2}
                  alt="Marian Foundation Academy students"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="absolute right-0 sm:-right-4 top-10 sm:top-12 z-20 w-[110px] sm:w-[135px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-slate-100">
                <img
                  src={img3}
                  alt="Students learning"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 pt-12 mt-16 border-t border-slate-100 sm:gap-6 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center gap-3.5 rounded-xl border-2 border-dashed ${stat.color.split(" ")[0]} p-4`}
              >
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 ${stat.color.split(" ")[2]}`}
                >
                  <Icon
                    className={stat.color.split(" ")[1]}
                    size={22}
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <p
                    className={`text-2xl font-black font-heading ${stat.color.split(" ")[1]}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
