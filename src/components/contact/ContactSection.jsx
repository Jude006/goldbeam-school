import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHome, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Loader2, CheckCircle2 } from "lucide-react";
import { submitContactForm } from "../../api/publicFormApi";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await submitContactForm(formData);
      if (!res.success) throw new Error(res.message || "Failed");
      setSent(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not send. Please try again or call the school."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full px-6 py-16 bg-[#f0f0f052] md:py-24 lg:px-20 font-body">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-4xl font-extrabold tracking-tight md:text-5xl font-heading text-dark"
        >
          Get in touch
        </motion.h1>

        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {sent ? (
              <div className="p-6 space-y-3 border bg-emerald-50 border-emerald-200 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <h3 className="text-lg font-bold text-emerald-900 font-heading">
                  Message sent
                </h3>
                <p className="text-sm text-emerald-800">
                  Thank you. The school has received your message and will
                  respond soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="px-5 py-2 text-sm font-bold text-white rounded-full bg-secondary"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="px-3 py-2 text-xs font-medium text-red-700 rounded-lg bg-red-50">
                    {error}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 text-dark bg-white rounded-lg border border-gray/20 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 text-dark bg-white rounded-lg border border-gray/20 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 text-dark bg-white rounded-lg border border-gray/20 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 text-dark bg-white rounded-lg border border-gray/20 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 text-dark bg-white rounded-lg border border-gray/20 focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 rounded-full bg-secondary hover:bg-highlight hover:shadow-md active:scale-95 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right column — keep your existing address / phone / email block unchanged */}
          <motion.div
            className="space-y-8 lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* ... same as your current right column ... */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;