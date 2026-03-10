import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Menu, ChevronDown } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LANG_LABELS = { en: "EN", te: "TE", kn: "KN", hi: "HI" };

export default function Navbar() {
  const location = useLocation();
  const { language, setLanguage, SUPPORTED_LANGS } = useLanguage();
  const t = translations[language]?.nav || translations.en.nav;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({});

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
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
  const isDark = isHomePage && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isDark ? 'navbar-dark' : 'navbar-light shadow-sm'}`} data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="logo-link">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Avantra" className="h-10 w-auto" />
            ) : (
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AVANTRA
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive(link.href)
                    ? 'text-green-500'
                    : isDark ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid={`nav-${link.href.replace("/", "")}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`gap-1 ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`} data-testid="language-switcher">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium">{LANG_LABELS[language]}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                {SUPPORTED_LANGS.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`cursor-pointer ${language === lang ? 'bg-green-50 text-green-600' : ''}`}
                    data-testid={`lang-${lang}`}
                  >
                    {lang === 'en' ? 'English' : lang === 'te' ? 'తెలుగు' : lang === 'kn' ? 'ಕನ್ನಡ' : 'हिंदी'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className={isDark ? 'text-white hover:bg-white/10' : ''} data-testid="mobile-menu-btn">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 bg-white">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    {settings.logo_url ? (
                      <img src={settings.logo_url} alt="Avantra" className="h-8" />
                    ) : (
                      <div className="text-xl font-bold">AVANTRA</div>
                    )}
                  </div>
                  <nav className="flex-1 p-6">
                    <div className="space-y-1">
                      <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium rounded-xl text-gray-900 hover:bg-gray-100">
                        HOME
                      </Link>
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                            isActive(link.href) ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
