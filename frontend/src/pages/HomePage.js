import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, getText } from "@/context/ContentContext";
import { ArrowRight, Sprout, ChevronLeft, ChevronRight } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : '/api';

export default function HomePage() {
  const { language } = useLanguage();
  const { pages, categories, labels, loading: contentLoading } = useContent();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);

  // Get page content
  const pageContent = pages['home']?.content || {};
  const heroSlides = pageContent.hero_slides || [];
  const productsSection = pageContent.products_section || {};
  const stats = pageContent.stats || {};
  const techSection = pageContent.technology_section || {};
  const ctaSection = pageContent.cta_section || {};

  // Auto-rotate slides
  useEffect(() => {
    if (heroSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  // Fetch products
  useEffect(() => {
    axios.get(`${API}/products?featured=true`).then(r => setProducts(r.data.slice(0, 4))).catch(() => {});
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  if (contentLoading) {
    return <div className="min-h-screen flex items-center justify-center">{getText(labels['general.loading'], language, 'Loading...')}</div>;
  }

  return (
    <div data-testid="home-page">
      {/* Hero Slider */}
      <section className="hero-slider-container" data-testid="hero-slider">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
            <img src={slide.image} alt="" className="hero-slide-image" />
            <div className="hero-slide-overlay" />
            <div className="hero-slide-content">
              <h1 className="hero-title">{getText(slide.title_top, language)}</h1>
              <h1 className="hero-subtitle">{getText(slide.title_bottom, language)}</h1>
            </div>
          </div>
        ))}
        
        {heroSlides.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors" aria-label="Previous slide">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={nextSlide} className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors" aria-label="Next slide">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <div className="hero-pagination">
              {heroSlides.map((_, index) => (
                <button key={index} onClick={() => setCurrentSlide(index)} className={`hero-dot ${index === currentSlide ? 'active' : ''}`} aria-label={`Go to slide ${index + 1}`} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Products Section */}
      <section className="section-white">
        <div className="max-w-7xl mx-auto">
          <div className="section-title-small">{getText(productsSection.label, language, 'Our Products')}</div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="section-title-large">{getText(productsSection.title, language, 'Breakthrough Biological Farm Inputs')}</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">{getText(productsSection.description, language)}</p>
              <p className="text-gray-600 leading-relaxed">{getText(productsSection.description2, language)}</p>
            </div>
            
            {/* Category Cards from Database */}
            <div className="product-category-grid">
              {categories.slice(0, 4).map((cat, index) => (
                <Link key={index} to={`/products?category=${cat.category_key}`} className="product-category-card group" data-testid={`category-card-${index}`}>
                  <div className="product-category-brand">{getText(cat.name, language)}</div>
                  <div className="product-category-desc">{getText(cat.description, language)}</div>
                  <div className="product-category-arrow">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section border-t border-b">
        <div className="max-w-7xl mx-auto">
          <div className="stats-grid">
            {['farmers', 'dealers', 'products', 'states'].map((key) => (
              stats[key] && (
                <div key={key} className="stat-item">
                  <div className="stat-number">{stats[key].value}<span>+</span></div>
                  <div className="stat-label">{getText(stats[key].label, language)}</div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="section-gray">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <div className="section-title-small">{getText(labels['product.featured'], language, 'Featured Products')}</div>
                <h2 className="section-title-large mb-0">{getText(labels['product.best_sellers'], language, 'Our Best Sellers')}</h2>
              </div>
              <Link to="/products" className="flex items-center gap-2 text-sm font-semibold text-black hover:text-green-600 transition-colors">
                {getText(labels['btn.view_all'], language, 'View All Products')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`} className="product-card-inera" data-testid={`featured-product-${product.slug}`}>
                  <div className="product-card-image">
                    {product.image_url ? <img src={product.image_url} alt={getText(product.name, language)} /> : <Sprout className="w-20 h-20 text-gray-300" />}
                  </div>
                  <div className="product-card-brand">{getText(product.brand, language, 'AVANTRA')}</div>
                  <div className="product-card-name">{getText(product.name, language)}</div>
                  <div className="product-card-desc">{getText(product.tagline, language)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technology Section */}
      <section className="section-black">
        <div className="max-w-7xl mx-auto">
          <div className="section-title-small">{getText(techSection.label, language, 'Our Technology')}</div>
          <h2 className="section-title-large white mb-12">{getText(techSection.title, language, 'Phytocode Technology')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {(techSection.features || []).map((item, index) => (
              <div key={index} className="border border-white/20 p-8">
                <div className="text-green-500 text-5xl font-bold mb-6">{item.num}</div>
                <h3 className="text-white text-xl font-semibold mb-4">{getText(item.title, language)}</h3>
                <p className="text-white/60 leading-relaxed">{getText(item.desc, language)}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/about" className="inline-flex items-center gap-2 text-white hover:text-green-500 transition-colors font-medium">
              {getText(labels['btn.learn_more'], language, 'Learn More About Our Technology')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title-large mb-6">{getText(ctaSection.title, language, 'Ready to Transform Your Farm?')}</h2>
          <p className="text-gray-600 text-lg mb-10">{getText(ctaSection.description, language)}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/products" className="px-8 py-4 bg-black text-white font-semibold hover:bg-green-600 transition-colors">
              {getText(ctaSection.btn_products, language, 'Explore Products')}
            </Link>
            <Link to="/contact" className="px-8 py-4 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors">
              {getText(ctaSection.btn_contact, language, 'Contact Us')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
