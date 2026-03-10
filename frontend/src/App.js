import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import DealersPage from "@/pages/DealersPage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";
import CareersPage from "@/pages/CareersPage";
import JobDetailPage from "@/pages/JobDetailPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import CorporatePage from "@/pages/CorporatePage";
import GalleryPage from "@/pages/GalleryPage";
import MediaCenterPage from "@/pages/MediaCenterPage";
import BlogPostPage from "@/pages/BlogPostPage";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/dealers" element={<DealersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/careers/:jobId" element={<JobDetailPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/media" element={<MediaCenterPage />} />
              <Route path="/media/:slug" element={<BlogPostPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/corporate" element={<CorporatePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
