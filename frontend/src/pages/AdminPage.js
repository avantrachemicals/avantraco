import { useState, useEffect, useCallback, useRef } from "react";
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
import { Lock, Plus, Pencil, Trash2, Package, Mail, Users, Database, Settings, Briefcase, Image, Eye, FileText, Download } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CATEGORIES = ["biostimulant", "biofertilizer", "liquid_fertilizer", "micronutrient", "water_soluble"];

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
    } catch {
      toast.error("Invalid password");
    }
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
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" data-testid="admin-password-input" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#044736] hover:bg-[#033326] rounded-full py-6" data-testid="admin-login-btn">
              {loading ? "..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductForm({ product, token, onSave, onClose }) {
  const [form, setForm] = useState(product || {
    name: "", slug: "", category: "biostimulant", image_url: "", featured: false,
    tagline: { en: "" }, overview: { en: "" }, dosage: { en: "" },
    composition: [], advantages: { en: [] }, how_it_works: { en: [] }, growth_stages: { en: [] }
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-") };
      if (product?.id) {
        await axios.put(`${API}/products/${product.id}`, payload, { headers });
      } else {
        await axios.post(`${API}/products`, payload, { headers });
      }
      toast.success("Product saved!");
      onSave();
      onClose();
    } catch {
      toast.error("Failed to save product");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2" data-testid="product-form">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="rounded-xl" data-testid="product-name-input" />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="auto-generated" className="rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
            <SelectTrigger className="rounded-xl" data-testid="product-category-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace("_"," ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Image URL</Label>
          <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-xl" />
        </div>
      </div>
      <div>
        <Label>Tagline (English)</Label>
        <Input value={form.tagline?.en || ""} onChange={e => setForm({...form, tagline: {...(form.tagline || {}), en: e.target.value}})} className="rounded-xl" />
      </div>
      <div>
        <Label>Overview (English)</Label>
        <Textarea rows={3} value={form.overview?.en || ""} onChange={e => setForm({...form, overview: {...(form.overview || {}), en: e.target.value}})} className="rounded-xl" />
      </div>
      <div>
        <Label>Dosage (English)</Label>
        <Input value={form.dosage?.en || ""} onChange={e => setForm({...form, dosage: {...(form.dosage || {}), en: e.target.value}})} className="rounded-xl" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={form.featured || false} onChange={e => setForm({...form, featured: e.target.checked})} className="rounded" />
        <Label htmlFor="featured">Featured Product</Label>
      </div>
      <Button type="submit" disabled={saving} className="w-full bg-[#044736] hover:bg-[#033326] rounded-full" data-testid="product-save-btn">
        {saving ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}

function JobForm({ job, token, onSave, onClose }) {
  const [form, setForm] = useState(job || {
    title: "", department: "", location: "", type: "Full-time", experience: "",
    description: "", requirements: [], responsibilities: [], salary_range: "", is_active: true
  });
  const [reqText, setReqText] = useState((job?.requirements || []).join("\n"));
  const [respText, setRespText] = useState((job?.responsibilities || []).join("\n"));
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        ...form,
        requirements: reqText.split("\n").filter(Boolean),
        responsibilities: respText.split("\n").filter(Boolean)
      };
      if (job?.id) {
        await axios.put(`${API}/jobs/${job.id}`, payload, { headers });
      } else {
        await axios.post(`${API}/jobs`, payload, { headers });
      }
      toast.success("Job saved!");
      onSave();
      onClose();
    } catch {
      toast.error("Failed to save job");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2" data-testid="job-form">
      <div>
        <Label>Job Title *</Label>
        <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl" data-testid="job-title-input" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Department</Label>
          <Input value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="rounded-xl" />
        </div>
        <div>
          <Label>Location</Label>
          <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Full-time", "Part-time", "Contract", "Internship"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Experience</Label>
          <Input value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="e.g. 2-5 years" className="rounded-xl" />
        </div>
      </div>
      <div>
        <Label>Salary Range</Label>
        <Input value={form.salary_range} onChange={e => setForm({...form, salary_range: e.target.value})} placeholder="e.g. 4-6 LPA" className="rounded-xl" />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="rounded-xl" />
      </div>
      <div>
        <Label>Requirements (one per line)</Label>
        <Textarea rows={3} value={reqText} onChange={e => setReqText(e.target.value)} className="rounded-xl" placeholder="Bachelor's degree required&#10;3+ years experience" />
      </div>
      <div>
        <Label>Responsibilities (one per line)</Label>
        <Textarea rows={3} value={respText} onChange={e => setRespText(e.target.value)} className="rounded-xl" placeholder="Lead product development&#10;Manage team" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded" />
        <Label htmlFor="is_active">Active (visible on careers page)</Label>
      </div>
      <Button type="submit" disabled={saving} className="w-full bg-[#044736] hover:bg-[#033326] rounded-full" data-testid="job-save-btn">
        {saving ? "Saving..." : "Save Job"}
      </Button>
    </form>
  );
}

function SettingsTab({ token }) {
  const [settings, setSettings] = useState({
    hero_image: "", logo_url: "", about_image: "", phytocode_image: "",
    social_links: { youtube: "", twitter: "", instagram: "", facebook: "", linkedin: "" }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`${API}/settings`).then(r => setSettings({...settings, ...r.data})).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/settings`, settings, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Images */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Image className="h-5 w-5" /> Site Images</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Logo URL</Label>
              <Input value={settings.logo_url} onChange={e => setSettings({...settings, logo_url: e.target.value})} className="rounded-xl" placeholder="https://..." />
              {settings.logo_url && <img src={settings.logo_url} alt="Logo preview" className="mt-2 h-12 object-contain" />}
            </div>
            <div>
              <Label>Hero Image URL</Label>
              <Input value={settings.hero_image} onChange={e => setSettings({...settings, hero_image: e.target.value})} className="rounded-xl" />
              {settings.hero_image && <img src={settings.hero_image} alt="Hero preview" className="mt-2 h-20 w-full object-cover rounded-lg" />}
            </div>
            <div>
              <Label>About Section Image URL</Label>
              <Input value={settings.about_image} onChange={e => setSettings({...settings, about_image: e.target.value})} className="rounded-xl" />
              {settings.about_image && <img src={settings.about_image} alt="About preview" className="mt-2 h-20 w-full object-cover rounded-lg" />}
            </div>
            <div>
              <Label>Phytocode Section Image URL</Label>
              <Input value={settings.phytocode_image} onChange={e => setSettings({...settings, phytocode_image: e.target.value})} className="rounded-xl" />
              {settings.phytocode_image && <img src={settings.phytocode_image} alt="Phytocode preview" className="mt-2 h-20 w-full object-cover rounded-lg" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {["youtube", "twitter", "instagram", "facebook", "linkedin"].map(platform => (
              <div key={platform}>
                <Label className="capitalize">{platform}</Label>
                <Input
                  value={settings.social_links?.[platform] || ""}
                  onChange={e => setSettings({...settings, social_links: {...settings.social_links, [platform]: e.target.value}})}
                  className="rounded-xl"
                  placeholder={`https://${platform}.com/...`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="bg-[#044736] hover:bg-[#033326] rounded-full px-8" data-testid="save-settings-btn">
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("avantra-admin-token") || "");
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobApps, setJobApps] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [viewApp, setViewApp] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [p, c, d, j, ja] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/contact`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/dealers/applications`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/jobs?active_only=false`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/jobs/applications/list`, { headers }).catch(() => ({ data: [] })),
      ]);
      setProducts(p.data);
      setContacts(c.data);
      setDealers(d.data);
      setJobs(j.data);
      setJobApps(ja.data);
    } catch {
      setToken("");
      localStorage.removeItem("avantra-admin-token");
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogin = (t) => { setToken(t); localStorage.setItem("avantra-admin-token", t); };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers });
      toast.success("Product deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axios.delete(`${API}/jobs/${id}`, { headers });
      toast.success("Job deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSeed = async () => {
    try {
      const res = await axios.post(`${API}/seed`);
      toast.success(res.data.message);
      fetchData();
    } catch {
      toast.error("Seed failed");
    }
  };

  if (!token) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSeed} className="rounded-full" data-testid="seed-btn">
              <Database className="mr-2 h-4 w-4" /> Seed
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setToken(""); localStorage.removeItem("avantra-admin-token"); }} className="rounded-full" data-testid="admin-logout-btn">
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 bg-white p-1 rounded-full shadow-sm">
            <TabsTrigger value="products" className="rounded-full" data-testid="tab-products"><Package className="mr-1 h-4 w-4" /> Products</TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-full" data-testid="tab-jobs"><Briefcase className="mr-1 h-4 w-4" /> Jobs</TabsTrigger>
            <TabsTrigger value="applications" className="rounded-full" data-testid="tab-applications"><FileText className="mr-1 h-4 w-4" /> Applications</TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-full" data-testid="tab-contacts"><Mail className="mr-1 h-4 w-4" /> Contacts</TabsTrigger>
            <TabsTrigger value="dealers" className="rounded-full" data-testid="tab-dealers"><Users className="mr-1 h-4 w-4" /> Dealers</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-full" data-testid="tab-settings"><Settings className="mr-1 h-4 w-4" /> Settings</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-end mb-4">
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button className="bg-[#044736] hover:bg-[#033326] rounded-full" onClick={() => setEditProduct(null)} data-testid="add-product-btn">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-2xl">
                  <DialogHeader><DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
                  <ProductForm product={editProduct} token={token} onSave={fetchData} onClose={() => setShowForm(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Featured</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs rounded-full">{p.category}</Badge></TableCell>
                      <TableCell>{p.featured ? <Badge className="bg-orange-500 text-white text-xs rounded-full">Yes</Badge> : "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => { setEditProduct(p); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <div className="flex justify-end mb-4">
              <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
                <DialogTrigger asChild>
                  <Button className="bg-[#044736] hover:bg-[#033326] rounded-full" onClick={() => setEditJob(null)} data-testid="add-job-btn">
                    <Plus className="mr-2 h-4 w-4" /> Add Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-2xl">
                  <DialogHeader><DialogTitle>{editJob ? "Edit Job" : "Add Job"}</DialogTitle></DialogHeader>
                  <JobForm job={editJob} token={token} onSave={fetchData} onClose={() => setShowJobForm(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Title</TableHead><TableHead>Department</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map(j => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium">{j.title}</TableCell>
                      <TableCell>{j.department || "-"}</TableCell>
                      <TableCell>{j.location || "-"}</TableCell>
                      <TableCell>{j.is_active ? <Badge className="bg-green-500 text-white text-xs rounded-full">Active</Badge> : <Badge variant="outline" className="text-xs rounded-full">Inactive</Badge>}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => { setEditJob(j); setShowJobForm(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(j.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {jobs.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-gray-400 py-8">No jobs yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Job Applications Tab */}
          <TabsContent value="applications">
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Job</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {jobApps.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>{a.job_title || "-"}</TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>{a.phone}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs rounded-full capitalize">{a.status}</Badge></TableCell>
                      <TableCell className="text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={async () => {
                              const res = await axios.get(`${API}/jobs/applications/${a.id}`, { headers });
                              setViewApp(res.data);
                            }}><Eye className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg rounded-2xl">
                            <DialogHeader><DialogTitle>Application Details</DialogTitle></DialogHeader>
                            {viewApp && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div><span className="text-gray-500">Name:</span> {viewApp.name}</div>
                                  <div><span className="text-gray-500">Email:</span> {viewApp.email}</div>
                                  <div><span className="text-gray-500">Phone:</span> {viewApp.phone}</div>
                                  <div><span className="text-gray-500">Current CTC:</span> {viewApp.current_ctc || "-"}</div>
                                  <div><span className="text-gray-500">Company:</span> {viewApp.current_company || "-"}</div>
                                  <div className="col-span-2"><span className="text-gray-500">Address:</span> {viewApp.address || "-"}</div>
                                </div>
                                {viewApp.photo_base64 && (
                                  <div>
                                    <Label>Photo</Label>
                                    <img src={viewApp.photo_base64} alt="Applicant" className="h-24 w-24 object-cover rounded-xl border" />
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  {viewApp.resume_base64 && (
                                    <a href={viewApp.resume_base64} download="resume.pdf" className="text-sm text-blue-600 flex items-center gap-1"><Download className="h-4 w-4" /> Resume</a>
                                  )}
                                  {viewApp.payslip_base64 && (
                                    <a href={viewApp.payslip_base64} download="payslip" className="text-sm text-blue-600 flex items-center gap-1"><Download className="h-4 w-4" /> Payslip</a>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {jobApps.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-gray-400 py-8">No applications yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Message</TableHead><TableHead>Date</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">{c.message}</TableCell>
                      <TableCell className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {contacts.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-gray-400 py-8">No submissions yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Dealers Tab */}
          <TabsContent value="dealers">
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Business</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Location</TableHead><TableHead>Date</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {dealers.map(d => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.business_name}</TableCell>
                      <TableCell>{d.email}</TableCell>
                      <TableCell>{d.phone}</TableCell>
                      <TableCell>{d.location}</TableCell>
                      <TableCell className="text-xs text-gray-500">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {dealers.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-gray-400 py-8">No applications yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab token={token} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
