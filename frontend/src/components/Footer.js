import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { MapPin, Phone, Mail, Sprout } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language]?.footer || translations.en.footer;
  const nav = translations[language]?.nav || translations.en.nav;
  const products = translations[language]?.products || translations.en.products;
  const [settings, setSettings] = useState({});

  useEffect(() => {
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const socialLinks = settings.social_links || {};

  return (
    <footer className="footer-dark" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-[#D9F99D] flex items-center justify-center">
                <Sprout className="h-7 w-7 text-[#044736]" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Avantra</div>
                <div className="text-xs text-gray-400">Chemicals</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{t.description}</p>
            <p className="text-[#D9F99D] font-semibold text-sm">{t.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t.quickLinks}</h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: nav.home },
                { to: "/about", label: nav.about },
                { to: "/products", label: nav.products },
                { to: "/dealers", label: nav.dealers },
                { to: "/careers", label: nav.careers },
                { to: "/contact", label: nav.contact },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-[#D9F99D] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t.productCategories}</h4>
            <ul className="space-y-3">
              {["biostimulant", "biofertilizer", "liquid_fertilizer", "micronutrient", "water_soluble"].map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="text-gray-400 hover:text-[#D9F99D] text-sm transition-colors">
                    {products[cat]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t.contactInfo}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#D9F99D] mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">No.5, RKM Street, Halasuru, Bengaluru - 560068</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#D9F99D] shrink-0" />
                <span className="text-gray-400 text-sm">+91-9030559163</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#D9F99D] shrink-0" />
                <span className="text-gray-400 text-sm">support@avantra.in</span>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="mt-6">
              <h5 className="text-white font-semibold text-sm mb-3">{t.followUs}</h5>
              <div className="flex gap-3">
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#D9F99D] text-white hover:text-[#044736] flex items-center justify-center transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#D9F99D] text-white hover:text-[#044736] flex items-center justify-center transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#D9F99D] text-white hover:text-[#044736] flex items-center justify-center transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#D9F99D] text-white hover:text-[#044736] flex items-center justify-center transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#D9F99D] text-white hover:text-[#044736] flex items-center justify-center transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">&copy; {t.copyright}</p>
            <div className="flex gap-6 text-sm">
              <Link to="/terms" className="text-gray-400 hover:text-[#D9F99D] transition-colors">{t.terms}</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-[#D9F99D] transition-colors">{t.privacy}</Link>
              <Link to="/corporate" className="text-gray-400 hover:text-[#D9F99D] transition-colors">{t.corporate}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
