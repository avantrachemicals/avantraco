import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslatableField, TranslatableListField } from "@/components/admin/TranslatableField";
import {
  Lock, Plus, Pencil, Trash2, Package, Mail, Users, Settings, Briefcase,
  Image, FileText, Camera, Newspaper, Video, LayoutDashboard, Globe,
  Tag, BookOpen, Save, ChevronRight, Search
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CATEGORIES = ["biostimulant", "biofertilizer", "liquid_fertilizer", "micronutrient", "water_soluble"];

// ========== LOGIN ==========
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, { password });
      onLogin(res.data.token);
      toast.success("Logged in successfully");
    } catch { toast.error("Invalid password"); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4" data-testid="admin-login">
      <Card className="w-full max-w-sm border-0 shadow-2xl rounded-2xl bg-white">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-emerald-200" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Avantra CMS</h2>
            <p className="text-sm text-gray-500 mt-1">Content Management System</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><Label>Password</Label><Input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" data-testid="admin-password-input" /></div>
            <Button type="submit" disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full py-6" data-testid="admin-login-btn">{loading ? "..." : "Login"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ========== PAGE CONTENT EDITOR ==========
function PageContentEditor({ token }) {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [editData, setEditData] = useState({ content: {}, seo: {} });
  const [saving, setSaving] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/pages`).then(r => {
      setPages(r.data);
      if (r.data.length > 0) {
        setSelectedPage(r.data[0].page_key);
        setEditData({ content: r.data[0].content || {}, seo: r.data[0].seo || {} });
      }
    }).catch(() => {});
  }, []);

  const handlePageSelect = (pageKey) => {
    const page = pages.find(p => p.page_key === pageKey);
    setSelectedPage(pageKey);
    setEditData({ content: page?.content || {}, seo: page?.seo || {} });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/pages/${selectedPage}`, editData, { headers });
      toast.success(`Page "${selectedPage}" saved!`);
      const res = await axios.get(`${API}/pages`);
      setPages(res.data);
    } catch { toast.error("Failed to save page"); }
    setSaving(false);
  };

  const updateContent = (key, value) => {
    setEditData(prev => ({ ...prev, content: { ...prev.content, [key]: value } }));
  };

  const updateSeo = (key, value) => {
    setEditData(prev => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
  };

  const PAGE_LABELS = {
    home: "Home Page", about: "About Page", products: "Products Page",
    contact: "Contact Page", dealers: "Dealers Page", careers: "Careers Page",
    gallery: "Gallery Page", media: "Media Center"
  };

  const contentFields = editData.content ? Object.keys(editData.content) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        {pages.map(p => (
          <button
            key={p.page_key}
            onClick={() => handlePageSelect(p.page_key)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedPage === p.page_key
                ? "bg-emerald-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            data-testid={`page-tab-${p.page_key}`}
          >
            {PAGE_LABELS[p.page_key] || p.page_key}
          </button>
        ))}
      </div>

      {selectedPage && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Content Fields */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" /> Page Content
                </h3>
                <div className="space-y-4">
                  {contentFields.map(key => {
                    const value = editData.content[key];
                    const isTranslatable = typeof value === 'object' && value !== null && !Array.isArray(value);
                    const isArray = Array.isArray(value);
                    const isNestedArray = isArray && value.length > 0 && typeof value[0] === 'object';

                    if (isNestedArray) {
                      return (
                        <div key={key} className="p-3 bg-gray-50 rounded-lg">
                          <Label className="text-sm font-medium text-gray-500 mb-2 block">{key.replace(/_/g, ' ')}</Label>
                          <p className="text-xs text-gray-400">Complex field - edit individual items</p>
                          {value.map((item, idx) => (
                            <div key={idx} className="mt-2 p-2 bg-white rounded border">
                              {Object.keys(item).map(itemKey => (
                                <TranslatableField
                                  key={itemKey}
                                  label={`${key}[${idx}].${itemKey}`}
                                  value={item[itemKey]}
                                  onChange={(newVal) => {
                                    const newArray = [...value];
                                    newArray[idx] = { ...newArray[idx], [itemKey]: newVal };
                                    updateContent(key, newArray);
                                  }}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    }

                    if (isTranslatable) {
                      const isLong = (value.en || '').length > 100;
                      return (
                        <TranslatableField
                          key={key}
                          label={key.replace(/_/g, ' ')}
                          value={value}
                          onChange={(v) => updateContent(key, v)}
                          multiline={isLong}
                          rows={isLong ? 4 : 2}
                        />
                      );
                    }

                    if (typeof value === 'string') {
                      return (
                        <div key={key}>
                          <Label className="text-sm">{key.replace(/_/g, ' ')}</Label>
                          <Input
                            value={value}
                            onChange={(e) => updateContent(key, e.target.value)}
                            className="rounded-lg text-sm"
                          />
                        </div>
                      );
                    }

                    return null;
                  })}
                  {contentFields.length === 0 && (
                    <p className="text-gray-400 text-sm py-4">No content fields for this page yet. Content will be auto-created when the site is installed.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Panel */}
          <div className="space-y-4">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" /> SEO Settings
                </h3>
                <div className="space-y-4">
                  <TranslatableField label="SEO Title" value={editData.seo?.title || {}} onChange={(v) => updateSeo('title', v)} />
                  <TranslatableField label="SEO Description" value={editData.seo?.description || {}} onChange={(v) => updateSeo('description', v)} multiline rows={3} />
                  <TranslatableField label="Keywords" value={editData.seo?.keywords || {}} onChange={(v) => updateSeo('keywords', v)} />
                  <div>
                    <Label className="text-sm">OG Image URL</Label>
                    <Input value={editData.seo?.og_image || ""} onChange={(e) => updateSeo('og_image', e.target.value)} className="rounded-lg text-sm" placeholder="https://..." />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full" data-testid="save-page-btn">
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Page"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== LABELS EDITOR ==========
function LabelsEditor({ token }) {
  const [labels, setLabels] = useState([]);
  const [filter, setFilter] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [saving, setSaving] = useState({});
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/labels/all`).then(r => setLabels(r.data)).catch(() => {});
  }, []);

  const handleSave = async (label) => {
    setSaving(prev => ({ ...prev, [label.label_key]: true }));
    try {
      await axios.put(`${API}/labels/${label.label_key}`, { text: label.text, category: label.category }, { headers });
      toast.success(`Label "${label.label_key}" saved!`);
    } catch { toast.error("Failed to save label"); }
    setSaving(prev => ({ ...prev, [label.label_key]: false }));
  };

  const updateLabel = (index, text) => {
    const updated = [...labels];
    updated[index] = { ...updated[index], text };
    setLabels(updated);
  };

  const categories = [...new Set(labels.map(l => l.category))];
  const filteredLabels = labels.filter(l => {
    const matchesFilter = !filter || l.label_key.toLowerCase().includes(filter.toLowerCase()) || (l.text?.en || '').toLowerCase().includes(filter.toLowerCase());
    const matchesCat = catFilter === 'all' || l.category === catFilter;
    return matchesFilter && matchesCat;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Input
          placeholder="Search labels..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs rounded-xl"
          data-testid="labels-search"
        />
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setCatFilter('all')} className={`px-3 py-1 text-xs rounded-full ${catFilter === 'all' ? 'bg-emerald-700 text-white' : 'bg-gray-100'}`}>All</button>
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1 text-xs rounded-full capitalize ${catFilter === c ? 'bg-emerald-700 text-white' : 'bg-gray-100'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredLabels.map((label, idx) => {
          const realIdx = labels.findIndex(l => l.label_key === label.label_key);
          return (
            <Card key={label.label_key} className="border-0 shadow-sm rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600">{label.label_key}</code>
                      <Badge variant="outline" className="text-[10px] rounded-full capitalize">{label.category}</Badge>
                    </div>
                    <TranslatableField
                      value={label.text}
                      onChange={(text) => updateLabel(realIdx, text)}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSave(labels[realIdx])}
                    disabled={saving[label.label_key]}
                    className="bg-emerald-700 hover:bg-emerald-800 rounded-full mt-6 flex-shrink-0"
                    data-testid={`save-label-${label.label_key}`}
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ========== CATEGORIES EDITOR ==========
function CategoriesEditor({ token }) {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState({});
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/categories`).then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const updateCat = (idx, field, value) => {
    const updated = [...categories];
    updated[idx] = { ...updated[idx], [field]: value };
    setCategories(updated);
  };

  const handleSave = async (cat) => {
    setSaving(prev => ({ ...prev, [cat.category_key]: true }));
    try {
      await axios.put(`${API}/categories/${cat.category_key}`, { name: cat.name, description: cat.description, image_url: cat.image_url || "", order: cat.order || 0 }, { headers });
      toast.success(`Category "${cat.category_key}" saved!`);
    } catch { toast.error("Failed to save category"); }
    setSaving(prev => ({ ...prev, [cat.category_key]: false }));
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, idx) => (
        <Card key={cat.category_key} className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600">{cat.category_key}</code>
            <TranslatableField label="Name" value={cat.name} onChange={(v) => updateCat(idx, 'name', v)} />
            <TranslatableField label="Description" value={cat.description} onChange={(v) => updateCat(idx, 'description', v)} multiline rows={2} />
            <div><Label className="text-sm">Image URL</Label><Input value={cat.image_url || ""} onChange={(e) => updateCat(idx, 'image_url', e.target.value)} className="rounded-lg text-sm" /></div>
            <Button onClick={() => handleSave(cat)} disabled={saving[cat.category_key]} className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full" data-testid={`save-cat-${cat.category_key}`}>
              <Save className="mr-2 h-4 w-4" /> {saving[cat.category_key] ? "Saving..." : "Save"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ========== PRODUCT FORM ==========
function ProductForm({ product, token, onSave, onClose }) {
  const [form, setForm] = useState(product || {
    name: { en: "" }, slug: "", category: "biostimulant", image_url: "", featured: false,
    brand: { en: "AVANTRA" }, tagline: { en: "" }, overview: { en: "" }, dosage: { en: "" },
    composition: [], advantages: { en: [] }, how_it_works: { en: [] }, growth_stages: { en: [] },
    crops: { en: "" }, manual_url: "", leaflet_url: "",
    seo_title: { en: "" }, seo_description: { en: "" }, seo_keywords: { en: "" }, og_image: ""
  });
  const [compText, setCompText] = useState((product?.composition || []).map(c => `${typeof c.component === 'object' ? c.component.en : c.component}|${typeof c.specification === 'object' ? c.specification.en : c.specification}`).join("\n"));
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const nameEn = typeof form.name === 'object' ? form.name.en : form.name;
      const payload = {
        ...form,
        slug: form.slug || nameEn?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
        composition: compText.split("\n").filter(Boolean).map(line => {
          const [component, specification] = line.split("|");
          return { component: component?.trim() || "", specification: specification?.trim() || "" };
        }),
      };
      if (product?.id) await axios.put(`${API}/products/${product.id}`, payload, { headers });
      else await axios.post(`${API}/products`, payload, { headers });
      toast.success("Product saved!");
      onSave(); onClose();
    } catch { toast.error("Failed to save product"); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4" data-testid="product-form">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="downloads">Files</TabsTrigger>
        </TabsList>
        <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-1">
          <TabsContent value="basic" className="space-y-4 mt-0">
            <TranslatableField label="Product Name *" value={form.name} onChange={(v) => setForm({...form, name: v})} />
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="rounded-lg" placeholder="auto-generated" /></div>
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace("_"," ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <TranslatableField label="Brand" value={form.brand} onChange={(v) => setForm({...form, brand: v})} />
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-lg" /></div>
            <TranslatableField label="Tagline" value={form.tagline} onChange={(v) => setForm({...form, tagline: v})} />
            <TranslatableField label="Overview" value={form.overview} onChange={(v) => setForm({...form, overview: v})} multiline rows={3} />
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /><Label>Featured</Label></div>
          </TabsContent>
          <TabsContent value="details" className="space-y-4 mt-0">
            <TranslatableField label="Dosage" value={form.dosage} onChange={(v) => setForm({...form, dosage: v})} />
            <TranslatableField label="Crops" value={form.crops} onChange={(v) => setForm({...form, crops: v})} />
            <TranslatableListField label="Advantages (one per line)" value={form.advantages} onChange={(v) => setForm({...form, advantages: v})} />
            <TranslatableListField label="How It Works (one per line)" value={form.how_it_works} onChange={(v) => setForm({...form, how_it_works: v})} />
            <TranslatableListField label="Growth Stages (one per line)" value={form.growth_stages} onChange={(v) => setForm({...form, growth_stages: v})} />
            <div><Label>Composition (Component|Specification per line)</Label>
              <Textarea rows={5} value={compText} onChange={e => setCompText(e.target.value)} className="rounded-lg font-mono text-sm" placeholder="Seaweed Extract|8%&#10;Humic Acid|10%" />
            </div>
          </TabsContent>
          <TabsContent value="seo" className="space-y-4 mt-0">
            <TranslatableField label="SEO Title" value={form.seo_title} onChange={(v) => setForm({...form, seo_title: v})} />
            <TranslatableField label="SEO Description" value={form.seo_description} onChange={(v) => setForm({...form, seo_description: v})} multiline rows={3} />
            <TranslatableField label="SEO Keywords" value={form.seo_keywords} onChange={(v) => setForm({...form, seo_keywords: v})} />
            <div><Label>OG Image URL</Label><Input value={form.og_image || ""} onChange={e => setForm({...form, og_image: e.target.value})} className="rounded-lg" /></div>
          </TabsContent>
          <TabsContent value="downloads" className="space-y-4 mt-0">
            <div><Label>Product Manual URL</Label><Input value={form.manual_url || ""} onChange={e => setForm({...form, manual_url: e.target.value})} className="rounded-lg" /></div>
            <div><Label>Product Leaflet URL</Label><Input value={form.leaflet_url || ""} onChange={e => setForm({...form, leaflet_url: e.target.value})} className="rounded-lg" /></div>
          </TabsContent>
        </div>
      </Tabs>
      <Button type="submit" disabled={saving} className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full" data-testid="save-product-btn">{saving ? "Saving..." : "Save Product"}</Button>
    </form>
  );
}

// ========== GALLERY FORM ==========
function GalleryForm({ image, token, onSave, onClose }) {
  const [form, setForm] = useState(image || { title: { en: "" }, image_url: "", category: "general" });
  const [saving, setSaving] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (image?.id) await axios.put(`${API}/gallery/${image.id}`, form, { headers });
      else await axios.post(`${API}/gallery`, form, { headers });
      toast.success("Image saved!"); onSave(); onClose();
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };
  return (
    <form onSubmit={handleSave} className="space-y-4">
      <TranslatableField label="Title" value={form.title} onChange={(v) => setForm({...form, title: v})} />
      <div><Label>Image URL *</Label><Input required value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-lg" /></div>
      {form.image_url && <img src={form.image_url} alt="Preview" className="h-32 w-full object-cover rounded-lg" />}
      <div><Label>Category</Label>
        <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
          <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
          <SelectContent>{["general","factory","team","events","products"].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={saving} className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full">{saving ? "Saving..." : "Save"}</Button>
    </form>
  );
}

// ========== BLOG FORM ==========
function BlogForm({ post, token, onSave, onClose }) {
  const [form, setForm] = useState(post || {
    title: { en: "" }, slug: "", excerpt: { en: "" }, content: { en: "" },
    featured_image_url: "", seo_title: { en: "" }, seo_description: { en: "" }, seo_keywords: { en: "" }, og_image: ""
  });
  const [saving, setSaving] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const titleEn = typeof form.title === 'object' ? form.title.en : form.title;
      const payload = { ...form, slug: form.slug || titleEn?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") };
      if (post?.id) await axios.put(`${API}/blog/${post.id}`, payload, { headers });
      else await axios.post(`${API}/blog`, payload, { headers });
      toast.success("Post saved!"); onSave(); onClose();
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };
  return (
    <form onSubmit={handleSave} className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
      <TranslatableField label="Title *" value={form.title} onChange={(v) => setForm({...form, title: v})} />
      <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="rounded-lg" placeholder="auto-generated" /></div>
      <div><Label>Featured Image URL</Label><Input value={form.featured_image_url} onChange={e => setForm({...form, featured_image_url: e.target.value})} className="rounded-lg" /></div>
      <TranslatableField label="Excerpt" value={form.excerpt} onChange={(v) => setForm({...form, excerpt: v})} multiline rows={2} />
      <TranslatableField label="Content" value={form.content} onChange={(v) => setForm({...form, content: v})} multiline rows={8} />
      <TranslatableField label="SEO Title" value={form.seo_title} onChange={(v) => setForm({...form, seo_title: v})} />
      <TranslatableField label="SEO Description" value={form.seo_description} onChange={(v) => setForm({...form, seo_description: v})} multiline rows={2} />
      <Button type="submit" disabled={saving} className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full">{saving ? "Saving..." : "Save Post"}</Button>
    </form>
  );
}

// ========== JOB FORM ==========
function JobForm({ job, token, onSave, onClose }) {
  const [form, setForm] = useState(job || {
    title: { en: "" }, department: { en: "" }, location: { en: "" }, type: "Full-time",
    description: { en: "" }, requirements: { en: "" },
    seo_title: { en: "" }, seo_description: { en: "" }
  });
  const [saving, setSaving] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (job?.id) await axios.put(`${API}/jobs/${job.id}`, form, { headers });
      else await axios.post(`${API}/jobs`, form, { headers });
      toast.success("Job saved!"); onSave(); onClose();
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };
  return (
    <form onSubmit={handleSave} className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
      <TranslatableField label="Job Title *" value={form.title} onChange={(v) => setForm({...form, title: v})} />
      <div className="grid grid-cols-2 gap-4">
        <TranslatableField label="Department" value={form.department} onChange={(v) => setForm({...form, department: v})} />
        <TranslatableField label="Location" value={form.location} onChange={(v) => setForm({...form, location: v})} />
      </div>
      <div><Label>Type</Label>
        <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
          <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
          <SelectContent>{["Full-time","Part-time","Contract","Internship"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <TranslatableField label="Description" value={form.description} onChange={(v) => setForm({...form, description: v})} multiline rows={4} />
      <TranslatableField label="Requirements" value={form.requirements} onChange={(v) => setForm({...form, requirements: v})} multiline rows={4} />
      <Button type="submit" disabled={saving} className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full">{saving ? "Saving..." : "Save Job"}</Button>
    </form>
  );
}

// ========== VIDEO FORM ==========
function VideoForm({ video, token, onSave, onClose }) {
  const [form, setForm] = useState(video || {
    title: { en: "" }, video_url: "", thumbnail_url: "", author: "",
    location: { en: "" }, description: { en: "" }
  });
  const [saving, setSaving] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (video?.id) await axios.put(`${API}/videos/${video.id}`, form, { headers });
      else await axios.post(`${API}/videos`, form, { headers });
      toast.success("Video saved!"); onSave(); onClose();
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };
  return (
    <form onSubmit={handleSave} className="space-y-4">
      <TranslatableField label="Title *" value={form.title} onChange={(v) => setForm({...form, title: v})} />
      <div><Label>Author</Label><Input value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="rounded-lg" /></div>
      <TranslatableField label="Location" value={form.location} onChange={(v) => setForm({...form, location: v})} />
      <div><Label>Video URL *</Label><Input required value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="rounded-lg" /></div>
      <div><Label>Thumbnail URL</Label><Input value={form.thumbnail_url} onChange={e => setForm({...form, thumbnail_url: e.target.value})} className="rounded-lg" /></div>
      <TranslatableField label="Description" value={form.description} onChange={(v) => setForm({...form, description: v})} multiline rows={3} />
      <Button type="submit" disabled={saving} className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full">{saving ? "Saving..." : "Save"}</Button>
    </form>
  );
}

// ========== SETTINGS TAB ==========
function SettingsTab({ token }) {
  const [settings, setSettings] = useState({
    logo_url: "", favicon_url: "", site_name: {}, tagline: {}, address: {},
    phone: "", email: "", social_links: {}, default_seo_title: {},
    default_seo_description: {}, default_seo_keywords: {}, og_image: "", google_analytics: ""
  });
  const [saving, setSaving] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { axios.get(`${API}/settings`).then(r => setSettings(prev => ({...prev, ...r.data}))).catch(() => {}); }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await axios.put(`${API}/settings`, settings, { headers }); toast.success("Settings saved!"); }
    catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl"><CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><Image className="h-5 w-5 text-emerald-600" /> Branding</h3>
          <TranslatableField label="Site Name" value={settings.site_name} onChange={(v) => setSettings({...settings, site_name: v})} />
          <TranslatableField label="Tagline" value={settings.tagline} onChange={(v) => setSettings({...settings, tagline: v})} />
          <div><Label>Logo URL</Label><Input value={settings.logo_url} onChange={e => setSettings({...settings, logo_url: e.target.value})} className="rounded-lg" /></div>
          {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="h-12 object-contain bg-gray-50 rounded-lg p-2" />}
          <div><Label>Favicon URL</Label><Input value={settings.favicon_url || ""} onChange={e => setSettings({...settings, favicon_url: e.target.value})} className="rounded-lg" /></div>
        </CardContent></Card>

        <Card className="border-0 shadow-sm rounded-2xl"><CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><Mail className="h-5 w-5 text-emerald-600" /> Contact Info</h3>
          <TranslatableField label="Address" value={settings.address} onChange={(v) => setSettings({...settings, address: v})} multiline rows={2} />
          <div><Label>Phone</Label><Input value={settings.phone || ""} onChange={e => setSettings({...settings, phone: e.target.value})} className="rounded-lg" /></div>
          <div><Label>Email</Label><Input value={settings.email || ""} onChange={e => setSettings({...settings, email: e.target.value})} className="rounded-lg" /></div>
        </CardContent></Card>

        <Card className="border-0 shadow-sm rounded-2xl"><CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><Globe className="h-5 w-5 text-emerald-600" /> Social Links</h3>
          {["youtube","twitter","instagram","facebook","linkedin"].map(p => (
            <div key={p}><Label className="capitalize">{p}</Label><Input value={settings.social_links?.[p] || ""} onChange={e => setSettings({...settings, social_links: {...settings.social_links, [p]: e.target.value}})} className="rounded-lg" placeholder={`https://${p}.com/...`} /></div>
          ))}
        </CardContent></Card>

        <Card className="border-0 shadow-sm rounded-2xl"><CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><Search className="h-5 w-5 text-blue-600" /> Default SEO</h3>
          <TranslatableField label="Default SEO Title" value={settings.default_seo_title} onChange={(v) => setSettings({...settings, default_seo_title: v})} />
          <TranslatableField label="Default SEO Description" value={settings.default_seo_description} onChange={(v) => setSettings({...settings, default_seo_description: v})} multiline rows={2} />
          <TranslatableField label="Default Keywords" value={settings.default_seo_keywords} onChange={(v) => setSettings({...settings, default_seo_keywords: v})} />
          <div><Label>Default OG Image</Label><Input value={settings.og_image || ""} onChange={e => setSettings({...settings, og_image: e.target.value})} className="rounded-lg" /></div>
          <div><Label>Google Analytics ID</Label><Input value={settings.google_analytics || ""} onChange={e => setSettings({...settings, google_analytics: e.target.value})} className="rounded-lg" placeholder="G-XXXXXXXXXX" /></div>
        </CardContent></Card>
      </div>
      <Button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 rounded-full px-8" data-testid="save-settings-btn">
        <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}

// ========== CRUD TABLE HELPER ==========
function CrudTable({ headers: cols, data, renderRow, emptyText = "No items yet" }) {
  return (
    <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
      <Table>
        <TableHeader><TableRow>{cols.map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
        <TableBody>
          {data.map(renderRow)}
          {data.length === 0 && <TableRow><TableCell colSpan={cols.length} className="text-center text-gray-400 py-8">{emptyText}</TableCell></TableRow>}
        </TableBody>
      </Table>
    </Card>
  );
}

// ========== MAIN ADMIN PAGE ==========
export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("avantra-admin-token") || "");
  const [tab, setTab] = useState("pages");
  const [data, setData] = useState({ products: [], contacts: [], dealers: [], jobs: [], gallery: [], blog: [], videos: [] });
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [p, c, d, j, g, b, v] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/contact`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/dealers`).catch(() => ({ data: [] })),
        axios.get(`${API}/jobs`).catch(() => ({ data: [] })),
        axios.get(`${API}/gallery`).catch(() => ({ data: [] })),
        axios.get(`${API}/blog`).catch(() => ({ data: [] })),
        axios.get(`${API}/videos`).catch(() => ({ data: [] })),
      ]);
      setData({ products: p.data, contacts: c.data, dealers: d.data, jobs: j.data, gallery: g.data, blog: b.data, videos: v.data });
    } catch { setToken(""); localStorage.removeItem("avantra-admin-token"); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogin = (t) => { setToken(t); localStorage.setItem("avantra-admin-token", t); };
  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this item?")) return;
    try { await axios.delete(`${API}/${type}/${id}`, { headers }); toast.success("Deleted"); fetchData(); }
    catch { toast.error("Failed to delete"); }
  };

  const getTextEn = (val) => typeof val === 'object' && val !== null ? (val.en || Object.values(val)[0] || '') : (val || '');

  if (!token) return <AdminLogin onLogin={handleLogin} />;

  const NAV_ITEMS = [
    { key: "pages", icon: BookOpen, label: "Pages" },
    { key: "products", icon: Package, label: "Products" },
    { key: "categories", icon: Tag, label: "Categories" },
    { key: "labels", icon: Globe, label: "Translations" },
    { key: "gallery", icon: Camera, label: "Gallery" },
    { key: "blog", icon: Newspaper, label: "Blog" },
    { key: "videos", icon: Video, label: "Videos" },
    { key: "jobs", icon: Briefcase, label: "Jobs" },
    { key: "contacts", icon: Mail, label: "Contacts" },
    { key: "dealers", icon: Users, label: "Dealers" },
    { key: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Avantra CMS</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setToken(""); localStorage.removeItem("avantra-admin-token"); }} className="rounded-full" data-testid="admin-logout-btn">Logout</Button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2 flex-wrap">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                tab === item.key ? "bg-emerald-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
              data-testid={`admin-tab-${item.key}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Pages Tab */}
        {tab === "pages" && <PageContentEditor token={token} />}

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "products"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <Button className="bg-emerald-700 hover:bg-emerald-800 rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }} data-testid="add-product-btn"><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
                <DialogContent className="max-w-2xl rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader><ProductForm product={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <CrudTable
              headers={["Name", "Category", "Featured", "Actions"]}
              data={data.products}
              renderRow={(p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{getTextEn(p.name)}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs rounded-full">{p.category?.replace("_"," ")}</Badge></TableCell>
                  <TableCell>{p.featured ? <Badge className="bg-amber-500 text-white text-xs rounded-full">Featured</Badge> : "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditItem(p); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete("products", p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </TableCell>
                </TableRow>
              )}
              emptyText="No products. Add your first product!"
            />
          </div>
        )}

        {/* Categories Tab */}
        {tab === "categories" && <CategoriesEditor token={token} />}

        {/* Labels Tab */}
        {tab === "labels" && <LabelsEditor token={token} />}

        {/* Gallery Tab */}
        {tab === "gallery" && (
          <div>
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "gallery"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <Button className="bg-emerald-700 hover:bg-emerald-800 rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Image</Button>
                <DialogContent className="max-w-lg rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Image" : "Add Image"}</DialogTitle></DialogHeader><GalleryForm image={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {data.gallery.map(img => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                  <img src={img.image_url} alt={getTextEn(img.title)} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => { setEditItem(img); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete("gallery", img.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
              {data.gallery.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No images yet</div>}
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {tab === "blog" && (
          <div>
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "blog"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <Button className="bg-emerald-700 hover:bg-emerald-800 rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Post</Button>
                <DialogContent className="max-w-2xl rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Post" : "Add Post"}</DialogTitle></DialogHeader><BlogForm post={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <CrudTable
              headers={["Title", "Date", "Actions"]}
              data={data.blog}
              renderRow={(p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{getTextEn(p.title)}</TableCell>
                  <TableCell className="text-xs text-gray-500">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditItem(p); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete("blog", p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </TableCell>
                </TableRow>
              )}
            />
          </div>
        )}

        {/* Videos Tab */}
        {tab === "videos" && (
          <div>
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "videos"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <Button className="bg-emerald-700 hover:bg-emerald-800 rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Video</Button>
                <DialogContent className="max-w-lg rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Video" : "Add Video"}</DialogTitle></DialogHeader><VideoForm video={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <CrudTable
              headers={["Title", "Author", "Actions"]}
              data={data.videos}
              renderRow={(v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{getTextEn(v.title)}</TableCell>
                  <TableCell>{v.author || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditItem(v); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete("videos", v.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </TableCell>
                </TableRow>
              )}
            />
          </div>
        )}

        {/* Jobs Tab */}
        {tab === "jobs" && (
          <div>
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "jobs"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <Button className="bg-emerald-700 hover:bg-emerald-800 rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Job</Button>
                <DialogContent className="max-w-lg rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Job" : "Add Job"}</DialogTitle></DialogHeader><JobForm job={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <CrudTable
              headers={["Title", "Department", "Type", "Actions"]}
              data={data.jobs}
              renderRow={(j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{getTextEn(j.title)}</TableCell>
                  <TableCell>{getTextEn(j.department) || "-"}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs rounded-full">{j.type}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setEditItem(j); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete("jobs", j.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </TableCell>
                </TableRow>
              )}
            />
          </div>
        )}

        {/* Contacts Tab */}
        {tab === "contacts" && (
          <CrudTable
            headers={["Name", "Email", "Phone", "Message", "Date"]}
            data={data.contacts}
            renderRow={(c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell className="max-w-xs truncate">{c.message}</TableCell>
                <TableCell className="text-xs text-gray-500">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            )}
            emptyText="No contact submissions yet"
          />
        )}

        {/* Dealers Tab */}
        {tab === "dealers" && (
          <CrudTable
            headers={["Name", "Business", "Location", "Phone", "Date"]}
            data={data.dealers}
            renderRow={(d) => (
              <TableRow key={d.id || d.name}>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell>{d.business_name}</TableCell>
                <TableCell>{d.location}</TableCell>
                <TableCell>{d.phone}</TableCell>
                <TableCell className="text-xs text-gray-500">{d.created_at ? new Date(d.created_at).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            )}
            emptyText="No dealer applications yet"
          />
        )}

        {/* Settings Tab */}
        {tab === "settings" && <SettingsTab token={token} />}
      </div>
    </div>
  );
}
