import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, getText, getList } from "@/context/ContentContext";
import { ArrowLeft, Sprout, Check, FileText, Download, Leaf, Droplets } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : '/api';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { labels, categories } = useContent();
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
    return <div className="min-h-screen flex items-center justify-center bg-white" data-testid="product-loading">{getText(labels['general.loading'], language, 'Loading...')}</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white" data-testid="product-not-found">
        <p className="text-gray-500">{getText(labels['general.no_results'], language, 'Product not found')}</p>
        <Link to="/products" className="text-black font-semibold hover:text-green-600">
          <ArrowLeft className="inline mr-2 h-4 w-4" /> {getText(labels['btn.back_to_products'], language, 'Back to Products')}
        </Link>
      </div>
    );
  }

  const name = getText(product.name, language);
  const brand = getText(product.brand, language, 'AVANTRA');
  const overview = getText(product.overview, language);
  const tagline = getText(product.tagline, language);
  const howItWorks = getList(product.how_it_works, language);
  const growthStages = getList(product.growth_stages, language);
  const dosage = getText(product.dosage, language);
  const advantages = getList(product.advantages, language);
  const crops = getText(product.crops, language);
  
  // Get category name
  const categoryObj = categories.find(c => c.category_key === product.category);
  const categoryName = categoryObj ? getText(categoryObj.name, language) : product.category;
  
  // Composition - handle translatable components
  const composition = (product.composition || []).map(row => ({
    component: getText(row.component, language, row.component),
    specification: getText(row.specification, language, row.specification)
  }));

  // SEO
  const seoTitle = getText(product.seo_title, language) || `${name} - Avantra Chemicals`;
  const seoDesc = getText(product.seo_description, language) || overview || tagline;

  return (
    <div data-testid="product-detail-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        {product.seo_keywords && <meta name="keywords" content={getText(product.seo_keywords, language)} />}
        {product.og_image && <meta property="og:image" content={product.og_image} />}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
      </Helmet>

      {/* Hero Section */}
      <section className="product-detail-hero">
        <div className="product-detail-info">
          <Link to="/products" className="inline-flex items-center text-white/60 hover:text-white text-sm mb-8 transition-colors" data-testid="back-to-products">
            <ArrowLeft className="mr-2 h-4 w-4" /> {getText(labels['btn.back_to_products'], language, 'Back to Products')}
          </Link>

          <div className="product-detail-brand">{brand}<sup>™</sup></div>
          <h1 className="product-detail-name" data-testid="product-name">{name}</h1>
          <div className="product-detail-category">{categoryName}</div>
          <p className="product-detail-desc">{overview || tagline}</p>

          {/* Download Buttons */}
          <div className="product-detail-actions">
            {product.manual_url && (
              <a href={product.manual_url} target="_blank" rel="noopener noreferrer" className="btn-download" data-testid="download-manual-btn">
                <FileText className="h-5 w-5" />
                {getText(labels['btn.download_manual'], language, 'Download Product Manual')}
              </a>
            )}
            {product.leaflet_url && (
              <a href={product.leaflet_url} target="_blank" rel="noopener noreferrer" className="btn-download" data-testid="download-leaflet-btn">
                <Download className="h-5 w-5" />
                {getText(labels['btn.download_leaflet'], language, 'Download Leaflet')}
              </a>
            )}
          </div>
        </div>

        {/* Product Image */}
        <div className="product-detail-image-container">
          {product.image_url ? (
            <img src={product.image_url} alt={name} className="product-detail-image" data-testid="product-image" />
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
            {/* Benefits */}
            {advantages.length > 0 && (
              <div className="product-section" data-testid="advantages-section">
                <h2 className="product-section-title">
                  <span className="product-section-icon"><Check className="w-5 h-5 text-green-600" /></span>
                  {getText(labels['product.benefits'], language, 'Benefits')}
                </h2>
                <div className="benefits-list">
                  {advantages.map((adv, i) => (
                    <div key={i} className="benefit-item">
                      <div className="benefit-check"><Check className="w-4 h-4 text-white" /></div>
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
                  <span className="product-section-icon"><Leaf className="w-5 h-5 text-green-600" /></span>
                  {getText(labels['product.how_it_works'], language, 'How It Works')}
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

            {/* Composition */}
            {composition.length > 0 && (
              <div className="product-section" data-testid="composition-section">
                <h2 className="product-section-title">
                  <span className="product-section-icon"><Droplets className="w-5 h-5 text-green-600" /></span>
                  {getText(labels['product.composition'], language, 'Active Ingredients')}
                </h2>
                <table className="composition-table-inera">
                  <thead>
                    <tr>
                      <th>{getText(labels['product.component'], language, 'Component')}</th>
                      <th>{getText(labels['product.specification'], language, 'Specification')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {composition.map((row, i) => (
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
                  {getText(labels['product.growth_stages'], language, 'Targeted Growth Stages')}
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
                  {getText(labels['product.dosage'], language, 'Application Window')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{dosage}</p>
              </div>
            )}

            {/* Crops */}
            {crops && (
              <div className="sidebar-card">
                <h3 className="sidebar-card-title">{getText(labels['product.crops'], language, 'Crops')}</h3>
                <p className="text-gray-600 text-sm">{crops}</p>
              </div>
            )}

            {/* Contact CTA */}
            <div className="sidebar-card-cta">
              <h4>{getText(labels['general.need_info'], language, 'Need More Information?')}</h4>
              <p>{getText(labels['general.contact_desc'], language, 'Contact us for detailed product information or to place an order.')}</p>
              <Link to="/contact" className="btn-contact">{getText(labels['nav.contact'], language, 'Contact Us')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-gray">
          <div className="max-w-7xl mx-auto">
            <h2 className="section-title-large mb-8">{getText(labels['product.related'], language, 'Related Products')}</h2>
            <div className="grid md:grid-cols-3 gap-0">
              {relatedProducts.map(p => (
                <Link to={`/products/${p.slug}`} key={p.id} className="product-card-inera">
                  <div className="product-card-image">
                    {p.image_url ? <img src={p.image_url} alt={getText(p.name, language)} /> : <Sprout className="w-16 h-16 text-gray-200" />}
                  </div>
                  <div className="product-card-brand">{getText(p.brand, language, 'AVANTRA')}</div>
                  <div className="product-card-name">{getText(p.name, language)}</div>
                  <div className="product-card-desc">{getText(p.tagline, language)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
