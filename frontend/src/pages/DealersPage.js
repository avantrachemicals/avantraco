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
import { MapPin, Users, Sprout, Store } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function DealersPage() {
  const { language } = useLanguage();
  const t = translations[language]?.dealers || translations.en.dealers;
  const stats = translations[language]?.stats || translations.en.stats;
  const [form, setForm] = useState({ name: "", business_name: "", email: "", phone: "", location: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/dealers/apply`, form);
      toast.success(t.success);
      setForm({ name: "", business_name: "", email: "", phone: "", location: "", message: "" });
    } catch {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <div data-testid="dealers-page" className="bg-white">
      {/* Header - Dark Premium Style */}
      <section className="product-hero-bg min-h-[40vh] relative flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d2a] via-[#0d3d2a]/90 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" data-testid="dealers-title">
            {t.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">{t.subtitle}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 mb-12">
            {[
              { value: "70+", label: stats.dealers, icon: Store, color: "text-emerald-600 bg-emerald-100" },
              { value: "12,000+", label: stats.farmers, icon: Users, color: "text-blue-600 bg-blue-100" },
              { value: "30,000+", label: stats.acres, icon: Sprout, color: "text-orange-600 bg-orange-100" },
            ].map((s, i) => (
              <Card key={i} className="border-0 shadow-sm text-center">
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-full mx-auto mb-3 flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Placeholder + Form */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <div>
              <h2 className="text-2xl text-gray-900 mb-6">{t.mapTitle}</h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-80 flex items-center justify-center border" data-testid="map-placeholder">
                <div className="text-center p-8">
                  <MapPin className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.states}</h3>
                  <p className="text-sm text-gray-500">Karnataka & Andhra Pradesh</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {["Bengaluru", "Kolar", "Mysore", "Hyderabad", "Vijayawada", "Guntur"].map(city => (
                      <span key={city} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{city}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">{t.becomeDealer}</h2>
              <p className="text-sm text-gray-500 mb-6">{t.dealerForm}</p>
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="dealer-form">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dealer-name">{t.name}</Label>
                    <Input id="dealer-name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} data-testid="dealer-name-input" />
                  </div>
                  <div>
                    <Label htmlFor="dealer-business">{t.businessName}</Label>
                    <Input id="dealer-business" value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})} data-testid="dealer-business-input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dealer-email">{t.email}</Label>
                    <Input id="dealer-email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} data-testid="dealer-email-input" />
                  </div>
                  <div>
                    <Label htmlFor="dealer-phone">{t.phone}</Label>
                    <Input id="dealer-phone" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} data-testid="dealer-phone-input" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dealer-location">{t.location}</Label>
                  <Input id="dealer-location" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} data-testid="dealer-location-input" />
                </div>
                <div>
                  <Label htmlFor="dealer-message">{t.message}</Label>
                  <Textarea id="dealer-message" rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} data-testid="dealer-message-input" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-full" data-testid="dealer-submit-btn">
                  {submitting ? "..." : t.submit}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
