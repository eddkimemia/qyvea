"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/image-uploader";

interface Service {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  icon: string | null;
  image: string | null;
  priceFrom: number | null;
  featured: boolean;
  active: boolean;
}

export function ServicesManager({ initial }: { initial: Service[] }) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initial);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // create fields
  const [cTitle, setCTitle] = useState("");
  const [cSlug, setCSlug] = useState("");
  const [cExcerpt, setCExcerpt] = useState("");
  const [cDescription, setCDescription] = useState("");
  const [cIcon, setCIcon] = useState("Shield");
  const [cPrice, setCPrice] = useState("");
  const [cFeatured, setCFeatured] = useState(false);
  const [cActive, setCActive] = useState(true);
  const [cImages, setCImages] = useState<string[]>([]);

  // edit fields
  const [eTitle, setETitle] = useState("");
  const [eSlug, setESlug] = useState("");
  const [eExcerpt, setEExcerpt] = useState("");
  const [eDescription, setEDescription] = useState("");
  const [eIcon, setEIcon] = useState("");
  const [ePrice, setEPrice] = useState("");
  const [eFeatured, setEFeatured] = useState(false);
  const [eActive, setEActive] = useState(true);
  const [eImages, setEImages] = useState<string[]>([]);

  const startEdit = (s: Service) => {
    setEditing(s);
    setETitle(s.title);
    setESlug(s.slug);
    setEExcerpt(s.excerpt || "");
    setEDescription(s.description || "");
    setEIcon(s.icon || "");
    setEPrice(s.priceFrom?.toString() || "");
    setEFeatured(s.featured);
    setEActive(s.active);
    setEImages(s.image ? [s.image] : []);
    setError(null);
    setShowCreate(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!cTitle || !cSlug) { setError("Title and slug required"); return; }
    setLoading(true);
    try {
      const payload: any = {
        title: cTitle,
        slug: cSlug.toUpperCase(),
        excerpt: cExcerpt || null,
        description: cDescription || null,
        icon: cIcon || null,
        image: cImages[0] || null,
        priceFrom: cPrice ? parseInt(cPrice) : null,
        featured: cFeatured,
        active: cActive,
      };
      const res = await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setServices([...services, json]);
      setShowCreate(false);
      setCTitle(""); setCSlug(""); setCExcerpt(""); setCDescription(""); setCImages([]); setCPrice("");
      router.refresh();
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);
    try {
      const payload: any = {
        title: eTitle,
        slug: eSlug.toUpperCase(),
        excerpt: eExcerpt || null,
        description: eDescription || null,
        icon: eIcon || null,
        image: eImages[0] || null,
        priceFrom: ePrice ? parseInt(ePrice) : null,
        featured: eFeatured,
        active: eActive,
      };
      const res = await fetch(`/api/services?id=${editing.id}&_method=PUT`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setServices(services.map((s) => (s.id === editing.id ? json : s)));
      setEditing(null);
      router.refresh();
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete service?")) return;
    const res = await fetch(`/api/services?id=${id}&_method=DELETE`, { method: "POST" });
    if (!res.ok) { const j = await res.json(); alert(j.error); return; }
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-zinc-500">{services.length} services • Edit title, image, price, featured.</p>
        <Button size="sm" onClick={() => { setShowCreate(!showCreate); setEditing(null); }}>{showCreate ? "Cancel" : "+ Add Service"}</Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

      {showCreate && (
        <Card className="border-2 border-[#0038A0]/20">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader><CardTitle>New Service</CardTitle><p className="text-sm text-zinc-500">Slug must match ServiceSlug enum: CCTV, BIOMETRICS, etc. For custom, use existing enum value.</p></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-3">
              <ImageUploader value={cImages} onChange={setCImages} max={1} label="Service Image" />
              <div className="grid md:grid-cols-2 gap-3">
                <input value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="Title *" required className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <select value={cSlug} onChange={(e) => setCSlug(e.target.value)} required className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                  <option value="">Slug *</option>
                  {["CCTV","BIOMETRICS","ELECTRIC_FENCE","AUTOMATIC_GATES","FIRE_ALARM","NETWORKING","SMART_HOME","SOLAR_INSTALLATION","SOLAR_BACKUP","ELECTRICAL_INSTALLATION","BMS","CYBERSECURITY","SYSTEM_INTEGRATION","IT_SUPPORT","MAINTENANCE","ESTATE_SOLUTIONS","WEBSITE_DESIGN","GRAPHIC_DESIGN","AI_SOLUTIONS"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <input value={cExcerpt} onChange={(e) => setCExcerpt(e.target.value)} placeholder="Excerpt (short)" className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <textarea value={cDescription} onChange={(e) => setCDescription(e.target.value)} placeholder="Full description (supports line breaks, HTML allowed)" rows={3} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <div className="grid md:grid-cols-3 gap-3">
                <input value={cIcon} onChange={(e) => setCIcon(e.target.value)} placeholder="Icon e.g. Shield, Video" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <input value={cPrice} onChange={(e) => setCPrice(e.target.value)} type="number" placeholder="Price From KES" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={cFeatured} onChange={(e) => setCFeatured(e.target.checked)} className="accent-[#0038A0]" /> Featured</label>
                  <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={cActive} onChange={(e) => setCActive(e.target.checked)} className="accent-[#0038A0]" /> Active</label>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : "Create Service"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {editing && (
        <Card className="border-2 border-amber-200 bg-amber-50/20">
          <CardHeader><CardTitle>Edit {editing.title}</CardTitle><p className="text-xs text-zinc-500">{editing.slug}</p></CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-3">
              <ImageUploader value={eImages} onChange={setEImages} max={1} label="Service Image" />
              <input value={eTitle} onChange={(e) => setETitle(e.target.value)} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <input value={eExcerpt} onChange={(e) => setEExcerpt(e.target.value)} placeholder="Excerpt" className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <textarea value={eDescription} onChange={(e) => setEDescription(e.target.value)} rows={3} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <div className="grid md:grid-cols-3 gap-3">
                <input value={eIcon} onChange={(e) => setEIcon(e.target.value)} placeholder="Icon" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <input value={ePrice} onChange={(e) => setEPrice(e.target.value)} type="number" placeholder="Price From" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={eFeatured} onChange={(e) => setEFeatured(e.target.checked)} className="accent-[#0038A0]" /> Featured</label>
                  <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={eActive} onChange={(e) => setEActive(e.target.checked)} className="accent-[#0038A0]" /> Active</label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">{loading ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {services.map((s) => (
          <Card key={s.id} className="overflow-hidden hover:shadow-md transition">
            {s.image && <img src={s.image} alt={s.title} className="h-36 w-full object-cover" />}
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between gap-2">
                <span className="line-clamp-1">{s.title}</span>
                {s.featured && <Badge className="bg-[#0038A0] text-white text-[10px]">Featured</Badge>}
              </CardTitle>
              <p className="text-xs text-zinc-500">{s.slug} • {s.priceFrom ? `KES ${s.priceFrom.toLocaleString()} from` : "No price"} • {s.active ? "Active" : "Hidden"}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-zinc-600 line-clamp-2">{s.excerpt || s.description?.slice(0, 120) || "No excerpt"}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => startEdit(s)}>Edit</Button>
                <Button size="sm" variant="ghost" className="h-8 text-red-600" onClick={() => handleDelete(s.id)}>Del</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
