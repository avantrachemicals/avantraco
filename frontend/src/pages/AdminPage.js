import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Plus, Pencil, Trash2, Package, Mail, Users, Database, Settings, Briefcase, Image, Eye, FileText, Download, Camera, Newspaper, Video } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CATEGORIES = ["biostimulant", "biofertilizer", "liquid_fertilizer", "micronutrient", "water_soluble"];
const GALLERY_CATS = ["general", "factory", "team", "events", "products"];

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" data-testid="admin-login">
      <Card className="w-full max-w-sm border-0 shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-[#044736] flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-[#D9F99D]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><Label>Password</Label><Input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" data-testid="admin-password-input" /></div>
            <Button type="submit" disabled={loading} className="w-full bg-[#044736] hover:bg-[#033326] rounded-full py-6" data-testid="admin-login-btn">{loading ? "..." : "Login"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Enhanced Product Form with all fields
function ProductForm({ product, token, onSave, onClose }) {
  const [form, setForm] = useState(product || {
    name: "", slug: "", category: "biostimulant", image_url: "", featured: false,
    tagline: { en: "", te: "", kn: "", hi: "" },
    overview: { en: "", te: "", kn: "", hi: "" },
    dosage: { en: "", te: "", kn: "", hi: "" },
    composition: [],
    advantages: { en: [], te: [], kn: [], hi: [] },
    how_it_works: { en: [], te: [], kn: [], hi: [] },
    growth_stages: { en: [], te: [], kn: [], hi: [] }
  });
  const [compText, setCompText] = useState((product?.composition || []).map(c => `${c.component}|${c.specification}`).join("\n"));
  const [advText, setAdvText] = useState((product?.advantages?.en || []).join("\n"));
  const [hiwText, setHiwText] = useState((product?.how_it_works?.en || []).join("\n"));
  const [gsText, setGsText] = useState((product?.growth_stages?.en || []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        composition: compText.split("\n").filter(Boolean).map(line => {
          const [component, specification] = line.split("|");
          return { component: component?.trim() || "", specification: specification?.trim() || "" };
        }),
        advantages: { ...form.advantages, en: advText.split("\n").filter(Boolean) },
        how_it_works: { ...form.how_it_works, en: hiwText.split("\n").filter(Boolean) },
        growth_stages: { ...form.growth_stages, en: gsText.split("\n").filter(Boolean) }
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
          <TabsTrigger value="composition">Composition</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="advantages">Advantages</TabsTrigger>
        </TabsList>

        <div className="max-h-[50vh] overflow-y-auto pr-2">
          <TabsContent value="basic" className="space-y-4 mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="rounded-xl" /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="rounded-xl" placeholder="auto-generated" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace("_"," ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-xl" /></div>
            </div>
            <div><Label>Tagline (English)</Label><Input value={form.tagline?.en || ""} onChange={e => setForm({...form, tagline: {...form.tagline, en: e.target.value}})} className="rounded-xl" /></div>
            <div><Label>Overview (English)</Label><Textarea rows={3} value={form.overview?.en || ""} onChange={e => setForm({...form, overview: {...form.overview, en: e.target.value}})} className="rounded-xl" /></div>
            <div><Label>Dosage (English)</Label><Input value={form.dosage?.en || ""} onChange={e => setForm({...form, dosage: {...form.dosage, en: e.target.value}})} className="rounded-xl" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="rounded" /><Label>Featured Product</Label></div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-4 mt-0">
            <div>
              <Label>Composition (one per line: Component|Specification)</Label>
              <Textarea rows={8} value={compText} onChange={e => setCompText(e.target.value)} className="rounded-xl font-mono text-sm" placeholder="Seaweed Extract|8%&#10;Humic Acid|10%&#10;Potassium|2%" />
              <p className="text-xs text-gray-500 mt-1">Format: Component Name | Specification (e.g., "Seaweed Extract|8%")</p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-0">
            <div>
              <Label>How It Works (one point per line)</Label>
              <Textarea rows={5} value={hiwText} onChange={e => setHiwText(e.target.value)} className="rounded-xl" placeholder="Enhances root development&#10;Improves nutrient uptake&#10;Boosts stress resistance" />
            </div>
            <div>
              <Label>Targeted Growth Stages (one per line)</Label>
              <Textarea rows={4} value={gsText} onChange={e => setGsText(e.target.value)} className="rounded-xl" placeholder="Vegetative Stage&#10;Flowering Stage&#10;Fruiting Stage" />
            </div>
          </TabsContent>

          <TabsContent value="advantages" className="space-y-4 mt-0">
            <div>
              <Label>Key Advantages (one per line)</Label>
              <Textarea rows={8} value={advText} onChange={e => setAdvText(e.target.value)} className="rounded-xl" placeholder="Increases yield by 20-30%&#10;Improves fruit quality&#10;Enhances shelf life&#10;Eco-friendly formulation" />
            </div>
          </TabsContent>
        </div>
      </Tabs>
      <Button type="submit" disabled={saving} className="w-full bg-[#044736] hover:bg-[#033326] rounded-full">{saving ? "Saving..." : "Save Product"}</Button>
    </form>
  );
}

// Gallery Form
function GalleryForm({ image, token, onSave, onClose }) {
  const [form, setForm] = useState(image || { title: "", description: "", image_url: "", category: "general", is_featured: false });
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
      <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl" /></div>
      <div><Label>Image URL *</Label><Input required value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-xl" /></div>
      {form.image_url && <img src={form.image_url} alt="Preview" className="h-32 w-full object-cover rounded-xl" />}
      <div>
        <Label>Category</Label>
        <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>{GALLERY_CATS.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="rounded-xl" /></div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} /><Label>Featured</Label></div>
      <Button type="submit" disabled={saving} className="w-full bg-[#044736] hover:bg-[#033326] rounded-full">{saving ? "Saving..." : "Save Image"}</Button>
    </form>
  );
}

// Blog Post Form
function BlogForm({ post, token, onSave, onClose }) {
  const [form, setForm] = useState(post || { title: "", slug: "", featured_image: "", excerpt: "", content: "", links: [], is_published: true, tags: [] });
  const [linksText, setLinksText] = useState((post?.links || []).map(l => `${l.title}|${l.url}`).join("\n"));
  const [tagsText, setTagsText] = useState((post?.tags || []).join(", "));
  const [saving, setSaving] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        ...form,
        links: linksText.split("\n").filter(Boolean).map(line => { const [title, url] = line.split("|"); return { title: title?.trim() || "", url: url?.trim() || "" }; }),
        tags: tagsText.split(",").map(t => t.trim()).filter(Boolean)
      };
      if (post?.id) await axios.put(`${API}/blog/${post.id}`, payload, { headers });
      else await axios.post(`${API}/blog`, payload, { headers });
      toast.success("Post saved!"); onSave(); onClose();
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };
  return (
    <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div><Label>Title *</Label><Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl" /></div>
      <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="rounded-xl" placeholder="auto-generated" /></div>
      <div><Label>Featured Image URL</Label><Input value={form.featured_image} onChange={e => setForm({...form, featured_image: e.target.value})} className="rounded-xl" /></div>
      {form.featured_image && <img src={form.featured_image} alt="Preview" className="h-32 w-full object-cover rounded-xl" />}
      <div><Label>Excerpt</Label><Textarea rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="rounded-xl" /></div>
      <div><Label>Content</Label><Textarea rows={8} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="rounded-xl" /></div>
      <div><Label>Links (one per line: Title|URL)</Label><Textarea rows={3} value={linksText} onChange={e => setLinksText(e.target.value)} className="rounded-xl" placeholder="Read More|https://example.com" /></div>
      <div><Label>Tags (comma-separated)</Label><Input value={tagsText} onChange={e => setTagsText(e.target.value)} className="rounded-xl" placeholder="agriculture, technology, farmers" /></div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} /><Label>Published</Label></div>
      <Button type="submit" disabled={saving} className="w-full bg-[#044736] hover:bg-[#033326] rounded-full">{saving ? "Saving..." : "Save Post"}</Button>
    </form>
  );
}

// Video Testimonial Form
function VideoForm({ video, token, onSave, onClose }) {
  const [form, setForm] = useState(video || { title: "", farmer_name: "", location: "", crop: "", video_url: "", thumbnail_url: "", quote: "", is_featured: false });
  const [saving, setSaving] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (video?.id) await axios.put(`${API}/testimonials/videos/${video.id}`, form, { headers });
      else await axios.post(`${API}/testimonials/videos`, form, { headers });
      toast.success("Video saved!"); onSave(); onClose();
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };
  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div><Label>Title *</Label><Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Farmer Name *</Label><Input required value={form.farmer_name} onChange={e => setForm({...form, farmer_name: e.target.value})} className="rounded-xl" /></div>
        <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="rounded-xl" /></div>
      </div>
      <div><Label>Crop</Label><Input value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} className="rounded-xl" placeholder="e.g. Mango, Rice" /></div>
      <div><Label>Video URL * (YouTube/Vimeo/Direct link)</Label><Input required value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="rounded-xl" placeholder="https://youtube.com/watch?v=..." /></div>
      <div><Label>Thumbnail URL</Label><Input value={form.thumbnail_url} onChange={e => setForm({...form, thumbnail_url: e.target.value})} className="rounded-xl" /></div>
      {form.thumbnail_url && <img src={form.thumbnail_url} alt="Thumbnail" className="h-24 w-full object-cover rounded-xl" />}
      <div><Label>Quote</Label><Textarea rows={2} value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} className="rounded-xl" placeholder="What the farmer says about the product..." /></div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} /><Label>Featured (shows on homepage)</Label></div>
      <Button type="submit" disabled={saving} className="w-full bg-[#044736] hover:bg-[#033326] rounded-full">{saving ? "Saving..." : "Save Video"}</Button>
    </form>
  );
}

// Job Form
function JobForm({ job, token, onSave, onClose }) {
  const [form, setForm] = useState(job || { title: "", department: "", location: "", type: "Full-time", experience: "", description: "", requirements: [], responsibilities: [], salary_range: "", is_active: true });
  const [reqText, setReqText] = useState((job?.requirements || []).join("\n"));
  const [respText, setRespText] = useState((job?.responsibilities || []).join("\n"));
  const [saving, setSaving] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { ...form, requirements: reqText.split("\n").filter(Boolean), responsibilities: respText.split("\n").filter(Boolean) };
      if (job?.id) await axios.put(`${API}/jobs/${job.id}`, payload, { headers });
      else await axios.post(`${API}/jobs`, payload, { headers });
      toast.success("Job saved!"); onSave(); onClose();
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };
  return (
    <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div><Label>Job Title *</Label><Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Department</Label><Input value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="rounded-xl" /></div>
        <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="rounded-xl" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Type</Label><Select value={form.type} onValueChange={v => setForm({...form, type: v})}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{["Full-time","Part-time","Contract","Internship"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Experience</Label><Input value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="rounded-xl" placeholder="2-5 years" /></div>
      </div>
      <div><Label>Salary Range</Label><Input value={form.salary_range} onChange={e => setForm({...form, salary_range: e.target.value})} className="rounded-xl" placeholder="4-6 LPA" /></div>
      <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="rounded-xl" /></div>
      <div><Label>Requirements (one per line)</Label><Textarea rows={3} value={reqText} onChange={e => setReqText(e.target.value)} className="rounded-xl" /></div>
      <div><Label>Responsibilities (one per line)</Label><Textarea rows={3} value={respText} onChange={e => setRespText(e.target.value)} className="rounded-xl" /></div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /><Label>Active</Label></div>
      <Button type="submit" disabled={saving} className="w-full bg-[#044736] hover:bg-[#033326] rounded-full">{saving ? "Saving..." : "Save Job"}</Button>
    </form>
  );
}

// Settings Tab
function SettingsTab({ token }) {
  const [settings, setSettings] = useState({ hero_image: "", logo_url: "", about_image: "", phytocode_image: "", social_links: { youtube: "", twitter: "", instagram: "", facebook: "", linkedin: "" } });
  const [saving, setSaving] = useState(false);
  useEffect(() => { axios.get(`${API}/settings`).then(r => setSettings({...settings, ...r.data})).catch(() => {}); }, []);
  const handleSave = async () => {
    setSaving(true);
    try { await axios.put(`${API}/settings`, settings, { headers: { Authorization: `Bearer ${token}` } }); toast.success("Settings saved!"); }
    catch { toast.error("Failed to save"); }
    setSaving(false);
  };
  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-sm rounded-2xl"><CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Image className="h-5 w-5" /> Site Images</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Logo URL</Label><Input value={settings.logo_url} onChange={e => setSettings({...settings, logo_url: e.target.value})} className="rounded-xl" />{settings.logo_url && <img src={settings.logo_url} alt="Logo" className="mt-2 h-12 object-contain bg-gray-100 rounded-lg p-2" />}</div>
          <div><Label>Hero Image URL</Label><Input value={settings.hero_image} onChange={e => setSettings({...settings, hero_image: e.target.value})} className="rounded-xl" />{settings.hero_image && <img src={settings.hero_image} alt="Hero" className="mt-2 h-20 w-full object-cover rounded-lg" />}</div>
          <div><Label>About Section Image</Label><Input value={settings.about_image} onChange={e => setSettings({...settings, about_image: e.target.value})} className="rounded-xl" />{settings.about_image && <img src={settings.about_image} alt="About" className="mt-2 h-20 w-full object-cover rounded-lg" />}</div>
          <div><Label>Phytocode Section Image</Label><Input value={settings.phytocode_image} onChange={e => setSettings({...settings, phytocode_image: e.target.value})} className="rounded-xl" />{settings.phytocode_image && <img src={settings.phytocode_image} alt="Phytocode" className="mt-2 h-20 w-full object-cover rounded-lg" />}</div>
        </div>
      </CardContent></Card>
      <Card className="border-0 shadow-sm rounded-2xl"><CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media Links</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {["youtube","twitter","instagram","facebook","linkedin"].map(p => (
            <div key={p}><Label className="capitalize">{p}</Label><Input value={settings.social_links?.[p] || ""} onChange={e => setSettings({...settings, social_links: {...settings.social_links, [p]: e.target.value}})} className="rounded-xl" placeholder={`https://${p}.com/...`} /></div>
          ))}
        </div>
      </CardContent></Card>
      <Button onClick={handleSave} disabled={saving} className="bg-[#044736] hover:bg-[#033326] rounded-full px-8">{saving ? "Saving..." : "Save Settings"}</Button>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("avantra-admin-token") || "");
  const [tab, setTab] = useState("products");
  const [data, setData] = useState({ products: [], contacts: [], dealers: [], jobs: [], jobApps: [], gallery: [], blog: [], videos: [] });
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewApp, setViewApp] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [p, c, d, j, ja, g, b, v] = await Promise.all([
        axios.get(`${API}/products`), axios.get(`${API}/contact`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/dealers/applications`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/jobs?active_only=false`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/jobs/applications/list`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/gallery`).catch(() => ({ data: [] })),
        axios.get(`${API}/blog?published_only=false`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/testimonials/videos`).catch(() => ({ data: [] }))
      ]);
      setData({ products: p.data, contacts: c.data, dealers: d.data, jobs: j.data, jobApps: ja.data, gallery: g.data, blog: b.data, videos: v.data });
    } catch { setToken(""); localStorage.removeItem("avantra-admin-token"); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogin = (t) => { setToken(t); localStorage.setItem("avantra-admin-token", t); };
  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API}/${type}/${id}`, { headers });
      toast.success("Deleted"); fetchData();
    } catch { toast.error("Failed to delete"); }
  };
  const handleSeed = async () => { try { const res = await axios.post(`${API}/seed`); toast.success(res.data.message); fetchData(); } catch { toast.error("Seed failed"); } };

  if (!token) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSeed} className="rounded-full"><Database className="mr-2 h-4 w-4" /> Seed</Button>
            <Button variant="ghost" size="sm" onClick={() => { setToken(""); localStorage.removeItem("avantra-admin-token"); }} className="rounded-full">Logout</Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 bg-white p-1 rounded-full shadow-sm flex-wrap h-auto gap-1">
            <TabsTrigger value="products" className="rounded-full"><Package className="mr-1 h-4 w-4" /> Products</TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-full"><Camera className="mr-1 h-4 w-4" /> Gallery</TabsTrigger>
            <TabsTrigger value="blog" className="rounded-full"><Newspaper className="mr-1 h-4 w-4" /> Blog</TabsTrigger>
            <TabsTrigger value="videos" className="rounded-full"><Video className="mr-1 h-4 w-4" /> Videos</TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-full"><Briefcase className="mr-1 h-4 w-4" /> Jobs</TabsTrigger>
            <TabsTrigger value="applications" className="rounded-full"><FileText className="mr-1 h-4 w-4" /> Applications</TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-full"><Mail className="mr-1 h-4 w-4" /> Contacts</TabsTrigger>
            <TabsTrigger value="dealers" className="rounded-full"><Users className="mr-1 h-4 w-4" /> Dealers</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-full"><Settings className="mr-1 h-4 w-4" /> Settings</TabsTrigger>
          </TabsList>

          {/* Products */}
          <TabsContent value="products">
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "products"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <DialogTrigger asChild><Button className="bg-[#044736] hover:bg-[#033326] rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Product</Button></DialogTrigger>
                <DialogContent className="max-w-2xl rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader><ProductForm product={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Featured</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{data.products.map(p => (<TableRow key={p.id}><TableCell className="font-medium">{p.name}</TableCell><TableCell><Badge variant="outline" className="text-xs rounded-full">{p.category}</Badge></TableCell><TableCell>{p.featured ? <Badge className="bg-orange-500 text-white text-xs rounded-full">Yes</Badge> : "-"}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => { setEditItem(p); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete("products", p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell></TableRow>))}</TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Gallery */}
          <TabsContent value="gallery">
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "gallery"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <DialogTrigger asChild><Button className="bg-[#044736] hover:bg-[#033326] rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Image</Button></DialogTrigger>
                <DialogContent className="max-w-lg rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Image" : "Add Image"}</DialogTitle></DialogHeader><GalleryForm image={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {data.gallery.map(img => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                  <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => { setEditItem(img); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete("gallery", img.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  {img.is_featured && <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">Featured</Badge>}
                </div>
              ))}
              {data.gallery.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No images yet</div>}
            </div>
          </TabsContent>

          {/* Blog */}
          <TabsContent value="blog">
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "blog"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <DialogTrigger asChild><Button className="bg-[#044736] hover:bg-[#033326] rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Post</Button></DialogTrigger>
                <DialogContent className="max-w-2xl rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Post" : "Add Post"}</DialogTitle></DialogHeader><BlogForm post={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{data.blog.map(p => (<TableRow key={p.id}><TableCell className="font-medium">{p.title}</TableCell><TableCell>{p.is_published ? <Badge className="bg-green-500 text-white text-xs rounded-full">Published</Badge> : <Badge variant="outline" className="text-xs rounded-full">Draft</Badge>}</TableCell><TableCell className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString()}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => { setEditItem(p); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete("blog", p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell></TableRow>))}{data.blog.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-gray-400 py-8">No posts yet</TableCell></TableRow>}</TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Video Testimonials */}
          <TabsContent value="videos">
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "videos"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <DialogTrigger asChild><Button className="bg-[#044736] hover:bg-[#033326] rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Video</Button></DialogTrigger>
                <DialogContent className="max-w-lg rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Video" : "Add Video Testimonial"}</DialogTitle></DialogHeader><VideoForm video={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Farmer</TableHead><TableHead>Crop</TableHead><TableHead>Featured</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{data.videos.map(v => (<TableRow key={v.id}><TableCell className="font-medium">{v.title}</TableCell><TableCell>{v.farmer_name}</TableCell><TableCell>{v.crop || "-"}</TableCell><TableCell>{v.is_featured ? <Badge className="bg-orange-500 text-white text-xs rounded-full">Yes</Badge> : "-"}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => { setEditItem(v); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete("testimonials/videos", v.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell></TableRow>))}{data.videos.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-gray-400 py-8">No videos yet</TableCell></TableRow>}</TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Jobs */}
          <TabsContent value="jobs">
            <div className="flex justify-end mb-4">
              <Dialog open={showForm && tab === "jobs"} onOpenChange={v => { setShowForm(v); if (!v) setEditItem(null); }}>
                <DialogTrigger asChild><Button className="bg-[#044736] hover:bg-[#033326] rounded-full" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Job</Button></DialogTrigger>
                <DialogContent className="max-w-lg rounded-2xl"><DialogHeader><DialogTitle>{editItem ? "Edit Job" : "Add Job"}</DialogTitle></DialogHeader><JobForm job={editItem} token={token} onSave={fetchData} onClose={() => setShowForm(false)} /></DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{data.jobs.map(j => (<TableRow key={j.id}><TableCell className="font-medium">{j.title}</TableCell><TableCell>{j.department || "-"}</TableCell><TableCell>{j.is_active ? <Badge className="bg-green-500 text-white text-xs rounded-full">Active</Badge> : <Badge variant="outline" className="text-xs rounded-full">Inactive</Badge>}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => { setEditItem(j); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete("jobs", j.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell></TableRow>))}{data.jobs.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-gray-400 py-8">No jobs yet</TableCell></TableRow>}</TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Job Applications */}
          <TabsContent value="applications">
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Job</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{data.jobApps.map(a => (<TableRow key={a.id}><TableCell className="font-medium">{a.name}</TableCell><TableCell>{a.job_title || "-"}</TableCell><TableCell>{a.email}</TableCell><TableCell><Badge variant="outline" className="text-xs rounded-full capitalize">{a.status}</Badge></TableCell><TableCell className="text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString()}</TableCell><TableCell className="text-right"><Dialog><DialogTrigger asChild><Button variant="ghost" size="sm" onClick={async () => { const res = await axios.get(`${API}/jobs/applications/${a.id}`, { headers }); setViewApp(res.data); }}><Eye className="h-4 w-4" /></Button></DialogTrigger><DialogContent className="max-w-lg rounded-2xl"><DialogHeader><DialogTitle>Application Details</DialogTitle></DialogHeader>{viewApp && (<div className="space-y-4"><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-gray-500">Name:</span> {viewApp.name}</div><div><span className="text-gray-500">Email:</span> {viewApp.email}</div><div><span className="text-gray-500">Phone:</span> {viewApp.phone}</div><div><span className="text-gray-500">CTC:</span> {viewApp.current_ctc || "-"}</div></div>{viewApp.photo_base64 && <div><Label>Photo</Label><img src={viewApp.photo_base64} alt="Photo" className="h-24 w-24 object-cover rounded-xl border" /></div>}<div className="flex gap-2">{viewApp.resume_base64 && <a href={viewApp.resume_base64} download="resume.pdf" className="text-sm text-blue-600 flex items-center gap-1"><Download className="h-4 w-4" /> Resume</a>}{viewApp.payslip_base64 && <a href={viewApp.payslip_base64} download className="text-sm text-blue-600 flex items-center gap-1"><Download className="h-4 w-4" /> Payslip</a>}</div></div>)}</DialogContent></Dialog></TableCell></TableRow>))}{data.jobApps.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-gray-400 py-8">No applications yet</TableCell></TableRow>}</TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Contacts */}
          <TabsContent value="contacts">
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Message</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                <TableBody>{data.contacts.map(c => (<TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell><TableCell>{c.email}</TableCell><TableCell>{c.phone}</TableCell><TableCell className="max-w-xs truncate">{c.message}</TableCell><TableCell className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</TableCell></TableRow>))}{data.contacts.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-gray-400 py-8">No submissions yet</TableCell></TableRow>}</TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Dealers */}
          <TabsContent value="dealers">
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Business</TableHead><TableHead>Email</TableHead><TableHead>Location</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                <TableBody>{data.dealers.map(d => (<TableRow key={d.id}><TableCell className="font-medium">{d.name}</TableCell><TableCell>{d.business_name}</TableCell><TableCell>{d.email}</TableCell><TableCell>{d.location}</TableCell><TableCell className="text-xs text-gray-500">{new Date(d.created_at).toLocaleDateString()}</TableCell></TableRow>))}{data.dealers.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-gray-400 py-8">No applications yet</TableCell></TableRow>}</TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings"><SettingsTab token={token} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
