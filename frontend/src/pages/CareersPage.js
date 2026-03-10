import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, ChevronRight, Users, Sprout, Award } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CareersPage() {
  const { language } = useLanguage();
  const t = translations[language]?.careers || translations.en.careers;
  const stats = translations[language]?.stats || translations.en.stats;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/jobs`)
      .then(r => { setJobs(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div data-testid="careers-page">
      {/* Hero */}
      <section className="py-20 md:py-32 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="bg-[#D9F99D] text-[#044736] mb-6 text-sm font-semibold px-4 py-1">
              We're Hiring
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#044736] mb-6 leading-tight text-balance" data-testid="careers-title">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sprout, title: "Impactful Work", desc: "Help 12,000+ farmers grow better crops", color: "bg-[#D9F99D]", iconColor: "text-[#044736]" },
              { icon: Users, title: "Great Team", desc: "Work with passionate agri-entrepreneurs", color: "bg-blue-100", iconColor: "text-blue-600" },
              { icon: Award, title: "Growth Opportunity", desc: "Fast-growing company with rapid expansion", color: "bg-orange-100", iconColor: "text-orange-600" }
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                    <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">{t.openPositions}</h2>
          
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : jobs.length === 0 ? (
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-12 text-center">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500">{t.noJobs}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link to={`/careers/${job.id}`} key={job.id} data-testid={`job-card-${job.id}`}>
                  <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#044736] transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {job.department && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" /> {job.department}
                              </span>
                            )}
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {job.location}
                              </span>
                            )}
                            {job.type && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {job.type}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {job.experience && (
                            <Badge variant="outline" className="text-xs">{job.experience}</Badge>
                          )}
                          <Button className="bg-[#044736] hover:bg-[#033326] text-white rounded-full px-6 group-hover:gap-3 transition-all">
                            {t.viewDetails} <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
