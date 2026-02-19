import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#18191B] text-white py-8 ">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
          <p className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-400" />{" "}
            mcirdiabdallah02@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-400" /> +48 736 241 930
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" /> Krakow, Poland
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Useful Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-gray-400">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-400">
                About
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-gray-400">
                Services
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-gray-400">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Me</h2>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-gray-400"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              className="hover:text-gray-400"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-gray-400"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-400 text-sm mt-8">
        © {new Date().getFullYear()} Abdallah Mcirdi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
