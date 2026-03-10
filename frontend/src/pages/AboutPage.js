import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FlaskConical, Users, Target, Eye, Award, MapPin, Calendar, Building2, GraduationCap, Dna, Zap, Clock, Shield, Microscope } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const FARM_IMG = "https://images.unsplash.com/photo-1643474004250-05d73e1473e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxmYXJtZXIlMjBmaWVsZCUyMGhhcnZlc3QlMjB2ZWdldGFibGVzJTIwZnJ1aXRzfGVufDB8fHx8MTc3MzEzOTU0N3ww&ixlib=rb-4.1.0&q=85";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language]?.about || translations.en.about;
  const phyto = translations[language]?.phytocode || translations.en.phytocode;
  const [settings, setSettings] = useState({});

  useEffect(() => {
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
  }, []);

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

      {/* Phytocode Technology - Detailed */}
      <section className="py-20 md:py-32 section-dark" data-testid="phytocode-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Badge className="bg-[#D9F99D]/20 text-[#D9F99D] border-[#D9F99D]/30 mb-6 text-sm font-semibold px-4 py-1.5">
                <Dna className="h-4 w-4 mr-2" /> {language === 'en' ? 'Breakthrough Innovation' : language === 'te' ? 'ప్రగతిశీల ఆవిష్కరణ' : language === 'kn' ? 'ಪ್ರಗತಿಶೀಲ ಆವಿಷ್ಕಾರ' : 'अभूतपूर्व नवाचार'}
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight text-balance font-accent">
                {phyto.title}
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {phyto.intro}
              </p>
              
              <div className="space-y-6 mb-8">
                {[
                  { icon: Zap, title: phyto.benefit1Title, desc: phyto.benefit1Desc },
                  { icon: Clock, title: phyto.benefit2Title, desc: phyto.benefit2Desc },
                  { icon: Shield, title: phyto.benefit3Title, desc: phyto.benefit3Desc }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="h-12 w-12 rounded-xl bg-[#D9F99D]/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6 text-[#D9F99D]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <Microscope className="h-6 w-6 text-[#D9F99D]" />
                  <h4 className="font-semibold text-white">{phyto.howItWorksTitle}</h4>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{phyto.howItWorksDesc}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-3xl" />
              <img
                src={settings.phytocode_image || "https://images.pexels.com/photos/8851401/pexels-photo-8851401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
                alt="Phytocode Technology"
                className="rounded-3xl shadow-2xl w-full h-80 lg:h-[550px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-[#D9F99D] flex items-center justify-center">
                    <FlaskConical className="h-7 w-7 text-[#044736]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{language === 'en' ? 'Proprietary Tech' : language === 'te' ? 'స్వంత టెక్' : language === 'kn' ? 'ಸ್ವಂತ ತಂತ್ರಜ್ಞಾನ' : 'स्वामित्व तकनीक'}</div>
                    <div className="text-xs text-gray-500">{language === 'en' ? 'Nano-encapsulation + Bio-matrix' : 'Nano + Bio-matrix'}</div>
                  </div>
                </div>
              </div>
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
