import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  BookOpen,
  Bus,
  Building2,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

// Facility Data Structure
const facilitiesData = [
  {
    id: "computer-lab",
    category: "Academics",
    title: "ICT & Computer Laboratory",
    subtitle: "Modern Computing Suite",
    icon: Monitor,
    badgeColor: "bg-sky-50 text-sky-600 border-sky-200",
    image: "/images/computer_lab.jpeg", // Replace with your computer room image
    description:
      "Equipped with modern desktop computers, high-speed internet connectivity, and modern educational software to foster digital literacy and technological competence.",
    features: [
      "High-speed internet connection",
      "Modern desktop workstations",
      "E-learning & coding tools",
    ],
  },
  {
    id: "library",
    category: "Academics",
    title: "School Library & Research Center",
    subtitle: "Knowledge Hub",
    icon: BookOpen,
    badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
    image: "/images/computer_lab2.jpeg", // Replace with your library image
    description:
      "A serene and well-stocked library housing thousands of curriculum-aligned textbooks, reference materials, literature, and quiet study stations.",
    features: [
      "Extensive book collection",
      "Quiet reading spaces",
      "Academic research assistance",
    ],
  },
  {
    id: "school-bus",
    category: "Logistics",
    title: "Transport Fleet & School Bus",
    subtitle: "Safe Commute",
    icon: Bus,
    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    image: "/images/school_bus2.jpeg", // Replace with your school bus image
    description:
      "Reliable, safe, and comfortable transportation services covering major routes around Oraukwu and neighboring communities, managed by experienced drivers.",
    features: [
      "Experienced & vetted drivers",
      "Punctual pick-up & drop-off",
      "Comfortable & safe seating",
    ],
  },
  {
    id: "school-building",
    category: "Infrastructure",
    title: "Main Campus & Classrooms",
    subtitle: "Christ-Centered Learning Environment",
    icon: Building2,
    badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
    image: "/images/school_building3a.jpg", // Replace with your building image
    description:
      "Well-ventilated, spacious classrooms equipped with modern learning boards, comfortable furniture, and a safe, gated environment inside St. Joseph's Church premises.",
    features: [
      "Gated & secure premises",
      "Spacious & ventilated rooms",
      "Serene parish environment",
    ],
  },
];

const categories = ["All", "Academics", "Infrastructure", "Logistics"];

const SchoolFacilities = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFacilities =
    selectedCategory === "All"
      ? facilitiesData
      : facilitiesData.filter((item) => item.category === selectedCategory);

  return (
    <section className="overflow-hidden bg-white select-none py-14 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 mb-10 md:flex-row md:items-end">
          <div>
            <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase border rounded-full text-sky-600 bg-sky-50 border-sky-100">
              Campus Environment
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight font-heading sm:text-3xl lg:text-4xl text-slate-800">
              Our School <span className="text-sky-600">Facilities</span>
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                  selectedCategory === category
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Facilities Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
          >
            {filteredFacilities.map((facility) => {
              const Icon = facility.icon;
              return (
                <div
                  key={facility.id}
                  className="flex flex-col justify-between overflow-hidden transition-all duration-200 bg-white border shadow-xs border-slate-200/80 rounded-2xl hover:shadow-md group"
                >
                  <div>
                    {/* Facility Image Container */}
                    <div className="relative w-full h-48 overflow-hidden sm:h-56 bg-slate-100">
                      <img
                        src={facility.image}
                        alt={facility.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Badge Icon Overlay */}
                      <div className="absolute flex items-center gap-2 top-4 left-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${facility.badgeColor}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {facility.category}
                        </span>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute text-white bottom-3 left-4 right-4">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-sky-300">
                          {facility.subtitle}
                        </p>
                        <h3 className="text-lg font-bold leading-tight font-heading sm:text-xl">
                          {facility.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-4 sm:p-6">
                      <p className="text-xs leading-relaxed sm:text-sm text-slate-600">
                        {facility.description}
                      </p>

                      {/* Feature Checklist */}
                      <ul className="pt-2 space-y-2 border-t border-slate-100">
                        {facility.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-xs font-medium text-slate-700"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer Tag */}
                  <div className="flex items-center justify-between px-5 py-3 text-xs font-bold border-t sm:px-6 bg-slate-50/80 border-slate-100 text-slate-500">
                    <span>MARIAN FOUNDATION ACADEMY</span>
                    <ChevronRight className="w-4 h-4 transition-transform text-slate-400 group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SchoolFacilities;
