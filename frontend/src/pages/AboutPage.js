import { useLanguage } from "@/context/LanguageContext";
import { useContent, getText } from "@/context/ContentContext";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowRight, Users, Target, Leaf, Award, FlaskConical, Shield } from "lucide-react";

export default function AboutPage() {
  const { language } = useLanguage();
  const { pages, settings } = useContent();
  const pageContent = pages['about']?.content || {};
  const pageSeo = pages['about']?.seo || {};

  const seoTitle = getText(pageSeo.title, language, 'About Avantra Chemicals');
  const seoDesc = getText(pageSeo.description, language);

  return (
    <div data-testid="about-page">
      <Helmet>
        <title>{seoTitle}</title>
        {seoDesc && <meta name="description" content={seoDesc} />}
      </Helmet>

      {/* Hero Section */}
      <section className="products-hero">
        <div className="products-hero-bg">
          <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80" alt="" />
        </div>
        <div className="products-hero-content">
          <h1 className="products-hero-title" data-testid="about-title">
            {getText(pageContent.hero_title, language, "About Us")}
          </h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-title-small">{getText(pageContent.mission_label, language, "Our Mission")}</div>
              <h2 className="section-title-large">
                {getText(pageContent.mission_title, language, "Nurturing the Interaction Between Plant, Soil & Microbes")}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {getText(pageContent.mission_desc, language, "At Avantra Chemicals, we are on a bold mission to restore the golden balance between nature and science.")}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We help farmers enhance the health and quality of their produce through our revolutionary 100% bio-enabled agri inputs built using our deep understanding of biology.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We make progressive, sustainable agriculture universal. On every acre across India.
              </p>
            </div>
            <div>
              <img src={pageContent.team_image || "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"} alt="Our Team" className="w-full h-[400px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-title-small">{getText(pageContent.values_label, language, "Our Values")}</div>
            <h2 className="section-title-large">{getText(pageContent.values_title, language, "What Drives Us")}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {(pageContent.values || [
              { title: { en: "Innovation" }, desc: { en: "Constantly pushing boundaries in agricultural science" } },
              { title: { en: "Farmer First" }, desc: { en: "Every decision centers around farmer welfare" } },
              { title: { en: "Sustainability" }, desc: { en: "Committed to eco-friendly farming solutions" } },
              { title: { en: "Excellence" }, desc: { en: "Uncompromising quality in every product" } }
            ]).map((value, index) => {
              const icons = [Target, Users, Leaf, Award];
              const Icon = icons[index % icons.length];
              return (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{getText(value.title, language)}</h3>
                  <p className="text-gray-600">{getText(value.desc, language)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="section-black">
        <div className="max-w-7xl mx-auto">
          <div className="section-title-small">Our Technology</div>
          <h2 className="section-title-large white mb-6">Phytocode Technology</h2>
          <p className="text-white/70 text-lg mb-12 max-w-3xl">
            Our proprietary Phytocode technology represents a breakthrough in agricultural science, enabling precise nutrient delivery and plant protection.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FlaskConical, num: "01", title: "Feed the plant when they need it", desc: "Our proprietary technologies use enzyme activators to ensure effective nutrient uptake and delivery when plants need it the most." },
              { icon: Shield, num: "02", title: "Protect plants from stressors", desc: "In cases of biotic & abiotic stress, our technologies enhance plants' defence mechanisms while maintaining nutrient uptake." },
              { icon: Leaf, num: "03", title: "Make products last longer", desc: "Our technologies employ special regenerative complexes that improve stability & shelf life, reducing the required number of applications." }
            ].map((item, index) => (
              <div key={index} className="border border-white/20 p-8">
                <item.icon className="w-10 h-10 text-green-500 mb-6" />
                <div className="text-green-500 text-sm font-semibold mb-4">{item.num}</div>
                <h3 className="text-white text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* R&D Section */}
      <section className="section-gray">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src={pageContent.rd_image || "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80"} alt="Research Lab" className="w-full h-[400px] object-cover" />
            </div>
            <div>
              <div className="section-title-small">Research & Development</div>
              <h2 className="section-title-large">Our R&D Core</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Avantra's bio-products are developed with world-class research infrastructure and a team of dedicated scientists working on breakthrough agricultural solutions.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div><div className="text-4xl font-bold text-green-600">50+</div><div className="text-sm text-gray-500 mt-1">Scientists & Researchers</div></div>
                <div><div className="text-4xl font-bold text-green-600">1000+</div><div className="text-sm text-gray-500 mt-1">Microbial Strains</div></div>
                <div><div className="text-4xl font-bold text-green-600">5+</div><div className="text-sm text-gray-500 mt-1">R&D Centers</div></div>
                <div><div className="text-4xl font-bold text-green-600">100+</div><div className="text-sm text-gray-500 mt-1">Field Trials</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Us in Transforming Indian Agriculture</h2>
          <p className="text-white/70 text-lg mb-10">Partner with us as a dealer or explore our products to enhance your farm's productivity.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/products" className="px-8 py-4 bg-white text-black font-semibold hover:bg-green-500 hover:text-white transition-colors inline-flex items-center gap-2">
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dealers" className="px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-colors">
              Become a Dealer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
