import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage, getLocalizedText } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sprout, Search, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = ["all", "biostimulant", "biofertilizer", "liquid_fertilizer", "micronutrient", "water_soluble"];
const CATEGORY_COLORS = {
  biostimulant: "bg-emerald-500", biofertilizer: "bg-blue-500",
  liquid_fertilizer: "bg-amber-500", micronutrient: "bg-red-500", water_soluble: "bg-violet-500"
};

export default function ProductsPage() {
  const { language } = useLanguage();
  const t = translations[language]?.products || translations.en.products;
  const common = translations[language]?.common || translations.en.common;
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products`, { params: activeCategory !== "all" ? { category: activeCategory } : {} })
      .then(r => { setProducts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    getLocalizedText(p.tagline, language).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-testid="products-page">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4" data-testid="products-title">{t.title}</h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-8">{t.subtitle}</p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={common.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full"
              data-testid="product-search"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2" data-testid="category-filters">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat}`}
                className={`rounded-full text-xs ${activeCategory === cat ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
              >
                {t[cat] || cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-gray-400">{common.loading}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No products found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <Link to={`/products/${product.slug}`} key={product.id} data-testid={`product-card-${product.slug}`}>
                  <Card className="product-card h-full border-0 shadow-sm overflow-hidden group">
                    <div className="relative h-44 bg-gray-50">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="product-image-placeholder w-full h-full">
                          <Sprout className="h-14 w-14 text-emerald-300" />
                        </div>
                      )}
                      {product.featured && (
                        <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">{t.featured}</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <Badge className={`${CATEGORY_COLORS[product.category] || "bg-gray-500"} text-white text-xs mb-2`}>
                        {t[product.category] || product.category}
                      </Badge>
                      <h3 className="text-base font-semibold text-gray-900 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>{product.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{getLocalizedText(product.tagline, language)}</p>
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t.viewProduct} <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
