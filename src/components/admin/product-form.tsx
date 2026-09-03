"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/image-uploader";
import { RichTextEditor } from "@/components/rich-text-editor";

const CATEGORIES = ["CCTV","INTERCOM","ACCESS_CONTROL","BIOMETRICS","NETWORKING","ELECTRIC_FENCE","GATE_AUTOMATION","FIRE_ALARM","SOLAR","SMART_HOME","ELECTRICAL","IT_SUPPORT","ACCESSORIES","ICT"];

interface Spec { key: string; value: string; }

export function ProductForm({ initial, id }: { initial?: any; id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [oldPrice, setOldPrice] = useState(initial?.oldPrice?.toString() || "");
  const [stockQty, setStockQty] = useState(initial?.stockQty?.toString() || "10");
  const [labourPrice, setLabourPrice] = useState(initial?.labourPrice?.toString() || "");
  const [labourNote, setLabourNote] = useState(initial?.labourNote || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [badge, setBadge] = useState(initial?.badge || "");
  const [tags, setTags] = useState((initial?.tags || []).join(", "));
  const [specs, setSpecs] = useState<Spec[]>(initial?.specs || [{ key: "Warranty", value: "5 Years Workmanship + Manufacturer" }, { key: "Installation", value: "Available Same-Day in Nairobi" }]);
  const [featured, setFeatured] = useState(!!initial?.featured);
  const [active, setActive] = useState(initial?.active ?? true);
  const [installationAvailable, setInstallationAvailable] = useState(!!initial?.installationAvailable);
  const [images, setImages] = useState<string[]>(initial?.images?.length ? initial.images : initial?.image ? [initial.image] : []);

  useEffect(() => {
    if (!initial && name && !slug) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [name]);

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, k: "key" | "value", v: string) => {
    const n = [...specs];
    (n[i] as any)[k] = v;
    setSpecs(n);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name || !slug || !category || !price) {
      setError("Name, slug, category, price required");
      return;
    }
    if (!images.length) {
      setError("Upload at least one image");
      return;
    }
    setLoading(true);
    const payload: any = {
      name,
      slug,
      category,
      price: parseInt(price),
      oldPrice: oldPrice ? parseInt(oldPrice) : null,
      image: images[0],
      images,
      description,
      stockQty: parseInt(stockQty) || 0,
      labourPrice: labourPrice ? parseInt(labourPrice) : null,
      labourNote: labourNote || null,
      badge: badge || null,
      tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      specs: specs.filter((s) => s.key && s.value),
      featured,
      active,
      installationAvailable,
    };
    try {
      const url = id ? `/api/products?id=${id}` : "/api/products";
      const method = id ? "PUT" : "POST";
      // Use JSON for reliability (handles data URLs)
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setSuccess(id ? "Updated!" : "Created!");
      setTimeout(() => router.push("/admin/products"), 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">{success}</div>}

      <Card className="border-2 border-[#0038A0]/20 overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader>
          <CardTitle>{id ? "Edit Product" : "Add New Product"}</CardTitle>
          <p className="text-sm text-zinc-500">Primary image will be cover. Upload up to 8 images or paste Unsplash URLs. Images are uploaded via /api/upload.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploader value={images} onChange={setImages} max={8} label="Product Images" required />

          <div className="grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Product Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hikvision 4K 8MP PTZ Camera" required className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Slug *</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="hikvision-ptz-4mp" required className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
              <p className="text-xs text-zinc-500 mt-1">Auto-generated from name, editable.</p>
            </div>
            <div>
              <label className="text-sm font-semibold">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none bg-white">
                <option value="">Select</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">Price KES *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Old Price KES</label>
              <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} placeholder="For discount badge" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>

            <div>
              <label className="text-sm font-semibold">Stock Qty</label>
              <input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Badge</label>
              <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="NEW / HOT / SALE" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>

            <div>
              <label className="text-sm font-semibold">Labour Price KES</label>
              <input type="number" value={labourPrice} onChange={(e) => setLabourPrice(e.target.value)} placeholder="If installation available" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Labour Note</label>
              <input value={labourNote} onChange={(e) => setLabourNote(e.target.value)} placeholder="Per camera, etc." className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Tags (comma separated)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="CCTV, Hikvision, 4K, Outdoor" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Description — Rich Text</label>
              <div className="mt-1">
                <RichTextEditor value={description} onChange={setDescription} placeholder="Detailed description — use headings, lists, links, uploaded images..." minHeight="200px" />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Specs (key/value)</label>
                <Button type="button" variant="outline" size="sm" className="h-7" onClick={addSpec}>+ Add spec</Button>
              </div>
              <div className="mt-2 space-y-2">
                {specs.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={s.key} onChange={(e) => updateSpec(i, "key", e.target.value)} placeholder="Key e.g. Resolution" className="flex-1 border-2 border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none" />
                    <input value={s.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="Value e.g. 8MP 4K" className="flex-1 border-2 border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none" />
                    <Button type="button" variant="ghost" size="sm" className="h-9 text-red-600" onClick={() => removeSpec(i)}>Remove</Button>
                  </div>
                ))}
                {specs.length === 0 && <p className="text-xs text-zinc-500">No specs — add warranty, installation, etc.</p>}
              </div>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[#0038A0] h-4 w-4" /> Featured</label>
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-[#0038A0] h-4 w-4" /> Active</label>
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={installationAvailable} onChange={(e) => setInstallationAvailable(e.target.checked)} className="accent-[#0038A0] h-4 w-4" /> Installation available</label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11">{loading ? "Saving..." : id ? "Save Changes" : "Create Product"}</Button>
          {id && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-red-200 text-red-700 hover:bg-red-50"
              onClick={async () => {
                if (!confirm("Delete this product?")) return;
                const res = await fetch(`/api/products?id=${id}&_method=DELETE`, { method: "POST" });
                if (res.ok) window.location.href = "/admin/products?deleted=1";
                else alert("Delete failed");
              }}
            >
              Delete Product
            </Button>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
