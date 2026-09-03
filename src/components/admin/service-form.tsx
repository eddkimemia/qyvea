"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/image-uploader";
import { RichTextEditor } from "@/components/rich-text-editor";

const SLUGS = ["CCTV","BIOMETRICS","ELECTRIC_FENCE","AUTOMATIC_GATES","FIRE_ALARM","NETWORKING","SMART_HOME","SOLAR_INSTALLATION","SOLAR_BACKUP","ELECTRICAL_INSTALLATION","BMS","CYBERSECURITY","SYSTEM_INTEGRATION","IT_SUPPORT","MAINTENANCE","ESTATE_SOLUTIONS","WEBSITE_DESIGN","GRAPHIC_DESIGN","AI_SOLUTIONS"];

export function ServiceForm({ initial, id }: { initial?: any; id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [icon, setIcon] = useState(initial?.icon || "Shield");
  const [priceFrom, setPriceFrom] = useState(initial?.priceFrom?.toString() || "");
  const [featured, setFeatured] = useState(!!initial?.featured);
  const [active, setActive] = useState(initial?.active ?? true);
  const [images, setImages] = useState<string[]>(initial?.image ? [initial.image] : []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || !slug) { setError("Title and slug required"); return; }
    if (!images.length) { setError("Upload at least one image"); return; }
    setLoading(true);
    const payload: any = {
      title,
      slug: slug.toUpperCase(),
      excerpt: excerpt || null,
      description: description || null,
      icon: icon || null,
      image: images[0],
      priceFrom: priceFrom ? parseInt(priceFrom) : null,
      featured,
      active,
    };
    try {
      const url = id ? `/api/services?id=${id}` : "/api/services";
      const method = id ? "PUT" : "POST";
      // Use JSON; API also supports PUT via POST override, but we can use direct PUT for id
      let res: Response;
      if (id) {
        res = await fetch(`/api/services?id=${id}&_method=PUT`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("Delete this service?")) return;
    const res = await fetch(`/api/services?id=${id}&_method=DELETE`, { method: "POST" });
    if (res.ok) router.push("/admin/services");
    else alert("Delete failed");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <Card className="border-2 border-[#0038A0]/20 overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader>
          <CardTitle>{id ? "Edit Service" : "Add New Service"}</CardTitle>
          <p className="text-sm text-zinc-500">
            This content is shown on <span className="font-mono">/services/{slug?.toLowerCase().replace(/_/g, "-") || "slug"}</span> and cards. Use rich editor for full description.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploader value={images} onChange={setImages} max={1} label="Service Cover Image" required />

          <div>
            <label className="text-sm font-semibold">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CCTV Installation" required className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Slug *</label>
              <select value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none">
                <option value="">Select slug</option>
                {SLUGS.map((s) => <option key={s} value={s}>{s} • {s.replace(/_/g, " ")}</option>)}
              </select>
              <p className="text-xs text-zinc-500 mt-1">Must be one of the enum values. Determines public URL mapping.</p>
            </div>
            <div>
              <label className="text-sm font-semibold">Icon</label>
              <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Shield, Video, Zap..." className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Excerpt (short, shown on cards)</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} maxLength={200} placeholder="One-line summary for service cards and SEO..." className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>

          <div>
            <label className="text-sm font-semibold">Full Description — Rich Text</label>
            <div className="mt-1">
              <RichTextEditor value={description} onChange={setDescription} placeholder="Full service details — process, benefits, FAQs supported as HTML..." minHeight="260px" />
            </div>
            <p className="text-xs text-zinc-500 mt-1">This HTML is rendered on the public service page. You can include headings, lists, images, links.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-semibold">Price From KES</label>
              <input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="25000" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[#0038A0] h-4 w-4" /> Featured</label>
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-[#0038A0] h-4 w-4" /> Active</label>
            </div>
            <div className="flex items-end">
              <p className="text-xs text-zinc-500">Featured shows on homepage. Active hides from public.</p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11">{loading ? "Saving..." : id ? "Save Changes" : "Create Service"}</Button>
          {id && <Button type="button" variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50" onClick={handleDelete}>Delete Service</Button>}
        </CardContent>
      </Card>
    </form>
  );
}
