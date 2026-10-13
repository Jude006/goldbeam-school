import { motion } from "framer-motion";
import { BookOpen, Users, Award, HeartHandshake, ShieldCheck, Lightbulb } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <BookOpen size={28} />,
      title: "Academic Excellence",
      text: "We deliver qualitative teaching that prepares students for excellence in external examinations and future careers.",
    },
    {
      icon: <HeartHandshake size={28} />,
      title: "Christ-Centered Formation",
      text: "Rooted in Catholic values, we nurture spiritual growth, moral integrity, and strong character.",
    },
    {
      icon: <Users size={28} />,
      title: "Experienced Teachers",
      text: "Our dedicated and qualified teachers are committed to bringing out the best in every child.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Safe & Conducive Environment",
      text: "A disciplined, secure, and supportive atmosphere where every student can thrive.",
    },
    {
      icon: <Award size={28} />,
      title: "Holistic Development",
      text: "We focus on intellectual, moral, social, and spiritual growth of every learner.",
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Innovation in Learning",
      text: "We embrace modern teaching methods to prepare students for a fast-changing world.",
    },
  ];

  return (
    <section className="py-20 bg-light">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-secondary bg-secondary/10 rounded-full">
            Why Choose Us
          </span>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl font-heading text-dark">
            Building Foundations for the Future
          </h2>
          <p className="text-base text-gray md:text-lg">
            At Marian Foundation Academy, we combine academic excellence with strong moral values to raise outstanding leaders.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="transition-shadow duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl p-7 hover:shadow-md"
            >
              <div className="flex items-center justify-center mb-5 w-14 h-14 rounded-xl bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold font-heading text-dark">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;