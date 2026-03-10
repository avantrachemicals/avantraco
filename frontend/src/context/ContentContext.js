import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : '/api';

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const [pages, setPages] = useState({});
  const [labels, setLabels] = useState({});
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all content on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [pagesRes, labelsRes, catsRes, settingsRes] = await Promise.all([
          axios.get(`${API}/pages`).catch(() => ({ data: [] })),
          axios.get(`${API}/labels`).catch(() => ({ data: {} })),
          axios.get(`${API}/categories`).catch(() => ({ data: [] })),
          axios.get(`${API}/settings`).catch(() => ({ data: {} }))
        ]);
        
        // Convert pages array to object keyed by page_key
        const pagesObj = {};
        pagesRes.data.forEach(p => { pagesObj[p.page_key] = p; });
        setPages(pagesObj);
        setLabels(labelsRes.data);
        setCategories(catsRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error('Error fetching content:', err);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  // Refresh content
  const refreshContent = useCallback(async () => {
    setLoading(true);
    try {
      const [pagesRes, labelsRes, catsRes, settingsRes] = await Promise.all([
        axios.get(`${API}/pages`),
        axios.get(`${API}/labels`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/settings`)
      ]);
      const pagesObj = {};
      pagesRes.data.forEach(p => { pagesObj[p.page_key] = p; });
      setPages(pagesObj);
      setLabels(labelsRes.data);
      setCategories(catsRes.data);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error('Error refreshing content:', err);
    }
    setLoading(false);
  }, []);

  return (
    <ContentContext.Provider value={{ pages, labels, categories, settings, loading, refreshContent, API }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

// Helper function to get translated text
export function getText(obj, lang, fallback = '') {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj['en'] || fallback;
}

// Helper function to get translated list
export function getList(obj, lang) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return obj[lang] || obj['en'] || [];
}

export default ContentContext;
