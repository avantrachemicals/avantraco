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
import { Lock, Plus, Pencil, Trash2, Package, Mail, Users, Database } from "lucide-react";

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
      <Card className="w-full max-w-sm border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Lock className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-2xl text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>Admin Panel</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} data-testid="admin-password-input" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700" data-testid="admin-login-btn">
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
          <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} data-testid="product-name-input" />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="auto-generated" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
            <SelectTrigger data-testid="product-category-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace("_"," ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Image URL</Label>
          <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
        </div>
      </div>
      <div>
        <Label>Tagline (English)</Label>
        <Input value={form.tagline?.en || ""} onChange={e => setForm({...form, tagline: {...(form.tagline || {}), en: e.target.value}})} />
      </div>
      <div>
        <Label>Overview (English)</Label>
        <Textarea rows={3} value={form.overview?.en || ""} onChange={e => setForm({...form, overview: {...(form.overview || {}), en: e.target.value}})} />
      </div>
      <div>
        <Label>Dosage (English)</Label>
        <Input value={form.dosage?.en || ""} onChange={e => setForm({...form, dosage: {...(form.dosage || {}), en: e.target.value}})} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={form.featured || false} onChange={e => setForm({...form, featured: e.target.checked})} />
        <Label htmlFor="featured">Featured Product</Label>
      </div>
      <Button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700" data-testid="product-save-btn">
        {saving ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("avantra-admin-token") || "");
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [p, c, d] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/contact`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/dealers/applications`, { headers }).catch(() => ({ data: [] })),
      ]);
      setProducts(p.data);
      setContacts(c.data);
      setDealers(d.data);
    } catch {
      setToken("");
      localStorage.removeItem("avantra-admin-token");
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogin = (t) => { setToken(t); localStorage.setItem("avantra-admin-token", t); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers });
      toast.success("Product deleted");
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
          <h1 className="text-3xl text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSeed} data-testid="seed-btn">
              <Database className="mr-2 h-4 w-4" /> Seed Products
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setToken(""); localStorage.removeItem("avantra-admin-token"); }} data-testid="admin-logout-btn">
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="products" data-testid="tab-products"><Package className="mr-1 h-4 w-4" /> Products ({products.length})</TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts"><Mail className="mr-1 h-4 w-4" /> Contacts ({contacts.length})</TabsTrigger>
            <TabsTrigger value="dealers" data-testid="tab-dealers"><Users className="mr-1 h-4 w-4" /> Dealers ({dealers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex justify-end mb-4">
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditProduct(null)} data-testid="add-product-btn">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
                  <ProductForm product={editProduct} token={token} onSave={fetchData} onClose={() => setShowForm(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{p.category}</Badge></TableCell>
                      <TableCell>{p.featured ? <Badge className="bg-orange-500 text-white text-xs">Yes</Badge> : "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => { setEditProduct(p); setShowForm(true); }} data-testid={`edit-${p.slug}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} data-testid={`delete-${p.slug}`}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card className="border-0 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
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

          <TabsContent value="dealers">
            <Card className="border-0 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
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
        </Tabs>
      </div>
    </div>
  );
}
