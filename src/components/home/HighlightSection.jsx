// src/components/home/HighlightSection.jsx - FIXED

import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

// ✅ FIXED: Using correct paths
import mainImage from "../../assets/images/background.jpg";
import img1 from "/images/classroom.jpg";
import img2 from "/images/gallery6.webp";
import { Link } from "react-router-dom";

const HighlightSection = () => {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="grid w-full grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT BIG IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative h-[260px] sm:h-[320px] lg:h-[420px]"
        >
          <img
            src={mainImage}
            alt="Marian Foundation Academy campus"
            className="absolute inset-0 object-cover w-full h-full"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6">
            <h2 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl font-heading drop-shadow-lg">
              Marian Foundation Academy
            </h2>
            <p className="max-w-sm mt-1.5 text-sm text-white/90">
              Building tomorrow's leaders through excellence in education
            </p>
          </div>
        </motion.div>

        {/* RIGHT GRID */}
        <div className="grid grid-cols-2 lg:h-[420px]">
          
          {/* Academic Excellence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center p-4 text-white sm:p-5 lg:p-6 bg-secondary h-[160px] sm:h-[180px] lg:h-full"
          >
            <h3 className="mb-1.5 text-base font-bold sm:text-lg lg:text-xl font-heading">
              Academic Excellence
            </h3>
            <p className="hidden text-sm leading-relaxed sm:block text-white/90 line-clamp-3">
              We employ the best teachers and follow national standards to nurture students with strong academic and moral foundation.
            </p>
            <div className="mt-2.5">
             <Link to='/about'>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white/20 rounded-full">
                <BookOpen size={12} />
                Learn More
              </span>
             </Link>
            </div>
          </motion.div>

          {/* Top Right Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative h-[160px] sm:h-[180px] lg:h-full overflow-hidden"
          >
            <img
              src={img1}
              alt="Marian students"
              className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          {/* Bottom Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[160px] sm:h-[180px] lg:h-full overflow-hidden"
          >
            <img
              src={img2}
              alt="School activities"
              className="object-cover object-top w-full h-full transition-transform duration-700 hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          {/* Holistic Development */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center p-4 text-white sm:p-5 lg:p-6 bg-primary h-[160px] sm:h-[180px] lg:h-full"
          >
            <h3 className="mb-1.5 text-base font-bold sm:text-lg lg:text-xl font-heading">
              Holistic Development
            </h3>
            <p className="hidden text-sm leading-relaxed sm:block text-white/90 line-clamp-3">
              Beyond academics, every student grows socially, morally, and spiritually in a safe environment.
            </p>
            <div className="mt-2.5">
             <Link to='/about'>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white/20 rounded-full">
                <Sparkles size={12} />
                Explore More
              </span>
             </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HighlightSection;