import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, ArrowRight, ExternalLink } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function MediaCenterPage() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/blog`)
      .then(r => { setPosts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div data-testid="media-center-page" className="min-h-screen bg-white">
      {/* Hero - Dark Premium Style */}
      <section className="product-hero-bg min-h-[40vh] relative flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d2a] via-[#0d3d2a]/90 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <Badge className="bg-white/10 text-white border-white/30 mb-4">News & Updates</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Media Center</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Stay updated with the latest news, articles, and announcements from Avantra Chemicals.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : posts.length === 0 ? (
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-12 text-center">
                <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500">No posts yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link to={`/media/${post.slug}`} key={post.id} data-testid={`blog-post-${post.slug}`}>
                  <Card className="border-0 shadow-sm rounded-2xl overflow-hidden h-full group hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 bg-gray-100">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#044736] to-[#066d52]">
                          <Newspaper className="h-16 w-16 text-[#D9F99D]" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.created_at)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#044736] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                      )}
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                      <span className="text-sm text-[#044736] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="h-4 w-4" />
                      </span>
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
