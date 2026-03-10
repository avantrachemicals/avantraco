import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Phone, Mail, Award, Users, Factory, Globe } from "lucide-react";

export default function CorporatePage() {
  const { language } = useLanguage();
  const t = translations[language]?.about || translations.en.about;

  return (
    <div data-testid="corporate-page" className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="py-20 md:py-32 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="bg-[#D9F99D] text-[#044736] mb-6 text-sm font-semibold px-4 py-1">
              Corporate Information
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#044736] mb-6 leading-tight text-balance">
              Avantra Chemicals Pvt Ltd
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Leading manufacturer of innovative agricultural inputs, empowering Indian farmers with science-backed crop nutrition solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Company Overview</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Avantra Chemicals Pvt Ltd is an innovative agricultural input company founded in 2024 by young agri-entrepreneurs with a vision to transform Indian farming through cutting-edge crop nutrition solutions.
                </p>
                <p>
                  Headquartered in Bengaluru, Karnataka, with manufacturing facilities in Kolar, we specialize in biostimulants, biofertilizers, liquid fertilizers, micronutrients, and water-soluble fertilizers.
                </p>
                <p>
                  Our proprietary Phytocode™ technology enables the integration and stabilization of multiple nutrients in a single formulation, providing longer shelf life and controlled nutrient release for optimal crop performance.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, label: "Licensed Products", value: "64", color: "bg-[#D9F99D]", iconColor: "text-[#044736]" },
                { icon: Users, label: "Dealers", value: "70+", color: "bg-blue-100", iconColor: "text-blue-600" },
                { icon: Globe, label: "Farmers Served", value: "12,000+", color: "bg-orange-100", iconColor: "text-orange-600" },
                { icon: Factory, label: "Team Members", value: "18+", color: "bg-purple-100", iconColor: "text-purple-600" }
              ].map((stat, i) => (
                <Card key={i} className="border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-6">
                    <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{t.addresses}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <div className="h-2 bg-[#044736]" />
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-[#D9F99D] flex items-center justify-center shrink-0">
                    <Building2 className="h-7 w-7 text-[#044736]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t.corporate}</h3>
                    <p className="text-gray-600 mb-4">{t.corporateAddr}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> +91-9030559163
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> support@avantra.in
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <div className="h-2 bg-blue-500" />
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Factory className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t.factory}</h3>
                    <p className="text-gray-600 mb-4">{t.factoryAddr}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Kolar District, Karnataka
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Registration & Compliance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Company Registration", items: ["CIN: U24XXX", "Incorporated: January 2024", "Type: Private Limited Company"] },
              { title: "Licenses & Certifications", items: ["FCO Approved Products", "ISO 9001:2015 Certified", "State Fertilizer Licenses"] },
              { title: "Banking Details", items: ["Available on request", "For vendor/dealer inquiries", "Contact: accounts@avantrachemicals.com"] }
            ].map((section, i) => (
              <Card key={i} className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#044736]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
