import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useLanguage, getLocalizedText } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = [
  { key: "all", label: "All Products" },
  { key: "biostimulant", label: "Biostimulants" },
  { key: "biofertilizer", label: "Biofertilizers" },
  { key: "liquid_fertilizer", label: "Liquid Fertilizers" },
  { key: "micronutrient", label: "Micronutrients" },
  { key: "water_soluble", label: "Water Soluble" }
];

const CATEGORY_COLORS = {
  biostimulant: "bg-green-500",
  biofertilizer: "bg-blue-500",
  liquid_fertilizer: "bg-orange-500",
  micronutrient: "bg-red-500",
  water_soluble: "bg-purple-500"
};

export default function ProductsPage() {
  const { language } = useLanguage();
  const t = translations[language]?.products || translations.en.products;
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

  // Group products by category for the category view
  const productsByCategory = products.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div data-testid="products-page" className="bg-white">
      {/* Hero Section - Dark Premium Style */}
      <section className="product-hero-bg min-h-[50vh] relative flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d2a] via-[#0d3d2a]/90 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" data-testid="products-title">
            {t.title || "Our Products"}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            {t.subtitle || "Nurturing the interaction between plant, soil & microbes"}
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-20 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide" data-testid="category-filters">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.key}
                variant={activeCategory === cat.key ? "default" : "ghost"}
                size="sm"
                onClick={() => handleCategoryChange(cat.key)}
                data-testid={`filter-${cat.key}`}
                className={`rounded-full whitespace-nowrap text-sm font-medium ${
                  activeCategory === cat.key 
                    ? "bg-[#0d3d2a] text-white hover:bg-[#064e3b]" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {t[cat.key] || cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Sprout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products found in this category</p>
            </div>
          ) : (
            <>
              {/* Section Header */}
              <div className="mb-12">
                <h2 className="text-sm font-bold tracking-wider text-green-600 uppercase mb-2">Our Products</h2>
                <h3 className="text-3xl font-bold text-gray-900">
                  {activeCategory === "all" 
                    ? "Our exhaustive range of breakthrough ag biologicals" 
                    : t[activeCategory] || activeCategory.replace("_", " ")}
                </h3>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link 
                    to={`/products/${product.slug}`} 
                    key={product.id} 
                    data-testid={`product-card-${product.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                      {/* Product Image */}
                      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 group-hover:from-green-50 group-hover:to-emerald-50 transition-colors">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <Sprout className="h-20 w-20 text-green-200" />
                        )}
                        {product.featured && (
                          <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="text-green-600 text-xs font-bold tracking-wider uppercase mb-1">
                          {product.brand || "AVANTRA™"}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                          {product.name}
                        </h3>
                        <Badge className={`${CATEGORY_COLORS[product.category] || "bg-gray-500"} text-white text-xs w-fit mb-3`}>
                          {t[product.category] || product.category?.replace("_", " ")}
                        </Badge>
                        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
                          {getLocalizedText(product.tagline, language)}
                        </p>
                        
                        {/* View Details Link */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">
                            View Details
                          </span>
                          <ArrowRight className="h-4 w-4 text-green-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0d3d2a] to-[#064e3b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Need Help Choosing the Right Product?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Our agricultural experts are here to help you find the perfect solution for your crops.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button className="btn-green text-base px-8 py-6">
                Contact Our Experts
              </Button>
            </Link>
            <Link to="/dealers">
              <Button className="btn-outline-light text-base px-8 py-6">
                Find a Dealer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
