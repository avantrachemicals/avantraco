import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, getText } from "@/context/ContentContext";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const { language } = useLanguage();
  const { settings, labels } = useContent();

  const quickLinks = [
    { href: "/", label: getText(labels['nav.home'], language, "Home") },
    { href: "/about", label: getText(labels['nav.about'], language, "About") },
    { href: "/products", label: getText(labels['nav.products'], language, "Products") },
    { href: "/dealers", label: getText(labels['nav.dealers'], language, "Dealers") },
    { href: "/contact", label: getText(labels['nav.contact'], language, "Contact") },
  ];

  const productLinks = [
    { href: "/products?category=biostimulant", label: "Biostimulants" },
    { href: "/products?category=biofertilizer", label: "Biofertilizers" },
    { href: "/products?category=liquid_fertilizer", label: "Liquid Fertilizers" },
    { href: "/products?category=micronutrient", label: "Micronutrients" },
  ];

  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
  };

  return (
    <footer className="footer-inera" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Avantra" className="h-10 mb-4" />
            ) : (
              <div className="text-2xl font-bold text-white mb-4">AVANTRA</div>
            )}
            <p>
              Avantra Chemicals Pvt Ltd is a leading manufacturer of biostimulants and agricultural products, dedicated to sustainable farming solutions across India.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {settings.social_links && Object.entries(settings.social_links).map(([key, url]) => {
                if (!url) return null;
                const Icon = socialIcons[key];
                if (!Icon) return null;
                return (
                  <a 
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-green-600 transition-colors"
                    data-testid={`social-${key}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-title">QUICK LINKS</div>
            <div className="footer-links">
              {quickLinks.map((link) => (
                <Link 
                  key={link.href} 
                  to={link.href} 
                  className="footer-link"
                  data-testid={`footer-link-${link.href.replace("/", "") || "home"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="footer-title">PRODUCTS</div>
            <div className="footer-links">
              {productLinks.map((link) => (
                <Link 
                  key={link.href} 
                  to={link.href} 
                  className="footer-link"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-title">CONTACT US</div>
            <div className="footer-links">
              <div className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  {getText(settings.address, language, "Avantra Chemicals Pvt Ltd, Hyderabad, Telangana, India")}
                </span>
              </div>
              <a href="tel:+919876543210" className="flex items-center gap-3 footer-link">
                <Phone className="w-5 h-5" />
                {settings.phone || "+91 98765 43210"}
              </a>
              <a href="mailto:info@avantra.com" className="flex items-center gap-3 footer-link">
                <Mail className="w-5 h-5" />
                {settings.email || "info@avantra.com"}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Avantra Chemicals Pvt Ltd. All rights reserved.
          </div>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
