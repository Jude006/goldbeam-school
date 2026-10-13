import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white bg-primary">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* School Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                loading="lazy"
                alt="Goldbeam Schools"
                className="object-contain w-12 h-12 p-1 bg-white rounded-full"
              />
              <div>
                <h3 className="text-lg font-bold leading-tight font-heading">
                  Goldbeam Schools
                </h3>
                <p className="text-sm text-white/80">Arise and Shine</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              Arise and Shine. A leading school nurturing academic excellence,
              discipline, and future leaders since 2005.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/goldbeamschools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-white/10 hover:bg-secondary"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="https://instagram.com/goldbeamschools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-white/10 hover:bg-secondary"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://youtube.com/@goldbeamschools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-white/10 hover:bg-secondary"
              >
                <FaYoutube size={16} />
              </a>
              <a
                href="https://twitter.com/goldbeamschools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-white/10 hover:bg-secondary"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-lg font-semibold font-heading">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link to="/" className="transition-colors hover:text-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:text-secondary"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/admissions"
                  className="transition-colors hover:text-secondary"
                >
                  Admissions
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="transition-colors hover:text-secondary"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-secondary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-5 text-lg font-semibold font-heading">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary mt-0.5 shrink-0" />
                <span>
                  14, Association Avenue, Iroko Town, Ogun State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondary shrink-0" />
                <a
                  href="tel:+2348035764123"
                  className="transition-colors hover:text-secondary"
                >
                  0803 576 4123
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary shrink-0" />
                <a
                  href="mailto:goldbeamschools@gmail.com"
                  className="break-all transition-colors hover:text-secondary"
                >
                  goldbeamschools@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* School Information */}
          <div>
            <h4 className="mb-5 text-lg font-semibold font-heading">
              School Information
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <span className="font-medium text-white">Motto:</span>
                <br />
                Arise and Shine
              </li>
              <li>
                <span className="font-medium text-white">Type:</span>
                <br />
                Co-educational School
              </li>
              <li>
                <span className="font-medium text-white">Location:</span>
                <br />
                Iroko Town, Ogun State
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="flex flex-col items-center justify-between gap-3 px-4 py-5 mx-auto text-sm max-w-7xl sm:px-6 lg:px-8 sm:flex-row text-white/70">
          <p>
            © {currentYear} Goldbeam Schools, Iroko Town. All rights reserved.
          </p>
          <Link to="https://portfolio-virid-kappa.vercel.app/">
            <p className="text-xs">
              Designed & Developed By{" "}
              <span className="text-secondary">Gentle Dev</span>
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;