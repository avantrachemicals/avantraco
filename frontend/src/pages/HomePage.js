import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage, getLocalizedText } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { ArrowRight, Sprout, Leaf, FlaskConical, Shield, ChevronLeft, ChevronRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Hero Slides with farming/agriculture theme images
const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80",
    titleTop: "Nourishing Crops",
    titleBottom: "that nourish India"
  },
  {
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80",
    titleTop: "Boosting Soil Fertility",
    titleBottom: "with Bio-Stimulants"
  },
  {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
    titleTop: "Enhancing Crop Growth",
    titleBottom: "with Advanced Technology"
  },
  {
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80",
    titleTop: "Improving Yield Quality",
    titleBottom: "with Natural Solutions"
  }
];

// Product Categories
const PRODUCT_CATEGORIES = [
  {
    brand: "TRUMAGIC",
    name: "Biostimulants",
    desc: "High-performing plant growth enhancers",
    link: "/products?category=biostimulant",
    icon: Sprout
  },
  {
    brand: "NUTRIGOLD",
    name: "Biofertilizers",
    desc: "Power-packed soil nutrition solutions",
    link: "/products?category=biofertilizer",
    icon: Leaf
  },
  {
    brand: "GROMAX",
    name: "Micronutrients",
    desc: "Essential mineral supplements for crops",
    link: "/products?category=micronutrient",
    icon: FlaskConical
  },
  {
    brand: "CROPSHIELD",
    name: "Liquid Fertilizers",
    desc: "Fast-acting foliar nutrition",
    link: "/products?category=liquid_fertilizer",
    icon: Shield
  }
];

export default function HomePage() {
  const { language } = useLanguage();
  const t = translations[language]?.home || translations.en.home;
  const stats = translations[language]?.stats || translations.en.stats;
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.get(`${API}/products?featured=true`).then(r => setProducts(r.data.slice(0, 4))).catch(() => {});
    axios.get(`${API}/videos`).then(r => setTestimonials(r.data)).catch(() => {});
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div data-testid="home-page">
      {/* Hero Slider - Inera Style */}
      <section className="hero-slider-container" data-testid="hero-slider">
        {HERO_SLIDES.map((slide, index) => (
          <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
            <img 
              src={slide.image} 
              alt={slide.titleTop} 
              className="hero-slide-image"
            />
            <div className="hero-slide-overlay" />
            <div className="hero-slide-content">
              <h1 className="hero-title">{slide.titleTop}</h1>
              <h1 className="hero-subtitle">{slide.titleBottom}</h1>
            </div>
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        
        {/* Pagination Dots */}
        <div className="hero-pagination">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Products Section - Inera Style */}
      <section className="section-white">
        <div className="max-w-7xl mx-auto">
          <div className="section-title-small">Our Products</div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <div>
              <h2 className="section-title-large">
                Breakthrough Biological Farm Inputs
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                At Avantra Chemicals, we are on a bold mission to restore the golden balance between nature and science.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We help farmers enhance the health and quality of their produce through our revolutionary 100% bio-enabled agri inputs built using our deep understanding of biology.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We make progressive, sustainable agriculture universal. On every acre across India.
              </p>
            </div>
            
            {/* Right - Product Category Cards */}
            <div className="product-category-grid">
              {PRODUCT_CATEGORIES.map((cat, index) => (
                <Link 
                  key={index} 
                  to={cat.link}
                  className="product-category-card group"
                  data-testid={`category-card-${index}`}
                >
                  <div className="product-category-brand">{cat.brand}<sup>™</sup></div>
                  <div className="product-category-name">{cat.name}</div>
                  <div className="product-category-desc">{cat.desc}</div>
                  <div className="product-category-arrow">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <cat.icon className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 text-white/10" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Inera Style */}
      <section className="stats-section border-t border-b">
        <div className="max-w-7xl mx-auto">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.farmers}<span>+</span></div>
              <div className="stat-label">Farmers Served</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.dealers}<span>+</span></div>
              <div className="stat-label">Authorized Dealers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.products}<span>+</span></div>
              <div className="stat-label">Bio Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.states}<span>+</span></div>
              <div className="stat-label">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Grid Style */}
      {products.length > 0 && (
        <section className="section-gray">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <div className="section-title-small">Featured Products</div>
                <h2 className="section-title-large mb-0">Our Best Sellers</h2>
              </div>
              <Link 
                to="/products" 
                className="flex items-center gap-2 text-sm font-semibold text-black hover:text-green-600 transition-colors"
              >
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">
              {products.map((product) => (
                <Link 
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="product-card-inera"
                  data-testid={`featured-product-${product.slug}`}
                >
                  <div className="product-card-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <Sprout className="w-20 h-20 text-gray-300" />
                    )}
                  </div>
                  <div className="product-card-brand">AVANTRA</div>
                  <div className="product-card-name">{product.name}</div>
                  <div className="product-card-desc">
                    {getLocalizedText(product.tagline, language)}
                  </div>
                  <div className="product-card-tag">
                    {product.category?.replace("_", " ")}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technology Section */}
      <section className="section-black">
        <div className="max-w-7xl mx-auto">
          <div className="section-title-small">Our Technology</div>
          <h2 className="section-title-large white mb-12">
            Phytocode Technology
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Feed the plant when they need it",
                desc: "Our proprietary technologies use enzyme activators to ensure effective nutrient uptake and delivery when plants need it the most."
              },
              {
                num: "02",
                title: "Protect plants from stressors",
                desc: "In cases of biotic & abiotic stress, our technologies enhance plants' defence mechanisms while maintaining nutrient uptake."
              },
              {
                num: "03",
                title: "Make products last longer",
                desc: "Our technologies employ special regenerative complexes that improve stability & shelf life, reducing the required number of applications."
              }
            ].map((item, index) => (
              <div key={index} className="border border-white/20 p-8">
                <div className="text-green-500 text-5xl font-bold mb-6">{item.num}</div>
                <h3 className="text-white text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-white hover:text-green-500 transition-colors font-medium"
            >
              Learn More About Our Technology
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title-large mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            Join thousands of farmers who have already improved their crop yield and quality with Avantra's bio-solutions.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              to="/products"
              className="px-8 py-4 bg-black text-white font-semibold hover:bg-green-600 transition-colors"
            >
              Explore Products
            </Link>
            <Link 
              to="/contact"
              className="px-8 py-4 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
