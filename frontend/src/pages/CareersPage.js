import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useContent, getText } from "@/context/ContentContext";
import { Briefcase, MapPin, Clock, ChevronRight, Users, Sprout, Award } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CareersPage() {
  const { language } = useLanguage();
  const { pages } = useContent();
  const pageContent = pages['careers']?.content || {};
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/jobs`)
      .then(r => { setJobs(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div data-testid="careers-page">
      {/* Hero Section - Inera Style */}
      <section className="products-hero">
        <div className="products-hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80" 
            alt=""
          />
        </div>
        <div className="products-hero-content">
          <h1 className="products-hero-title" data-testid="careers-title">
            {getText(pageContent.hero_title, language, "Careers")}
          </h1>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="section-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-title-small">Why Join Us</div>
            <h2 className="section-title-large">Build Your Career at Avantra</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Sprout, 
                title: "Impactful Work", 
                desc: "Help thousands of farmers grow better crops and improve their livelihoods through innovative bio-solutions." 
              },
              { 
                icon: Users, 
                title: "Great Team", 
                desc: "Work with passionate agri-entrepreneurs and scientists who are transforming Indian agriculture." 
              },
              { 
                icon: Award, 
                title: "Growth Opportunity", 
                desc: "Join a fast-growing company with rapid expansion plans and excellent career advancement opportunities." 
              }
            ].map((item, i) => (
              <div key={i} className="text-center p-8 border border-gray-200 hover:border-black transition-colors">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-gray">
        <div className="max-w-7xl mx-auto">
          <div className="section-title-small">Open Positions</div>
          <h2 className="section-title-large mb-12">Current Openings</h2>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-white">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-2">No Open Positions</h3>
              <p className="text-gray-500 mb-6">
                We don't have any open positions right now, but we're always looking for talented people.
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold hover:bg-green-600 transition-colors"
              >
                Send Your Resume
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link 
                  to={`/careers/${job.id}`}
                  key={job.id}
                  className="block bg-white p-6 hover:shadow-lg transition-shadow group"
                  data-testid={`job-${job.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-black group-hover:text-green-600 transition-colors mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                        )}
                        {job.type && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </span>
                        )}
                        {job.department && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.department}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-black group-hover:text-green-600 transition-colors">
                      View Details
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Don't See a Suitable Position?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold hover:bg-green-500 hover:text-white transition-colors"
          >
            Contact Us
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
