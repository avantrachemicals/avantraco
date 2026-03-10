import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage, getLocalizedText, getLocalizedList } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Sprout, Check, FlaskConical, Leaf, Droplets, Target } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CATEGORY_COLORS = {
  biostimulant: "bg-emerald-500", biofertilizer: "bg-blue-500",
  liquid_fertilizer: "bg-amber-500", micronutrient: "bg-red-500", water_soluble: "bg-violet-500"
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const t = translations[language]?.productDetail || translations.en.productDetail;
  const pt = translations[language]?.products || translations.en.products;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products/${slug}`)
      .then(r => { setProduct(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400" data-testid="product-loading">Loading...</div>;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" data-testid="product-not-found">
      <p className="text-gray-500">Product not found</p>
      <Button asChild variant="outline"><Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> {t.backToProducts}</Link></Button>
    </div>
  );

  const overview = getLocalizedText(product.overview, language);
  const howItWorks = getLocalizedList(product.how_it_works, language);
  const growthStages = getLocalizedList(product.growth_stages, language);
  const dosage = getLocalizedText(product.dosage, language);
  const advantages = getLocalizedList(product.advantages, language);

  return (
    <div data-testid="product-detail-page">
      {/* Header */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="mb-4" data-testid="back-to-products">
            <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> {t.backToProducts}</Link>
          </Button>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Product Image */}
            <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center justify-center min-h-[300px]">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="max-h-72 w-auto object-contain" data-testid="product-image" />
              ) : (
                <div className="product-image-placeholder h-72 w-full rounded-xl flex items-center justify-center">
                  <Sprout className="h-24 w-24 text-emerald-300" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`${CATEGORY_COLORS[product.category] || "bg-gray-500"} text-white text-xs`}>
                  {pt[product.category] || product.category}
                </Badge>
                {product.featured && <Badge className="bg-orange-500 text-white text-xs">{pt.featured}</Badge>}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-3" data-testid="product-name">{product.name}</h1>
              <p className="text-lg text-emerald-600 font-medium mb-4">{getLocalizedText(product.tagline, language)}</p>
              {overview && <p className="text-sm text-gray-600 leading-relaxed">{overview}</p>}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Composition */}
        {product.composition && product.composition.length > 0 && (
          <section data-testid="composition-section">
            <div className="flex items-center gap-2 mb-6">
              <FlaskConical className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl text-gray-900">{t.composition}</h2>
            </div>
            <Card className="border-0 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-emerald-50">
                    <TableHead className="font-semibold text-emerald-800">{t.component}</TableHead>
                    <TableHead className="font-semibold text-emerald-800 text-right">{t.specification}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.composition.map((row, i) => (
                    <TableRow key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <TableCell className="text-sm text-gray-700">{row.component}</TableCell>
                      <TableCell className="text-sm text-gray-900 font-medium text-right">{row.specification}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        )}

        {/* How It Works */}
        {howItWorks.length > 0 && (
          <section data-testid="how-it-works-section">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl text-gray-900">{t.howItWorks}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {howItWorks.map((item, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-5 flex gap-3">
                    <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold ${['bg-emerald-500','bg-blue-500','bg-orange-500','bg-red-500'][i % 4]}`}>
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Growth Stages */}
        {growthStages.length > 0 && (
          <section data-testid="growth-stages-section">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl text-gray-900">{t.growthStages}</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {growthStages.map((stage, i) => (
                <div key={i} className={`rounded-xl p-4 ${['bg-emerald-50','bg-blue-50','bg-orange-50','bg-red-50'][i % 4]}`}>
                  <p className="text-sm font-medium text-gray-700">{stage}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dosage */}
        {dosage && (
          <section data-testid="dosage-section">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl text-gray-900">{t.dosage}</h2>
            </div>
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-6">
                <p className="text-sm text-gray-700 font-medium">{dosage}</p>
              </CardContent>
            </Card>
          </section>
        )}

        <Separator />

        {/* Advantages */}
        {advantages.length > 0 && (
          <section data-testid="advantages-section">
            <h2 className="text-2xl text-gray-900 mb-6">{t.advantages}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {advantages.map((adv, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{adv}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
