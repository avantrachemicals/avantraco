import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Building2, Send } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language]?.contact || translations.en.contact;
  const about = translations[language]?.about || translations.en.about;
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", language });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, { ...form, language });
      toast.success(t.success);
      setForm({ name: "", email: "", phone: "", message: "", language });
    } catch {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <div data-testid="contact-page" className="bg-white">
      {/* Header - Dark Premium Style */}
      <section className="product-hero-bg min-h-[40vh] relative flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=1920&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d2a] via-[#0d3d2a]/90 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" data-testid="contact-title">
            {t.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">{t.subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-name">{t.name}</Label>
                    <Input id="contact-name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} data-testid="contact-name-input" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">{t.email}</Label>
                    <Input id="contact-email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} data-testid="contact-email-input" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact-phone">{t.phone}</Label>
                  <Input id="contact-phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} data-testid="contact-phone-input" />
                </div>
                <div>
                  <Label htmlFor="contact-message">{t.message}</Label>
                  <Textarea id="contact-message" rows={5} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} data-testid="contact-message-input" />
                </div>
                <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8" data-testid="contact-submit-btn">
                  <Send className="mr-2 h-4 w-4" /> {submitting ? "..." : t.submit}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">{t.info}</h3>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{t.corporate}</h4>
                      <p className="text-sm text-gray-500">{about.corporateAddr}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{t.factory}</h4>
                      <p className="text-sm text-gray-500">{about.factoryAddr}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <span className="text-sm text-gray-700">+91-9030559163</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-gray-700">support@avantra.in</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
