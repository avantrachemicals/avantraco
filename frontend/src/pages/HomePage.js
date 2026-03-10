import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage, getLocalizedText } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ArrowRight, Sprout, Users, MapPin, Award, FlaskConical, Quote, ChevronRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const HERO_IMG = "https://images.unsplash.com/photo-1597474417024-3ca3baa9fb13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxncmVlbiUyMGFncmljdWx0dXJhbCUyMGZpZWxkJTIwY3JvcCUyMGZhcm0lMjBJbmRpYXxlbnwwfHx8fDE3NzMxMzk1NDd8MA&ixlib=rb-4.1.0&q=85";

const CATEGORY_COLORS = {
  biostimulant: "bg-emerald-500", biofertilizer: "bg-blue-500",
  liquid_fertilizer: "bg-amber-500", micronutrient: "bg-red-500", water_soluble: "bg-violet-500"
};

export default function HomePage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get(`${API}/products?featured=true`).then(r => setProducts(r.data)).catch(() => {});
    axios.get(`${API}/stats`).then(r => setStats(r.data)).catch(() => {});
  }, []);

  const statItems = [
    { value: "70+", label: t.stats.dealers, icon: Users, color: "text-emerald-600" },
    { value: "12,000+", label: t.stats.farmers, icon: Sprout, color: "text-blue-600" },
    { value: "30,000+", label: t.stats.acres, icon: MapPin, color: "text-orange-600" },
    { value: "64", label: t.stats.licenses, icon: Award, color: "text-red-600" },
  ];

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${HERO_IMG})` }} data-testid="hero-section">
        <div className="hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-6 animate-fade-in">
              <FlaskConical className="h-3 w-3 mr-1" /> {t.aboutTeaser.phytocode}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight animate-fade-in-up" data-testid="hero-tagline">
              {t.hero.tagline}
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8" data-testid="hero-cta">
                <Link to="/products">{t.hero.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8" data-testid="hero-cta-secondary">
                <Link to="/about">{t.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat, i) => (
              <Card key={i} className="stat-card border-0 shadow-sm bg-gray-50 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-20 bg-emerald-50/50" data-testid="about-teaser">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl text-gray-900 mb-6">{t.aboutTeaser.title}</h2>
              <p className="text-base text-gray-600 leading-relaxed mb-8">{t.aboutTeaser.description}</p>
              <Button asChild variant="outline" className="rounded-full border-emerald-600 text-emerald-700 hover:bg-emerald-50" data-testid="about-teaser-cta">
                <Link to="/about">{t.common.learnMore} <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1770371474286-bc6c5098ed5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGFncmljdWx0dXJhbCUyMGZpZWxkJTIwY3JvcCUyMGZhcm0lMjBJbmRpYXxlbnwwfHx8fDE3NzMxMzk1NDd8MA&ixlib=rb-4.1.0&q=85"
                alt="Green rice field"
                className="rounded-2xl shadow-lg w-full h-72 lg:h-96 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <FlaskConical className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.aboutTeaser.phytocode}</div>
                  <div className="text-xs text-gray-500">Since 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white" data-testid="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">{t.products.title}</h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">{t.products.subtitle}</p>
          </div>
          {products.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-6xl">
              <CarouselContent className="-ml-4">
                {products.map((product) => (
                  <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <Link to={`/products/${product.slug}`} data-testid={`product-card-${product.slug}`}>
                      <Card className="product-card h-full border-0 shadow-sm overflow-hidden">
                        <div className="relative h-48 bg-gray-50">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4" />
                          ) : (
                            <div className="product-image-placeholder w-full h-full">
                              <Sprout className="h-16 w-16 text-emerald-300" />
                            </div>
                          )}
                          {product.featured && (
                            <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs">{t.products.featured}</Badge>
                          )}
                        </div>
                        <CardContent className="p-5">
                          <Badge className={`${CATEGORY_COLORS[product.category] || "bg-gray-500"} text-white text-xs mb-2`}>
                            {t.products[product.category] || product.category}
                          </Badge>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>{product.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{getLocalizedText(product.tagline, language)}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 lg:-left-12" />
              <CarouselNext className="-right-4 lg:-right-12" />
            </Carousel>
          ) : (
            <div className="text-center py-12 text-gray-400">{t.common.loading}</div>
          )}
          <div className="text-center mt-10">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8" data-testid="view-all-products">
              <Link to="/products">{t.hero.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl text-gray-900 text-center mb-12">{t.testimonials.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.items.map((item, i) => (
              <Card key={i} className="testimonial-card border-0 shadow-sm bg-white">
                <CardContent className="p-6 pt-8">
                  <Quote className="h-8 w-8 text-emerald-500 opacity-30 mb-3" />
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">"{item.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.crop}, {item.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-700" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl text-white mb-6">{language === 'en' ? 'Ready to Transform Your Farm?' : language === 'te' ? 'మీ పొలాన్ని మార్చడానికి సిద్ధంగా ఉన్నారా?' : language === 'kn' ? 'ನಿಮ್ಮ ಕೃಷಿಯನ್ನು ಬದಲಾಯಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?' : 'अपने खेत को बदलने के लिए तैयार हैं?'}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 rounded-full px-8" data-testid="cta-contact">
              <Link to="/contact">{t.nav.contact}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8" data-testid="cta-dealers">
              <Link to="/dealers">{t.dealers.becomeDealer}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
