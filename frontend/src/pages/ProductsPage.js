import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, getText } from "@/context/ContentContext";
import { Sprout } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = [
  { key: "all", label: "All Products" },
  { key: "biostimulant", label: "Biostimulants" },
  { key: "biofertilizer", label: "Biofertilizers" },
  { key: "liquid_fertilizer", label: "Liquid Fertilizers" },
  { key: "micronutrient", label: "Micronutrients" },
  { key: "water_soluble", label: "Water Soluble" }
];

export default function ProductsPage() {
  const { language } = useLanguage();
  const { pages, categories: dbCategories } = useContent();
  const pageContent = pages['products']?.content || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = activeCategory !== "all" ? { category: activeCategory } : {};
    axios.get(`${API}/products`, { params })
      .then(r => { setProducts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div data-testid="products-page">
      {/* Hero Section - Inera Style */}
      <section className="products-hero">
        <div className="products-hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80" 
            alt=""
          />
        </div>
        <div className="products-hero-content">
          <h1 className="products-hero-title" data-testid="products-title">
            {getText(pageContent.hero_title, language, "Our Products")}
          </h1>
        </div>
      </section>

      {/* Filter Bar - Inera Style */}
      <div className="products-filter-bar" data-testid="category-filters">
        <div className="products-filter-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`products-filter-tab ${activeCategory === cat.key ? 'active' : ''}`}
              data-testid={`filter-${cat.key}`}
            >
              {cat.key === 'all' ? getText(pageContent.filter_all, language, 'All Products') : cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid - Inera Style */}
      <section className="bg-white">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Sprout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found in this category</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <Link 
                to={`/products/${product.slug}`} 
                key={product.id} 
                className="product-card-inera"
                data-testid={`product-card-${product.slug}`}
              >
                <div className="product-card-image">
                  {product.image_url ? (
                    <img src={product.image_url} alt={getText(product.name, language)} />
                  ) : (
                    <Sprout className="w-20 h-20 text-gray-200" />
                  )}
                </div>
                <div className="product-card-brand">
                  {getText(product.brand, language, "AVANTRA")}
                </div>
                <div className="product-card-name">{getText(product.name, language)}</div>
                <div className="product-card-subtitle">
                  {CATEGORIES.find(c => c.key === product.category)?.label || product.category?.replace("_", " ")}
                </div>
                <div className="product-card-desc">
                  {getText(product.tagline, language)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="section-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Help Choosing the Right Product?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Our agricultural experts are here to help you find the perfect solution for your crops.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-white text-black font-semibold hover:bg-green-500 hover:text-white transition-colors"
            >
              Contact Our Experts
            </Link>
            <Link 
              to="/dealers"
              className="px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Find a Dealer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
