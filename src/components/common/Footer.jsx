import { Link, Links } from "react-router-dom";
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
                src="/images/final_crest.jpg"
                loading="lazy"
                alt="Marian Foundation Academy"
                className="object-contain w-12 h-12 p-1 bg-white rounded-full"
              />
              <div>
                <h3 className="text-lg font-bold leading-tight font-heading">
                  Marian Foundation
                </h3>
                <p className="text-sm text-white/80">Academy Schools</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              Love · Service · Excellence. A Christ-centered Catholic school
              nurturing excellence since 2002.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/MarianFoundationAcademy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-white/10 hover:bg-secondary"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="https://instagram.com/Marianfoundationacademyoraukwu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-white/10 hover:bg-secondary"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://tiktok.com/@MarianFoundationAcademyOraukwu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-white/10 hover:bg-secondary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@MarianFoundationAcademy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center transition-colors rounded-full w-9 h-9 bg-white/10 hover:bg-secondary"
              >
                <FaYoutube size={16} />
              </a>
              <a
                href="https://twitter.com/marianfounvihg"
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
                  Inside St. Joseph Catholic Church Premises, Oraukwu, Idemili
                  North L.G.A, Anambra State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondary shrink-0" />
                <a
                  href="tel:+2348140728109"
                  className="transition-colors hover:text-secondary"
                >
                  +234 814 072 8109
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary shrink-0" />
                <a
                  href="mailto:mfacademyschool@gmail.com"
                  className="break-all transition-colors hover:text-secondary"
                >
                  mfacademyschool@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* School Hours / Extra */}
          <div>
            <h4 className="mb-5 text-lg font-semibold font-heading">
              School Information
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <span className="font-medium text-white">Motto:</span>
                <br />
                Love, Service & Excellence
              </li>
              <li>
                <span className="font-medium text-white">Established:</span>
                <br />
                23rd September 2002
              </li>
              <li>
                <span className="font-medium text-white">Type:</span>
                <br />
                Catholic Co-educational School
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="flex flex-col items-center justify-between gap-3 px-4 py-5 mx-auto text-sm max-w-7xl sm:px-6 lg:px-8 sm:flex-row text-white/70">
          <p>
            © {currentYear} Amazing Grace Academys, Oraukwu. All rights
            reserved.
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
