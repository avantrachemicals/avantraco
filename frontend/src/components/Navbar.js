import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Menu, X, ChevronDown } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LANG_LABELS = { en: "English", te: "తెలుగు", kn: "ಕನ್ನಡ", hi: "हिंदी" };

export default function Navbar() {
  const location = useLocation();
  const { language, setLanguage, SUPPORTED_LANGS } = useLanguage();
  const t = translations[language]?.nav || translations.en.nav;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/about", label: t.about },
    { href: "/products", label: t.products },
    { href: "/gallery", label: "Gallery" },
    { href: "/media", label: "Media" },
    { href: "/dealers", label: t.dealers },
    { href: "/careers", label: t.careers },
    { href: "/contact", label: t.contact },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "navbar-glass shadow-sm" : "bg-white/95 backdrop-blur-sm"}`} data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Avantra" className="h-10 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-[#044736] flex items-center justify-center">
                  <span className="text-[#D9F99D] font-bold text-xl">A</span>
                </div>
                <span className="text-xl font-bold text-[#044736] hidden sm:block">Avantra</span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive(link.href)
                    ? "bg-[#D9F99D] text-[#044736]"
                    : "text-gray-600 hover:text-[#044736] hover:bg-gray-100"
                }`}
                data-testid={`nav-${link.href.replace("/", "") || "home"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full border-gray-200 gap-2" data-testid="language-switcher">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{LANG_LABELS[language]}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                {SUPPORTED_LANGS.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`cursor-pointer ${language === lang ? "bg-[#D9F99D]/30 text-[#044736]" : ""}`}
                    data-testid={`lang-${lang}`}
                  >
                    {LANG_LABELS[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="mobile-menu-btn">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-[#044736] flex items-center justify-center">
                        <span className="text-[#D9F99D] font-bold text-xl">A</span>
                      </div>
                      <span className="text-xl font-bold text-[#044736]">Avantra</span>
                    </div>
                  </div>
                  <nav className="flex-1 p-6">
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                            isActive(link.href)
                              ? "bg-[#D9F99D] text-[#044736]"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </nav>
                  <div className="p-6 border-t">
                    <div className="text-xs text-gray-500 mb-2">Language</div>
                    <div className="grid grid-cols-2 gap-2">
                      {SUPPORTED_LANGS.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => { setLanguage(lang); setIsOpen(false); }}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            language === lang ? "bg-[#044736] text-white" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {LANG_LABELS[lang]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
