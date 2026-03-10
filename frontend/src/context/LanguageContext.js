import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const SUPPORTED_LANGS = ['en', 'te', 'kn', 'hi'];

function detectBrowserLang() {
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  const short = browserLang.split('-')[0].toLowerCase();
  if (short === 'te') return 'te';
  if (short === 'kn') return 'kn';
  if (short === 'hi') return 'hi';
  return 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('avantra-lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    return detectBrowserLang();
  });

  useEffect(() => {
    localStorage.setItem('avantra-lang', language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, SUPPORTED_LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export function getLocalizedText(obj, lang) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
}

export function getLocalizedList(obj, lang) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return obj[lang] || obj.en || [];
}
