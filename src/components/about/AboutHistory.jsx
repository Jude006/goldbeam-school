import React from "react";
import { motion } from "framer-motion";
import {
  Book,
  Award,
  Calendar,
  Cross,
  BookOpen,
  Flame,
  Sparkles,
} from "lucide-react";

import historyImg from "/images/school_building3a.jpg"; // Replace with your school building image

const crestSymbols = [
  {
    icon: Cross,
    title: "The Cross",
    desc: "Foundation on Christ and Catholic values",
  },
  {
    icon: BookOpen,
    title: "Open Book",
    desc: "Commitment to knowledge and learning",
  },
  {
    icon: Flame,
    title: "Torch/Light",
    desc: "Illumination, leadership, and guiding the future",
  },
  {
    icon: Sparkles,
    title: "Olive Branch",
    desc: "Peace, unity, and service to community",
  },
];

const AboutHistory = () => {
  return (
    <section className="py-12 overflow-hidden bg-white lg:py-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Top Grid: About Text & Image */}
        <div className="grid items-center grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4 lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-wider uppercase border rounded-full bg-sky-50 border-sky-100 text-sky-700">
              <Calendar className="w-3.5 h-3.5" />
              Established 23rd September 2002
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight font-heading sm:text-3xl md:text-4xl text-slate-800">
              About{" "}
              <span className="text-primary">Marian Foundation Academy</span>
            </h2>

            <p className="text-sm leading-relaxed sm:text-base text-slate-600">
              Amazing Grace Academy was conceived in 2001 at a meeting of the
              St. Joseph's Catholic Parish Pastoral Council, Oraukwu, and
              officially became functional on the 23rd of September, 2002. Under
              the leadership of Rev. Fr. Mike Mbonu (Parish Priest & Manager at
              the time) and Mr. Gilbert Green Maduka (Pioneer Principal), the
              school began its storied journey.
            </p>

            <p className="text-sm leading-relaxed sm:text-base text-slate-600">
              For over two decades, Marian Foundation Academy has boasted a
              vibrant legacy as a beacon of learning in the heart of Oraukwu and
              its environs. This citadel of learning maintains a firm tradition
              of academic excellence and holistic character formation, producing
              notable alumni across diverse fields nationwide.
            </p>

            {/* Slogan Banner */}
            <div className="p-4 border-l-4 rounded-r-lg bg-slate-50 border-sky-500">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                School Slogan
              </p>
              <p className="font-heading text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                "Building Foundations for the Future"
              </p>
            </div>
          </motion.div>

          {/* Right Column: Featured Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative lg:col-span-5"
          >
            <div className="relative overflow-hidden border-4 border-white shadow-xl rounded-2xl bg-slate-100">
              <img
                src={historyImg}
                alt="Marian Foundation Academy Oraukwu"
                className="w-full h-[340px] sm:h-[400px] object-cover object-left"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <span className="text-xs font-semibold tracking-widest uppercase text-sky-300">
                  School Identity
                </span>
                <p className="text-lg font-bold font-heading">
                  Amazing Grace Academy, Oraukwu
                </p>
                <p className="mt-1 text-xs italic text-slate-200">
                  Inside St Joseph Catholic Church Premises, Oraukwu, Anambra
                  State.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Crest Symbols Section */}
        <div className="pt-10 border-t mt-14 border-slate-100">
          <div className="mb-6">
            <h3 className="text-xl font-bold font-heading text-slate-800">
              Crest Symbols & Meanings
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              The sacred symbols embedded in our institutional identity
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {crestSymbols.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-4 transition-all duration-200 border rounded-xl border-slate-200/80 bg-slate-50/50 hover:border-sky-300 hover:bg-white"
                >
                  <div className="flex items-center justify-center mb-3 rounded-lg w-9 h-9 bg-sky-100 text-sky-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold font-heading text-slate-800">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHistory;
