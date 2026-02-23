import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import { useUiSettings } from "@/Context/UiSettingsContext";

const Footer = () => {
  const { t } = useUiSettings();

  return (
    <footer className="mt-8 bg-slate-900 py-8 text-white dark:bg-black">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="mb-4 text-xl font-semibold">{t("footer.contactInfo")}</h2>
          <p className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-400" />
            mcirdiabdallah02@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-400" />
            +48 736 241 930
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            Krakow, Poland
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">{t("footer.usefulLinks")}</h2>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-gray-400">
                {t("nav.home")}
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-400">
                {t("footer.about")}
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-gray-400">
                {t("footer.services")}
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-gray-400">
                {t("footer.contact")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">{t("footer.followMe")}</h2>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-gray-400">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-gray-400">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-gray-400">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Abdallah Mcirdi. {t("footer.rights")}
      </div>
    </footer>
  );
};

export default Footer;
