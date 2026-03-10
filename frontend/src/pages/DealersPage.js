import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, getText } from "@/context/ContentContext";
import { MapPin, Phone, User, Building, Send } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function DealersPage() {
  const { language } = useLanguage();
  const { pages } = useContent();
  const pageContent = pages['dealers']?.content || {};
  const [dealers, setDealers] = useState([]);
  const [form, setForm] = useState({ name: "", business_name: "", location: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${API}/dealers`).then(r => setDealers(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/dealers`, form);
      setSubmitted(true);
      setForm({ name: "", business_name: "", location: "", phone: "", message: "" });
    } catch (err) {
      alert("Error submitting application. Please try again.");
    }
    setSubmitting(false);
  };

  const filteredDealers = dealers.filter(d =>
    d.location?.toLowerCase().includes(search.toLowerCase()) ||
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-testid="dealers-page">
      {/* Hero Section - Inera Style */}
      <section className="products-hero">
        <div className="products-hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80" 
            alt=""
          />
        </div>
        <div className="products-hero-content">
          <h1 className="products-hero-title" data-testid="dealers-title">
            {getText(pageContent.hero_title, language, "Dealer Network")}
          </h1>
        </div>
      </section>

      {/* Find a Dealer Section */}
      <section className="section-white">
        <div className="max-w-7xl mx-auto">
          <div className="section-title-small">Find a Dealer</div>
          <h2 className="section-title-large mb-8">
            {getText(pageContent.find_subtitle, language, "Our Authorized Dealers")}
          </h2>

          {/* Search */}
          <div className="mb-10">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by location or dealer name..."
              className="w-full max-w-md px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
              data-testid="dealer-search"
            />
          </div>

          {/* Dealers Grid */}
          {filteredDealers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDealers.map((dealer) => (
                <div 
                  key={dealer.id} 
                  className="border border-gray-200 p-6 hover:border-black transition-colors"
                  data-testid={`dealer-${dealer.id}`}
                >
                  <h3 className="text-lg font-bold text-black mb-3">{dealer.name}</h3>
                  {dealer.business_name && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <Building className="w-4 h-4" />
                      {dealer.business_name}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    {dealer.location}
                  </div>
                  {dealer.phone && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone className="w-4 h-4" />
                      {dealer.phone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {search ? "No dealers found matching your search." : "No dealers available yet."}
            </div>
          )}
        </div>
      </section>

      {/* Become a Dealer Section */}
      <section className="section-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-title-small">Join Our Network</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Become an Authorized Dealer
            </h2>
            <p className="text-white/70">
              Partner with us to bring innovative bio-solutions to farmers in your region.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-10 bg-white/10 p-10">
              <div className="w-16 h-16 bg-green-500 mx-auto mb-6 flex items-center justify-center">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Application Submitted!</h3>
              <p className="text-white/70">We'll review your application and contact you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-10" data-testid="dealer-form">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="Enter your name"
                    data-testid="dealer-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={form.business_name}
                    onChange={e => setForm({...form, business_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="Enter business name"
                    data-testid="dealer-business"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={e => setForm({...form, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="City, State"
                    data-testid="dealer-location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="Enter phone number"
                    data-testid="dealer-phone"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-black mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none resize-none"
                  placeholder="Tell us about your business experience..."
                  data-testid="dealer-message"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full py-4 bg-black text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                data-testid="dealer-submit"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
