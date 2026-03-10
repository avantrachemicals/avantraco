import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, X, Filter } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = ["all", "factory", "team", "events", "products", "general"];

export default function GalleryPage() {
  const { language } = useLanguage();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios.get(`${API}/gallery${category !== "all" ? `?category=${category}` : ""}`)
      .then(r => { setImages(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div data-testid="gallery-page" className="min-h-screen bg-white">
      {/* Hero - Dark Premium Style */}
      <section className="product-hero-bg min-h-[40vh] relative flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d2a] via-[#0d3d2a]/90 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <Badge className="bg-white/10 text-white border-white/30 mb-4">Our Journey</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Gallery</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Explore our facilities, team, and the impact we make in Indian agriculture.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Filter className="h-5 w-5 text-gray-400 shrink-0" />
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className={`rounded-full capitalize ${category === cat ? "bg-[#044736]" : ""}`}
                data-testid={`gallery-filter-${cat}`}
              >
                {cat === "all" ? "All" : cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : images.length === 0 ? (
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-12 text-center">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500">No images in gallery yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                  data-testid={`gallery-image-${img.id}`}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={img.image_url}
                      alt={img.title || "Gallery image"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {img.is_featured && (
                      <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs">Featured</Badge>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {img.title && <h3 className="font-semibold text-lg">{img.title}</h3>}
                      <Badge variant="outline" className="text-white border-white/50 text-xs mt-1 capitalize">
                        {img.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0 rounded-2xl overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-10 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || "Gallery image"}
                className="w-full max-h-[80vh] object-contain"
              />
              {(selectedImage.title || selectedImage.description) && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  {selectedImage.title && <h3 className="text-xl font-bold mb-1">{selectedImage.title}</h3>}
                  {selectedImage.description && <p className="text-gray-300">{selectedImage.description}</p>}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
