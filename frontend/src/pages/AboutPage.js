import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FlaskConical, Users, Target, Eye, Award, MapPin, Calendar, Building2, GraduationCap } from "lucide-react";

const FARM_IMG = "https://images.unsplash.com/photo-1643474004250-05d73e1473e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxmYXJtZXIlMjBmaWVsZCUyMGhhcnZlc3QlMjB2ZWdldGFibGVzJTIwZnJ1aXRzfGVufDB8fHx8MTc3MzEzOTU0N3ww&ixlib=rb-4.1.0&q=85";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language]?.about || translations.en.about;

  const timeline = [
    { date: "Jan 2024", title: language === 'en' ? "Company Founded" : language === 'te' ? "కంపెనీ స్థాపన" : language === 'kn' ? "ಕಂಪನಿ ಸ್ಥಾಪನೆ" : "कंपनी स्थापना", desc: language === 'en' ? "Avantra Chemicals Pvt Ltd incorporated in Bengaluru, Karnataka" : "Bengaluru, Karnataka", icon: Calendar },
    { date: "Q1 2024", title: language === 'en' ? "First Licenses" : language === 'te' ? "మొదటి లైసెన్సులు" : language === 'kn' ? "ಮೊದಲ ಲೈಸೆನ್ಸ್‌ಗಳು" : "पहले लाइसेंस", desc: language === 'en' ? "Obtained initial product licenses in Karnataka" : "Karnataka", icon: Award },
    { date: "Q2 2024", title: language === 'en' ? "Factory Setup" : language === 'te' ? "ఫ్యాక్టరీ సెటప్" : language === 'kn' ? "ಕಾರ್ಖಾನೆ ಸ್ಥಾಪನೆ" : "फैक्ट्री सेटअप", desc: language === 'en' ? "Manufacturing facility at Kolar, Karnataka" : "Kolar", icon: Building2 },
    { date: "2024-25", title: language === 'en' ? "Rapid Expansion" : language === 'te' ? "వేగవంతమైన విస్తరణ" : language === 'kn' ? "ತ್ವರಿತ ವಿಸ್ತರಣೆ" : "तेज विस्तार", desc: language === 'en' ? "64 licensed products, 70 dealerships, 12,000 farmers served across 30,000 acres" : "64 products, 70 dealers, 12K farmers", icon: Target },
    { date: "2025", title: language === 'en' ? "International Imports" : language === 'te' ? "అంతర్జాతీయ దిగుమతులు" : language === 'kn' ? "ಅಂತಾರಾಷ್ಟ್ರೀಯ ಆಮದು" : "अंतर्राष्ट्रीय आयात", desc: language === 'en' ? "Started importing premium raw materials from Turkey" : "Turkey imports", icon: MapPin },
  ];

  return (
    <div data-testid="about-page">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-emerald-100 text-emerald-700 mb-4">Since 2024</Badge>
              <h1 className="text-4xl sm:text-5xl text-gray-900 mb-6" data-testid="about-title">{t.title}</h1>
              <p className="text-base text-gray-600 leading-relaxed">{t.subtitle}</p>
            </div>
            <img src={FARM_IMG} alt="Indian farmer" className="rounded-2xl shadow-lg h-80 w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm bg-emerald-50">
              <CardContent className="p-8">
                <Target className="h-10 w-10 text-emerald-600 mb-4" />
                <h3 className="text-2xl text-gray-900 mb-3">{t.mission}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t.missionText}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-8">
                <Eye className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-2xl text-gray-900 mb-3">{t.vision}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t.visionText}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl text-gray-900 mb-10">{t.values}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {t.valuesItems.map((value, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className={`h-12 w-12 rounded-full mx-auto mb-3 flex items-center justify-center ${['bg-emerald-100','bg-blue-100','bg-orange-100','bg-red-100'][i]}`}>
                    {[<FlaskConical key={0} className="h-6 w-6 text-emerald-600" />, <Users key={1} className="h-6 w-6 text-blue-600" />, <Award key={2} className="h-6 w-6 text-orange-600" />, <Target key={3} className="h-6 w-6 text-red-600" />][i]}
                  </div>
                  <p className="text-sm font-medium text-gray-700">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Phytocode Technology */}
      <section className="py-20 bg-white" data-testid="phytocode-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <FlaskConical className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-6">{t.phytocodeTitle}</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-8">{t.phytocodeDesc}</p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: language === 'en' ? "Multi-Nutrient Stability" : "Stability", color: "bg-emerald-100 text-emerald-700" },
                { label: language === 'en' ? "Longer Viability" : "Viability", color: "bg-blue-100 text-blue-700" },
                { label: language === 'en' ? "Slow Nutrient Release" : "Slow Release", color: "bg-orange-100 text-orange-700" },
              ].map((item, i) => (
                <div key={i} className={`rounded-xl p-4 ${item.color}`}>
                  <p className="text-sm font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50" data-testid="timeline-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-900 text-center mb-12">{t.timeline}</h2>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className={`h-12 w-12 rounded-full shrink-0 flex items-center justify-center ${['bg-emerald-100','bg-blue-100','bg-orange-100','bg-red-100','bg-violet-100'][i]}`}>
                  <item.icon className={`h-5 w-5 ${['text-emerald-600','text-blue-600','text-orange-600','text-red-600','text-violet-600'][i]}`} />
                </div>
                <div>
                  <Badge variant="outline" className="mb-1 text-xs">{item.date}</Badge>
                  <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                {i < timeline.length - 1 && <Separator orientation="vertical" className="hidden" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team & Advisory */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Users className="h-10 w-10 text-emerald-600 mb-4" />
              <h3 className="text-2xl text-gray-900 mb-4">{t.team}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.teamDesc}</p>
              <div className="text-4xl font-bold text-emerald-600" style={{ fontFamily: "'DM Serif Display', serif" }}>18+</div>
              <p className="text-sm text-gray-500">{t.team}</p>
            </div>
            <div>
              <GraduationCap className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-2xl text-gray-900 mb-4">{t.advisory}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.advisoryDesc}</p>
              <ul className="space-y-2">
                {t.advisoryMembers.map((member, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Award className="h-4 w-4 text-orange-500" />
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-900 text-center mb-10">{t.addresses}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Building2 className="h-8 w-8 text-emerald-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">{t.corporate}</h4>
                <p className="text-sm text-gray-600">{t.corporateAddr}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">{t.factory}</h4>
                <p className="text-sm text-gray-600">{t.factoryAddr}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
