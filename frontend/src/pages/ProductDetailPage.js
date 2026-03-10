import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage, getLocalizedText, getLocalizedList } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sprout, Check, FileText, Download, Leaf, Droplets, FlaskConical, Target, Layers } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORY_LABELS = {
  biostimulant: "Biostimulant",
  biofertilizer: "Biofertilizer", 
  liquid_fertilizer: "Liquid Fertilizer",
  micronutrient: "Micronutrient",
  water_soluble: "Water Soluble"
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const t = translations[language]?.productDetail || translations.en.productDetail;
  const pt = translations[language]?.products || translations.en.products;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products/${slug}`)
      .then(r => { 
        setProduct(r.data); 
        setLoading(false);
        // Fetch related products in same category
        if (r.data.category) {
          axios.get(`${API}/products?category=${r.data.category}`)
            .then(res => setRelatedProducts(res.data.filter(p => p.slug !== slug).slice(0, 3)))
            .catch(() => {});
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]" data-testid="product-loading">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]" data-testid="product-not-found">
        <p className="text-gray-400">Product not found</p>
        <Button asChild className="btn-green">
          <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> {t.backToProducts}</Link>
        </Button>
      </div>
    );
  }

  const overview = getLocalizedText(product.overview, language);
  const howItWorks = getLocalizedList(product.how_it_works, language);
  const growthStages = getLocalizedList(product.growth_stages, language);
  const dosage = getLocalizedText(product.dosage, language);
  const advantages = getLocalizedList(product.advantages, language);

  return (
    <div data-testid="product-detail-page" className="bg-white">
      {/* Hero Section - Dark Premium Style */}
      <section className="product-hero-bg min-h-[70vh] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
          {/* Back button */}
          <Link 
            to="/products" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 text-sm"
            data-testid="back-to-products"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToProducts}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Product Info */}
            <div className="order-2 lg:order-1">
              <div className="text-green-400 text-sm font-bold tracking-wider uppercase mb-3">
                {product.brand || "AVANTRA"}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" data-testid="product-name">
                {product.name}
              </h1>
              
              <Badge className="bg-white/10 text-white border-white/20 mb-6">
                {CATEGORY_LABELS[product.category] || product.category}
              </Badge>

              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
                {overview || getLocalizedText(product.tagline, language)}
              </p>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-4">
                {product.manual_url && (
                  <a 
                    href={product.manual_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="download-btn"
                    data-testid="download-manual-btn"
                  >
                    <FileText className="h-5 w-5" />
                    Download Product Manual
                  </a>
                )}
                {product.leaflet_url && (
                  <a 
                    href={product.leaflet_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="download-btn"
                    data-testid="download-leaflet-btn"
                  >
                    <Download className="h-5 w-5" />
                    Download Leaflet
                  </a>
                )}
              </div>
            </div>

            {/* Right - Product Image */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="max-h-[400px] w-auto object-contain drop-shadow-2xl animate-float"
                    data-testid="product-image"
                  />
                ) : (
                  <div className="h-[400px] w-[300px] rounded-3xl bg-white/5 flex items-center justify-center">
                    <Sprout className="h-32 w-32 text-green-400/30" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Benefits / Advantages */}
            {advantages.length > 0 && (
              <section data-testid="advantages-section">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t.advantages || "Benefits"}</h2>
                </div>
                <div className="space-y-3">
                  {advantages.map((adv, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-gray-700">{adv}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* How It Works */}
            {howItWorks.length > 0 && (
              <section data-testid="how-it-works-section">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t.howItWorks || "How It Works"}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {howItWorks.map((item, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                          ['bg-green-500', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500'][i % 4]
                        }`}>
                          {i + 1}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Composition Table */}
            {product.composition && product.composition.length > 0 && (
              <section data-testid="composition-section">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FlaskConical className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t.composition || "Active Ingredients"}</h2>
                </div>
                <div className="composition-table bg-white overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>{t.component || "Component"}</th>
                        <th className="text-right">{t.specification || "Specification"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.composition.map((row, i) => (
                        <tr key={i}>
                          <td className="text-gray-700">{row.component}</td>
                          <td className="text-gray-900 font-medium text-right">{row.specification}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Growth Stages */}
            {growthStages.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6" data-testid="growth-stages-section">
                <div className="flex items-center gap-3 mb-5">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-gray-900">{t.growthStages || "Targeted Growth Stages"}</h3>
                </div>
                <div className="space-y-2">
                  {growthStages.map((stage, i) => (
                    <div key={i} className={`px-4 py-3 rounded-xl text-sm font-medium ${
                      ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-orange-100 text-orange-700', 'bg-purple-100 text-purple-700'][i % 4]
                    }`}>
                      {stage}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dosage */}
            {dosage && (
              <div className="bg-blue-50 rounded-2xl p-6" data-testid="dosage-section">
                <div className="flex items-center gap-3 mb-4">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">{t.dosage || "Application Window"}</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{dosage}</p>
              </div>
            )}

            {/* Crops - if available */}
            {product.crops && (
              <div className="bg-orange-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Layers className="h-5 w-5 text-orange-600" />
                  <h3 className="font-bold text-gray-900">Crops</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{product.crops}</p>
              </div>
            )}

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-[#0d3d2a] to-[#064e3b] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-3">Need More Information?</h3>
              <p className="text-gray-300 text-sm mb-5">Contact us for detailed product information or to place an order.</p>
              <Link to="/contact">
                <Button className="w-full bg-white text-[#0d3d2a] hover:bg-gray-100 rounded-full font-semibold">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <Link to={`/products/${p.slug}`} key={p.id} className="group">
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                    <div className="h-40 flex items-center justify-center mb-4">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                      ) : (
                        <Sprout className="h-16 w-16 text-green-200" />
                      )}
                    </div>
                    <div className="text-green-600 text-xs font-bold tracking-wider uppercase mb-1">
                      {product.brand || "AVANTRA"}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{p.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{getLocalizedText(p.tagline, language)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
