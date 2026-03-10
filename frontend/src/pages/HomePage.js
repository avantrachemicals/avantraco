import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage, getLocalizedText } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sprout, Users, MapPin, Award, ChevronLeft, ChevronRight, Play, Quote } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HERO_SLIDES = [
  { title: "Nourishing Crops", subtitle: "that Nourish the World", image: "https://images.unsplash.com/photo-1724531281596-cfae90d5a082?w=1920&q=80" },
  { title: "Boosting Soil Fertility", subtitle: "with High-Efficacy Biofertilisers", image: "https://images.unsplash.com/photo-1680726040280-8968cddc571b?w=1920&q=80" },
  { title: "Enhancing Crop Growth", subtitle: "With Power-Packed Biostimulants", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&q=80" },
];

const CATEGORY_ICONS = {
  biostimulant: "🌱",
  biofertilizer: "🌾",
  liquid_fertilizer: "💧",
  micronutrient: "⚡",
  water_soluble: "🔬"
};

export default function HomePage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get(`${API}/products`).then(r => setProducts(r.data)).catch(() => {});
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
    axios.get(`${API}/testimonials/videos?featured_only=true`).then(r => setVideoTestimonials(r.data)).catch(() => {});
    axios.get(`${API}/stats`).then(r => setStats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const productsByCategory = products.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div data-testid="home-page" className="bg-white">
      {/* Hero Slider - Dark premium style */}
      <section className="hero-dark min-h-[90vh] flex items-center relative" data-testid="hero-section">
        {HERO_SLIDES.map((slide, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="text-green-400 text-sm font-semibold tracking-wider uppercase mb-4 animate-fade-in-up">
              Phytocode™ Technology
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-2 leading-tight animate-fade-in-up animation-delay-100">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-400 mb-8 animate-fade-in-up animation-delay-200">
              {HERO_SLIDES[currentSlide].subtitle}
            </h2>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Link to="/products">
                <Button className="btn-green text-base px-8 py-6">
                  Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button className="btn-outline-light text-base px-8 py-6">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-green-400 w-8' : 'bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: "70+", label: "Dealerships", icon: Users },
              { value: "12K+", label: "Farmers Served", icon: Sprout },
              { value: "30K+", label: "Acres Covered", icon: MapPin },
              { value: "64", label: "Licensed Products", icon: Award }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="stat-number mb-2">{stat.value}</div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section - Premium Cards */}
      <section className="py-24 bg-gray-50" data-testid="products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-green-600 font-semibold text-sm tracking-wider uppercase mb-4">Our Products</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Breakthrough Biological Farm Inputs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We help farmers enhance the health and quality of the produce through our revolutionary 100% bioabled agri inputs built using our deep understanding of biology.
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {Object.entries(productsByCategory).slice(0, 4).map(([category, prods]) => (
              <Link to={`/products?category=${category}`} key={category}>
                <Card className="product-card-premium h-full bg-white rounded-2xl overflow-hidden group cursor-pointer">
                  <div className="product-image-wrapper p-8 bg-gray-50 transition-all duration-300">
                    <div className="text-6xl mb-4">{CATEGORY_ICONS[category]}</div>
                    <div className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">
                      {t.products[category] || category.replace("_", " ")}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {prods.length} Products
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Explore</span>
                      <ArrowRight className="h-5 w-5 text-green-500 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <Link to={`/products/${product.slug}`} key={product.id} data-testid={`product-card-${product.slug}`}>
                  <Card className="product-card-premium h-full bg-white rounded-2xl overflow-hidden group">
                    <div className="product-image-wrapper aspect-square bg-gray-50 flex items-center justify-center p-8 transition-all">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <Sprout className="h-20 w-20 text-green-300" />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <Badge className={`badge-${product.category} text-white text-xs mb-3`}>
                        {t.products[product.category] || product.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{getLocalizedText(product.tagline, language)}</p>
                      <div className="flex items-center text-green-600 font-medium text-sm group-hover:gap-2 transition-all">
                        View Details <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button className="btn-dark text-base px-10 py-6">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 section-dark-green" data-testid="technology-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-green-400 font-semibold text-sm tracking-wider uppercase mb-4">Our Technologies</div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
                Feed the plant when they need it
              </h2>
              <div className="space-y-6">
                {[
                  { num: "01", title: "Nutrient Delivery", desc: "Our proprietary Phytocode™ technology uses enzyme activators for effective nutrient uptake." },
                  { num: "02", title: "Stress Protection", desc: "Enhances plants' defence mechanisms while maintaining nutrient uptake during stress." },
                  { num: "03", title: "Extended Stability", desc: "Special regenerative complexes improve stability & shelf life for 2-3x longer effectiveness." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="text-4xl font-bold text-green-400/30">{item.num}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="mt-8 inline-block">
                <Button className="btn-green text-base px-8 py-6">
                  Learn About Phytocode™ <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={settings.phytocode_image || "https://images.pexels.com/photos/8851401/pexels-photo-8851401.jpeg?auto=compress&w=800"}
                alt="Phytocode Technology"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-green-600">20-30%</div>
                <div className="text-sm text-gray-500">Better Nutrient Uptake</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-green-600 font-semibold text-sm tracking-wider uppercase mb-4">Hear From Our Growers</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Success Stories
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.items.map((item, i) => (
              <Card key={i} className="testimonial-card">
                <Quote className="h-10 w-10 text-green-200 mb-4" />
                <p className="text-gray-600 leading-relaxed mb-6">"{item.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.crop} | {item.location}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 hero-dark" data-testid="cta-section">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of farmers who trust Avantra Chemicals for premium crop nutrition solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button className="btn-green text-base px-10 py-6">
                Contact Us
              </Button>
            </Link>
            <Link to="/dealers">
              <Button className="btn-outline-light text-base px-10 py-6">
                Become a Dealer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
