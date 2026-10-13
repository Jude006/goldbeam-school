import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaDirections,
} from "react-icons/fa";

const Map = () => {
  const mapAddressQuery = encodeURIComponent(
    "3XXM+2Q2, Oraukwu 422102, Anambra, Nigeria",
  );

  return (
    <section className="w-full px-6 py-16 bg-light md:py-24 lg:px-20 font-body">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary bg-secondary/10 rounded-full mb-3">
            Location
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl font-heading text-dark">
            Find Us <span className="text-primary">Here</span>
          </h2>
          <p className="max-w-xl mx-auto mt-2 text-sm text-gray">
            Inside St. Joseph Catholic Church Premises, Oraukwu, Idemili North
            LGA, Anambra State
          </p>
        </motion.div>

        {/* Map Display Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative w-full h-[400px] md:h-[480px] rounded-3xl overflow-hidden shadow-xl bg-white p-2 border border-gray/10"
        >
          <iframe
            title="Goldbeam School Location"
            src={`https://maps.google.com/maps?q=${mapAddressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full rounded-2xl"
          ></iframe>
        </motion.div>

        {/* Quick Contact Information Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Address Card */}
          <div className="flex flex-col items-center p-6 text-center transition-all bg-white border shadow-sm rounded-2xl border-gray/10 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
              <FaMapMarkerAlt className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-dark/70">
              Address
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-dark">
              Inside St. Joseph Catholic Church Premises, Oraukwu, Idemili North
              LGA, Anambra State
            </p>
            <span className="mt-1 font-mono text-xs text-gray/60">
              3XXM+2Q2, Oraukwu
            </span>
          </div>

          {/* Phone Card */}
          <div className="flex flex-col items-center p-6 text-center transition-all bg-white border shadow-sm rounded-2xl border-gray/10 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-secondary/10 text-secondary">
              <FaPhoneAlt className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-dark/70">
              Phone & WhatsApp
            </h3>
            <div className="mt-2 space-y-1">
              <a
                href="tel:+2348140728109"
                className="block text-sm font-semibold text-primary hover:underline"
              >
                +234 814 072 8109
              </a>
              <a
                href="tel:+2348065130564"
                className="block text-sm font-semibold text-primary hover:underline"
              >
                +234 8140728109
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="flex flex-col items-center p-6 text-center transition-all bg-white border shadow-sm rounded-2xl border-gray/10 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
              <FaEnvelope className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-dark/70">
              Email Us
            </h3>
            <a
              href="mailto:mfacademyschool@gmail.com"
              className="mt-2 text-sm font-semibold break-all text-primary hover:underline"
            >
              mfacademyschool@gmail.com
            </a>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapAddressQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 rounded-full shadow-md bg-secondary hover:bg-highlight hover:shadow-lg active:scale-95"
          >
            <FaDirections className="w-4 h-4" />
            <span>Get Directions on Google Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Map;
