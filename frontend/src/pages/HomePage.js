import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage, getLocalizedText } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, Sprout, Users, MapPin, Award, FlaskConical, Quote, ChevronRight, Dna, Microscope, Leaf, Zap, Clock, Shield, Play, X } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORY_COLORS = {
  biostimulant: "bg-[#044736]", biofertilizer: "bg-blue-500",
  liquid_fertilizer: "bg-orange-500", micronutrient: "bg-red-500", water_soluble: "bg-purple-500"
};

export default function HomePage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const phyto = t.phytocode || translations.en.phytocode;
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    axios.get(`${API}/products?featured=true`).then(r => setProducts(r.data)).catch(() => {});
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
    axios.get(`${API}/testimonials/videos?featured_only=true`).then(r => setVideoTestimonials(r.data)).catch(() => {});
  }, []);

  const heroImage = settings.hero_image || "https://images.unsplash.com/photo-1757031298556-c0c5c4b01e64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxyb3clMjBjcm9wcyUyMGFncmljdWx0dXJlJTIwZmllbGQlMjBncmVlbnxlbnwwfHx8fDE3NzMxNDQ1NjR8MA&ixlib=rb-4.1.0&q=85";

  const statItems = [
    { value: "70+", label: t.stats.dealers, icon: Users, color: "text-[#044736]", bg: "bg-[#D9F99D]" },
    { value: "12,000+", label: t.stats.farmers, icon: Sprout, color: "text-blue-600", bg: "bg-blue-100" },
    { value: "30,000+", label: t.stats.acres, icon: MapPin, color: "text-orange-600", bg: "bg-orange-100" },
    { value: "64", label: t.stats.licenses, icon: Award, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }} data-testid="hero-section">
        <div className="hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <Badge className="bg-[#D9F99D]/20 text-[#D9F99D] border-[#D9F99D]/30 mb-6 animate-fade-in px-4 py-1.5 text-sm font-semibold">
              <FlaskConical className="h-4 w-4 mr-2" /> {t.aboutTeaser.phytocode}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white mb-6 leading-[1.1] font-bold animate-fade-in-up text-balance" data-testid="hero-tagline">
              {t.hero.tagline}
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Button asChild size="lg" className="bg-[#D9F99D] hover:bg-[#c9e98d] text-[#044736] rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300" data-testid="hero-cta">
                <Link to="/products">{t.hero.cta} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-semibold" data-testid="hero-cta-secondary">
                <Link to="/about">{t.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-white" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statItems.map((stat, i) => (
              <Card key={i} className="stat-card border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Phytocode Section - NEW */}
      <section className="py-20 md:py-32 section-dark phytocode-section" data-testid="phytocode-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Badge className="bg-[#D9F99D]/20 text-[#D9F99D] border-[#D9F99D]/30 mb-6 text-sm font-semibold px-4 py-1.5">
                <Dna className="h-4 w-4 mr-2" /> Breakthrough Innovation
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight text-balance font-accent">
                {phyto.title}
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {phyto.intro}
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Zap, title: phyto.benefit1Title, desc: "2-3x longer stability" },
                  { icon: Clock, title: phyto.benefit2Title, desc: "Reduced frequency" },
                  { icon: Shield, title: phyto.benefit3Title, desc: "20-30% better uptake" }
                ].map((item, i) => (
                  <div key={i} className="glass-dark rounded-2xl p-5">
                    <item.icon className="h-6 w-6 text-[#D9F99D] mb-3" />
                    <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>

              <Button asChild className="bg-[#D9F99D] hover:bg-[#c9e98d] text-[#044736] rounded-full px-8 py-6 text-base font-semibold">
                <Link to="/about">{t.common.learnMore} <ChevronRight className="ml-1 h-5 w-5" /></Link>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-3xl" />
              <img
                src={settings.phytocode_image || "https://images.unsplash.com/photo-1720202194910-75fd3bc2b820?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHRpc3N1ZSUyMGN1bHR1cmUlMjB0ZXN0JTIwdHViZSUyMGxhYm9yYXRvcnklMjBzY2llbmNlfGVufDB8fHx8MTc3MzE0NDQ1MTJ8MA&ixlib=rb-4.1.0&q=85"}
                alt="Phytocode Technology"
                className="rounded-3xl shadow-2xl w-full h-80 lg:h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-6 shadow-xl max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-[#D9F99D] flex items-center justify-center animate-pulse-glow">
                    <Microscope className="h-7 w-7 text-[#044736]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{phyto.howItWorksTitle}</div>
                    <div className="text-xs text-gray-500">Nano-encapsulation + Bio-matrix</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-20 md:py-32 section-gradient" data-testid="about-teaser">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">{t.aboutTeaser.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">{t.aboutTeaser.description}</p>
              <Button asChild className="bg-[#044736] hover:bg-[#033326] text-white rounded-full px-8 py-6 text-base font-semibold" data-testid="about-teaser-cta">
                <Link to="/about">{t.common.learnMore} <ChevronRight className="ml-1 h-5 w-5" /></Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={settings.about_image || "https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBpbiUyMGZpZWxkJTIwc21pbGluZ3xlbnwwfHx8fDE3NzMxNDQ1MTl8MA&ixlib=rb-4.1.0&q=85"}
                alt="Indian farmer"
                className="rounded-3xl shadow-lg w-full h-80 lg:h-[450px] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[#D9F99D] flex items-center justify-center">
                  <Leaf className="h-7 w-7 text-[#044736]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.aboutTeaser.phytocode}</div>
                  <div className="text-xs text-gray-500">Since 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-32 bg-white" data-testid="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#D9F99D] text-[#044736] mb-4">{t.products.featured}</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.products.title}</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t.products.subtitle}</p>
          </div>
          {products.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-6xl">
              <CarouselContent className="-ml-4">
                {products.map((product) => (
                  <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <Link to={`/products/${product.slug}`} data-testid={`product-card-${product.slug}`}>
                      <Card className="product-card h-full border-0 shadow-sm overflow-hidden group">
                        <div className="relative h-52 bg-gray-50">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="product-image w-full h-full object-contain p-6" />
                          ) : (
                            <div className="product-image-placeholder w-full h-full">
                              <Sprout className="h-16 w-16 text-[#D9F99D]" />
                            </div>
                          )}
                          {product.featured && (
                            <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs">{t.products.featured}</Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <Badge className={`${CATEGORY_COLORS[product.category] || "bg-gray-500"} text-white text-xs mb-3`}>
                            {t.products[product.category] || product.category}
                          </Badge>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{getLocalizedText(product.tagline, language)}</p>
                          <span className="text-sm text-[#044736] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t.products.viewProduct} <ArrowRight className="h-4 w-4" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 lg:-left-12 bg-white shadow-lg" />
              <CarouselNext className="-right-4 lg:-right-12 bg-white shadow-lg" />
            </Carousel>
          ) : (
            <div className="text-center py-12 text-gray-400">{t.common.loading}</div>
          )}
          <div className="text-center mt-12">
            <Button asChild className="bg-[#044736] hover:bg-[#033326] text-white rounded-full px-10 py-6 text-base font-semibold" data-testid="view-all-products">
              <Link to="/products">{t.hero.cta} <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-gray-50" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.testimonials.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {t.testimonials.items.map((item, i) => (
              <Card key={i} className="testimonial-card border-0 shadow-sm bg-white rounded-2xl">
                <CardContent className="p-8">
                  <Quote className="h-10 w-10 text-[#D9F99D] mb-4" />
                  <p className="text-gray-600 leading-relaxed mb-6 italic">"{item.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#044736] flex items-center justify-center text-white font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.crop}, {item.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      {videoTestimonials.length > 0 && (
        <section className="py-20 md:py-32 bg-white" data-testid="video-testimonials-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="bg-[#D9F99D] text-[#044736] mb-4">Farmer Stories</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Video Testimonials</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">Watch real farmers share their success stories with Avantra products</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTestimonials.map((video) => (
                <Card key={video.id} className="border-0 shadow-sm rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setSelectedVideo(video)} data-testid={`video-testimonial-${video.id}`}>
                  <div className="relative aspect-video bg-gray-100">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#044736] to-[#066d52]">
                        <Play className="h-16 w-16 text-white/80" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-[#044736] ml-1" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.farmer_name}{video.location ? `, ${video.location}` : ""}</p>
                    {video.crop && <Badge variant="outline" className="mt-2 text-xs">{video.crop}</Badge>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0 rounded-2xl overflow-hidden">
          {selectedVideo && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-10 rounded-full"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="aspect-video">
                {selectedVideo.video_url.includes("youtube") || selectedVideo.video_url.includes("youtu.be") ? (
                  <iframe
                    src={selectedVideo.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedVideo.video_url.includes("vimeo") ? (
                  <iframe
                    src={selectedVideo.video_url.replace("vimeo.com/", "player.vimeo.com/video/")}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={selectedVideo.video_url} controls className="w-full h-full" />
                )}
              </div>
              <div className="p-6 bg-black text-white">
                <h3 className="text-xl font-bold mb-1">{selectedVideo.title}</h3>
                <p className="text-gray-400">{selectedVideo.farmer_name}{selectedVideo.location ? `, ${selectedVideo.location}` : ""}</p>
                {selectedVideo.quote && <p className="text-gray-300 mt-4 italic">"{selectedVideo.quote}"</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 md:py-32 section-dark" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {language === 'en' ? 'Ready to Transform Your Farm?' : language === 'te' ? 'మీ పొలాన్ని మార్చడానికి సిద్ధంగా ఉన్నారా?' : language === 'kn' ? 'ನಿಮ್ಮ ಕೃಷಿಯನ್ನು ಬದಲಾಯಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?' : 'अपने खेत को बदलने के लिए तैयार हैं?'}
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Join 12,000+ farmers across Karnataka and Andhra Pradesh who trust Avantra Chemicals for premium crop nutrition.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-[#D9F99D] hover:bg-[#c9e98d] text-[#044736] rounded-full px-10 py-6 text-base font-semibold shadow-lg" data-testid="cta-contact">
              <Link to="/contact">{t.nav.contact}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-full px-10 py-6 text-base font-semibold" data-testid="cta-dealers">
              <Link to="/dealers">{t.dealers.becomeDealer}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
