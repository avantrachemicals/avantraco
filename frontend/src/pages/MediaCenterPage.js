import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function MediaCenterPage() {
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
    <div data-testid="media-center-page">
      {/* Hero Section - Inera Style */}
      <section className="products-hero">
        <div className="products-hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80" 
            alt=""
          />
        </div>
        <div className="products-hero-content">
          <h1 className="products-hero-title">Media Center</h1>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-white">
        <div className="max-w-7xl mx-auto">
          <div className="section-title-small">News & Updates</div>
          <h2 className="section-title-large mb-12">
            Latest From Avantra
          </h2>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link 
                  to={`/media/${post.id}`} 
                  key={post.id}
                  className="group"
                  data-testid={`blog-post-${post.id}`}
                >
                  <div className="aspect-video overflow-hidden mb-4">
                    {post.featured_image_url ? (
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.created_at)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-black group-hover:text-green-600 transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
