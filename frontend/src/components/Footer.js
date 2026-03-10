import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { MapPin, Phone, Mail, Leaf } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_phytocode-farm/artifacts/lrhsc8lr_avantra_logo_red.png";

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language]?.footer || translations.en.footer;
  const nav = translations[language]?.nav || translations.en.nav;

  return (
    <footer className="bg-gray-900 text-gray-300" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={LOGO_URL} alt="Avantra" className="h-10 w-auto brightness-0 invert" />
            <p className="text-sm text-gray-400 leading-relaxed">{t.description}</p>
            <p className="text-emerald-400 font-medium text-sm flex items-center gap-1.5">
              <Leaf className="h-4 w-4" /> {t.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.quickLinks}</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: nav.home },
                { to: "/about", label: nav.about },
                { to: "/products", label: nav.products },
                { to: "/dealers", label: nav.dealers },
                { to: "/contact", label: nav.contact },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors" data-testid={`footer-link-${link.to.replace("/","") || "home"}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.productCategories}</h4>
            <ul className="space-y-2.5">
              {["Biostimulants", "Biofertilizers", "Liquid Fertilizers", "Micronutrients", "Water Soluble"].map((cat) => (
                <li key={cat}>
                  <Link to="/products" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.contactInfo}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                <span>No.5, RKM Street, Halasuru, Bengaluru - 560068</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                <span>No.375, Lakshmipura, Kolar - 563135</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0 text-orange-500" />
                <span>+91 80 XXXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-red-500" />
                <span>info@avantrachemicals.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">&copy; {t.copyright}</p>
          <div className="flex items-center gap-4">
            {["Facebook", "Instagram", "LinkedIn", "YouTube"].map((social) => (
              <a key={social} href="#" className="text-xs text-gray-500 hover:text-emerald-400 transition-colors" data-testid={`social-${social.toLowerCase()}`}>
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
