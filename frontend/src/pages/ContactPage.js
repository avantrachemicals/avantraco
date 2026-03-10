import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language]?.contact || translations.en.contact;
  const [settings, setSettings] = useState({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      alert("Error submitting form. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div data-testid="contact-page">
      {/* Hero Section - Inera Style */}
      <section className="products-hero">
        <div className="products-hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=1920&q=80" 
            alt=""
          />
        </div>
        <div className="products-hero-content">
          <h1 className="products-hero-title" data-testid="contact-title">
            {t.title || "Contact Us"}
          </h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <div className="section-title-small">Get In Touch</div>
              <h2 className="section-title-large">
                {t.subtitle || "We'd Love to Hear From You"}
              </h2>
              <p className="text-gray-600 mb-10">
                Have questions about our products or want to become a dealer? Reach out to us and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Office Address</h3>
                    <p className="text-gray-600">
                      {settings.address || "Avantra Chemicals Pvt Ltd, Hyderabad, Telangana, India - 500001"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Phone Number</h3>
                    <p className="text-gray-600">
                      {settings.phone || "+91 98765 43210"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Email Address</h3>
                    <p className="text-gray-600">
                      {settings.email || "info@avantrachemicals.com"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-10">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-500 mx-auto mb-6 flex items-center justify-center">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-3">Thank You!</h3>
                  <p className="text-gray-600">We've received your message and will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-testid="contact-form">
                  <h3 className="text-2xl font-bold text-black mb-8">Send Us a Message</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
                        placeholder="Enter your name"
                        data-testid="contact-name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
                        placeholder="Enter your email"
                        data-testid="contact-email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({...form, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
                        placeholder="Enter your phone number"
                        data-testid="contact-phone"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none resize-none"
                        placeholder="How can we help you?"
                        data-testid="contact-message"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-black text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                      data-testid="contact-submit"
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
