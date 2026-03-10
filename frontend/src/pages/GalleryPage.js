import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    axios.get(`${API}/gallery`)
      .then(r => { setItems(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div data-testid="gallery-page">
      {/* Hero Section - Inera Style */}
      <section className="products-hero">
        <div className="products-hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80" 
            alt=""
          />
        </div>
        <div className="products-hero-content">
          <h1 className="products-hero-title">Gallery</h1>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-white">
        <div className="max-w-7xl mx-auto">
          <div className="section-title-small">Our Journey</div>
          <h2 className="section-title-large mb-12">
            Explore Our Facilities & Impact
          </h2>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No gallery images available yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
              {items.map((item, index) => (
                <div 
                  key={item.id || index}
                  className="aspect-square relative overflow-hidden cursor-pointer group"
                  onClick={() => setLightbox(item)}
                  data-testid={`gallery-item-${index}`}
                >
                  <img 
                    src={item.image_url} 
                    alt={item.title || "Gallery image"} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    {item.title && (
                      <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="font-semibold">{item.title}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={lightbox.image_url} 
            alt={lightbox.title || "Gallery image"} 
            className="max-w-full max-h-[85vh] object-contain"
            onClick={e => e.stopPropagation()}
          />
          {lightbox.title && (
            <div className="absolute bottom-6 left-0 right-0 text-center text-white">
              <p className="text-lg font-semibold">{lightbox.title}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
