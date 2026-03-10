import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage, getLocalizedText, getLocalizedList } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { ArrowLeft, Sprout, Check, FileText, Download, Leaf, Droplets } from "lucide-react";

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
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products/${slug}`)
      .then(r => { 
        setProduct(r.data); 
        setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-white" data-testid="product-loading">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white" data-testid="product-not-found">
        <p className="text-gray-500">Product not found</p>
        <Link to="/products" className="text-black font-semibold hover:text-green-600">
          <ArrowLeft className="inline mr-2 h-4 w-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const overview = getLocalizedText(product.overview, language);
  const howItWorks = getLocalizedList(product.how_it_works, language);
  const growthStages = getLocalizedList(product.growth_stages, language);
  const dosage = getLocalizedText(product.dosage, language);
  const advantages = getLocalizedList(product.advantages, language);

  return (
    <div data-testid="product-detail-page">
      {/* Hero Section - Inera Style */}
      <section className="product-detail-hero">
        <div className="product-detail-info">
          {/* Back Link */}
          <Link 
            to="/products" 
            className="inline-flex items-center text-white/60 hover:text-white text-sm mb-8 transition-colors"
            data-testid="back-to-products"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToProducts || "Back to Products"}
          </Link>

          <div className="product-detail-brand">
            {product.brand || "AVANTRA"}<sup>™</sup>
          </div>
          
          <h1 className="product-detail-name" data-testid="product-name">
            {product.name}
          </h1>
          
          <div className="product-detail-category">
            {CATEGORY_LABELS[product.category] || product.category}
          </div>

          <p className="product-detail-desc">
            {overview || getLocalizedText(product.tagline, language)}
          </p>

          {/* Download Buttons - Inera Style */}
          <div className="product-detail-actions">
            {product.manual_url && (
              <a 
                href={product.manual_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-download"
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
                className="btn-download"
                data-testid="download-leaflet-btn"
              >
                <Download className="h-5 w-5" />
                Download Leaflet
              </a>
            )}
          </div>
        </div>

        {/* Product Image */}
        <div className="product-detail-image-container">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="product-detail-image"
              data-testid="product-image"
            />
          ) : (
            <Sprout className="w-48 h-48 text-white/20" />
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="product-detail-content">
        <div className="product-detail-grid max-w-7xl mx-auto">
          {/* Main Content */}
          <div>
            {/* Benefits / Advantages */}
            {advantages.length > 0 && (
              <div className="product-section" data-testid="advantages-section">
                <h2 className="product-section-title">
                  <span className="product-section-icon">
                    <Check className="w-5 h-5 text-green-600" />
                  </span>
                  {t.advantages || "Benefits"}
                </h2>
                <div className="benefits-list">
                  {advantages.map((adv, i) => (
                    <div key={i} className="benefit-item">
                      <div className="benefit-check">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="benefit-text">{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How It Works */}
            {howItWorks.length > 0 && (
              <div className="product-section" data-testid="how-it-works-section">
                <h2 className="product-section-title">
                  <span className="product-section-icon">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </span>
                  {t.howItWorks || "How It Works"}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {howItWorks.map((item, i) => (
                    <div key={i} className="benefit-item">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <span className="benefit-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Composition Table */}
            {product.composition && product.composition.length > 0 && (
              <div className="product-section" data-testid="composition-section">
                <h2 className="product-section-title">
                  <span className="product-section-icon">
                    <Droplets className="w-5 h-5 text-green-600" />
                  </span>
                  {t.composition || "Active Ingredients"}
                </h2>
                <table className="composition-table-inera">
                  <thead>
                    <tr>
                      <th>{t.component || "Component"}</th>
                      <th>{t.specification || "Specification"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.composition.map((row, i) => (
                      <tr key={i}>
                        <td>{row.component}</td>
                        <td>{row.specification}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Growth Stages */}
            {growthStages.length > 0 && (
              <div className="sidebar-card" data-testid="growth-stages-section">
                <h3 className="sidebar-card-title">
                  <Leaf className="w-5 h-5 text-green-600" />
                  {t.growthStages || "Targeted Growth Stages"}
                </h3>
                <div className="flex flex-wrap">
                  {growthStages.map((stage, i) => (
                    <span key={i} className="sidebar-tag">{stage}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Dosage */}
            {dosage && (
              <div className="sidebar-card" data-testid="dosage-section">
                <h3 className="sidebar-card-title">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  {t.dosage || "Application Window"}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{dosage}</p>
              </div>
            )}

            {/* Crops */}
            {product.crops && (
              <div className="sidebar-card">
                <h3 className="sidebar-card-title">Crops</h3>
                <p className="text-gray-600 text-sm">{product.crops}</p>
              </div>
            )}

            {/* Contact CTA */}
            <div className="sidebar-card-cta">
              <h4>Need More Information?</h4>
              <p>Contact us for detailed product information or to place an order.</p>
              <Link to="/contact" className="btn-contact">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-gray">
          <div className="max-w-7xl mx-auto">
            <h2 className="section-title-large mb-8">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-0">
              {relatedProducts.map(p => (
                <Link 
                  to={`/products/${p.slug}`} 
                  key={p.id} 
                  className="product-card-inera"
                >
                  <div className="product-card-image">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} />
                    ) : (
                      <Sprout className="w-16 h-16 text-gray-200" />
                    )}
                  </div>
                  <div className="product-card-brand">{p.brand || "AVANTRA"}</div>
                  <div className="product-card-name">{p.name}</div>
                  <div className="product-card-desc">
                    {getLocalizedText(p.tagline, language)}
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
