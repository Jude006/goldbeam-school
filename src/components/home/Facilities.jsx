import { motion } from "framer-motion";
import {
  Bus,
  Monitor,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  Users,
} from "lucide-react";
import facility1 from "/images/computer_lab.webp"; // Computer Lab
import facility2 from "/images/computer_lab2.webp"; // Library
import facility3 from "/images/school_bus1.webp"; // School Bus
import facility4 from "/images/school_bus2.webp"; // Classroom / Lab

const Facilities = () => {
  const facilities = [
    {
      image: facility1,
      icon: <Monitor size={22} />,
      title: "Computer Laboratory",
      text: "Well-equipped computer lab to prepare students for the digital age.",
    },
    {
      image: facility2,
      icon: <BookOpen size={22} />,
      title: "Modern Library",
      text: "A rich collection of books and resources that encourage reading and research.",
    },
    {
      image: facility3,
      icon: <Bus size={22} />,
      title: "School Bus",
      text: "Safe and reliable transportation for students across the community.",
    },
    {
      image: facility4,
      icon: <FlaskConical size={22} />,
      title: "School Bus",
      text: "Reliable transportation for student across the community",
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-light">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-secondary bg-secondary/10 rounded-full">
            Our Facilities
          </span>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl font-heading text-dark">
            A Great Learning Environment
          </h2>
          <p className="text-base text-gray md:text-lg">
            We provide modern facilities that support academic excellence and
            the overall development of every child.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded-2xl hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent"></div>

                {/* Icon Badge */}
                <div className="absolute flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md top-4 left-4 text-primary">
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-2 text-lg font-semibold font-heading text-dark">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facilities;
