import React from "react";
import { motion } from "framer-motion";
import { Target, Compass, ShieldCheck, Heart, Award, Users, Lightbulb, CheckCircle2 } from "lucide-react";

const coreValues = [
  { icon: Heart, title: "Faith", desc: "Rooted in Christ and Catholic teachings, we nurture spiritual growth and moral integrity." },
  { icon: Award, title: "Excellence", desc: "We pursue the highest standards in academics, character, and service." },
  { icon: ShieldCheck, title: "Discipline", desc: "We uphold order, responsibility, and respect in all we do." },
  { icon: CheckCircle2, title: "Integrity", desc: "We act with honesty, accountability, and truth at all times." },
  { icon: Users, title: "Service", desc: "We are committed to serving God, community, and nation with humility." },
  { icon: Lightbulb, title: "Innovation", desc: "We embrace creative teaching and learning to meet the demands of the future." },
];

const AboutMissionVision = () => {
  return (
    <section className="py-12 lg:py-16 bg-slate-50/80 border-y border-slate-100">
      <div className="px-4 mx-auto space-y-12 max-w-7xl sm:px-6 lg:px-8">
        
        {/* Mission & Vision Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="relative flex flex-col justify-between p-6 overflow-hidden bg-white border shadow-sm sm:p-8 border-slate-200/80 rounded-2xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 text-sky-600">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-800">Our Mission</h3>
              <p className="text-xs leading-relaxed sm:text-sm text-slate-600">
                To provide a Christ-centered, disciplined, and academically excellent learning environment that nurtures the intellectual, moral, and spiritual growth of students. Through innovative teaching, character formation, and community service, we are committed to raising future leaders who will impact the community, state, and nation with integrity and excellence.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 mt-6 text-xs font-semibold border-t border-slate-100 text-slate-400">
              <span>FOUNDATION OF PURPOSE</span>
              <span className="text-sky-600">01</span>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative flex flex-col justify-between p-6 overflow-hidden bg-white border shadow-sm sm:p-8 border-slate-200/80 rounded-2xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-800">Our Vision</h3>
              <p className="text-xs leading-relaxed sm:text-sm text-slate-600">
                To be a leading Catholic citadel of learning that forms well-rounded, God-fearing, and globally competitive individuals who embody knowledge, service, and leadership for the transformation of society.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 mt-6 text-xs font-semibold border-t border-slate-100 text-slate-400">
              <span>ASPIRATION & GOAL</span>
              <span className="text-amber-600">02</span>
            </div>
          </motion.div>

        </div>

        {/* Motto Banner */}
        <div className="relative p-6 overflow-hidden text-center text-white shadow-md bg-primary rounded-2xl">
          <p className="text-xs font-bold tracking-widest uppercase text-sky-300">Official School Motto</p>
          <h4 className="mt-1 text-xl font-black tracking-wider text-white uppercase font-heading sm:text-2xl">
            LOVE, SERVICE & EXCELLENCE
          </h4>
        </div>

        {/* Core Values Section */}
        <div className="space-y-6">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold font-heading text-slate-800">Our Core Values</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">The foundational pillars that guide our conduct and culture</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 transition-all duration-200 bg-white border shadow-xs border-slate-200/80 rounded-xl hover:shadow-md"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-heading text-slate-800">{value.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{value.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutMissionVision;