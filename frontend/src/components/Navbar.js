import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, getText } from "@/context/ContentContext";
import { Menu, X, Globe, ChevronDown } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { language, setLanguage, SUPPORTED_LANGS } = useLanguage();
  const { settings, labels } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: "ABOUT" },
    { href: "/products", label: "PRODUCTS" },
    { href: "/gallery", label: "GALLERY" },
    { href: "/media", label: "MEDIA" },
    { href: "/dealers", label: "DEALERS" },
    { href: "/contact", label: "CONTACT" },
  ];

  const isActive = (path) => location.pathname === path;
  const langLabels = { en: "EN", te: "TE", kn: "KN", hi: "HI" };

  return (
    <>
      <nav 
        className={`navbar-inera ${scrolled || !isHomePage ? 'scrolled' : 'transparent'}`}
        data-testid="navbar"
      >
        {/* Logo */}
        <Link to="/" data-testid="logo-link">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="Avantra" className="navbar-logo" />
          ) : (
            <div className="text-white text-2xl font-bold tracking-wider">
              AVANTRA
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`navbar-link ${isActive(link.href) ? 'active' : ''}`}
              data-testid={`nav-${link.href.replace("/", "")}`}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Language Selector */}
          <div className="relative">
            <button 
              className="navbar-link flex items-center gap-1"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              data-testid="language-switcher"
            >
              <Globe className="w-4 h-4" />
              {langLabels[language]}
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {langMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white shadow-lg py-2 min-w-[120px]">
                {SUPPORTED_LANGS.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setLangMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === lang ? 'bg-gray-100 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    data-testid={`lang-${lang}`}
                  >
                    {lang === 'en' ? 'English' : lang === 'te' ? 'Telugu' : lang === 'kn' ? 'Kannada' : 'Hindi'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black pt-20 px-6 lg:hidden">
          <button 
            className="absolute top-6 right-6 text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="flex flex-col gap-6">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-2xl font-medium"
            >
              HOME
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-medium ${isActive(link.href) ? 'text-green-500' : 'text-white'}`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Language Selector */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-white/20">
              {SUPPORTED_LANGS.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setMobileMenuOpen(false); }}
                  className={`px-4 py-2 text-sm font-medium ${language === lang ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}
                >
                  {langLabels[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
