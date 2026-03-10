import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ExternalLink, Share2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/blog/${slug}`)
      .then(r => { setPost(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Post not found</p>
        <Button asChild variant="outline">
          <Link to="/media"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Media Center</Link>
        </Button>
      </div>
    );
  }

  return (
    <div data-testid="blog-post-page" className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative">
        {post.featured_image ? (
          <div className="relative h-64 md:h-96">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-[#044736] to-[#066d52]" />
        )}
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="mb-6" data-testid="back-to-media">
            <Link to="/media"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Media Center</Link>
          </Button>

          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden -mt-20 relative">
            <CardContent className="p-8 md:p-12">
              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {formatDate(post.created_at)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" data-testid="post-title">
                {post.title}
              </h1>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag, i) => (
                    <Badge key={i} className="bg-[#D9F99D] text-[#044736]">{tag}</Badge>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8" data-testid="post-content">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {post.content}
                </div>
              </div>

              {/* Links */}
              {post.links?.length > 0 && (
                <div className="border-t pt-8 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Links</h3>
                  <div className="space-y-3">
                    {post.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#044736] hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {link.title || link.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="border-t pt-8 mt-8 flex items-center justify-between">
                <Button variant="outline" className="rounded-full gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button asChild className="bg-[#044736] hover:bg-[#033326] rounded-full">
                  <Link to="/media">View More Posts</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
