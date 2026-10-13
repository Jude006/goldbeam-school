import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  HeartHandshake,
  Phone,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";

const ScholarshipSection = () => {
  return (
    <section
      id="scholarships"
      className="relative w-full py-16 overflow-hidden sm:py-20 lg:py-24 bg-light"
    >
      {/* soft background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto mb-10 text-center sm:mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-[11px] font-heading font-bold tracking-wider uppercase rounded-full bg-primary/10 text-primary">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            Give Bright Minds a Chance
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight font-heading sm:text-3xl lg:text-4xl text-dark">
            Scholarships &{" "}
            <span className="text-primary">Academic Excellence</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed sm:text-base text-gray">
            At Amazing Grace Academy, we believe intelligence should be
            rewarded. We support outstanding students so financial barriers do
            not stop their potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left — program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex flex-col p-6 bg-white border shadow-xs sm:p-8 rounded-2xl border-slate-200/80"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10 text-primary">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-dark sm:text-xl">
              Our Scholarship Program
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray">
              We offer scholarships to outstanding and intelligent students who
              show academic excellence, leadership, and dedication. The program
              is designed to help smart students achieve their full potential
              without financial barriers.
            </p>

            <ul className="mt-5 space-y-3">
              {[
                "Academic excellence and strong performance",
                "Leadership and positive character",
                "Dedication and commitment to learning",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-dark"
                >
                  <span className="flex items-center justify-center w-5 h-5 mt-0.5 rounded-full shrink-0 bg-secondary/15 text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — sponsor appeal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="relative flex flex-col p-6 overflow-hidden text-white shadow-sm sm:p-8 rounded-2xl bg-primary"
          >
            <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 w-32 h-32 -translate-x-1/3 translate-y-1/3 rounded-full bg-secondary/10" />

            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-white/10 text-secondary">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading sm:text-xl">
                Support Our Scholarship Program
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                We appeal to individuals, organizations, and well-meaning
                sponsors to support our scholarship program. Your sponsorship
                can provide a{" "}
                <strong className="text-white">
                  termly scholarship of ₦30,000 and above
                </strong>{" "}
                to intelligent and deserving students.
              </p>

              <div className="flex items-start gap-3 p-3 mt-5 border rounded-xl bg-white/10 border-white/10">
                <Users className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-white/90">
                  Together, we can help smart students achieve their full
                  potential without financial barriers.
                </p>
              </div>

              <div className="pt-6 mt-auto space-y-3">
                <p className="text-[11px] font-heading font-bold tracking-wider uppercase text-secondary">
                  Become a sponsor
                </p>
                <a
                  href="tel:08140728109"
                  className="flex items-center gap-3 text-sm font-medium transition-colors hover:text-secondary"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10">
                    <Phone className="w-4 h-4 text-secondary" />
                  </span>
                  08140728109
                </a>
                <a
                  href="mailto:mfacademyschool@gmail.com"
                  className="flex items-center gap-3 text-sm font-medium break-all transition-colors hover:text-secondary"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 shrink-0">
                    <Mail className="w-4 h-4 text-secondary" />
                  </span>
                  mfacademyschool@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipSection;
