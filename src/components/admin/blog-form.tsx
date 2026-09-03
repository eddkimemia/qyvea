"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/image-uploader";
import { RichTextEditor } from "@/components/rich-text-editor";

export function BlogForm({ initial, id }: { initial?: any; id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription || "");
  const [tags, setTags] = useState((initial?.tags || []).join(", "));
  const [published, setPublished] = useState(!!initial?.published);
  const [featured, setFeatured] = useState(!!initial?.featured);
  const [images, setImages] = useState<string[]>(initial?.image ? [initial.image] : []);

  useEffect(() => {
    if (!initial && title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || !excerpt || !content) {
      setError("Title, excerpt, content required");
      return;
    }
    if (!images.length) {
      setError("Cover image required");
      return;
    }
    setLoading(true);
    const payload: any = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      excerpt,
      content,
      image: images[0],
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      published,
      featured,
    };
    try {
      const url = id ? `/api/posts?id=${id}` : "/api/posts";
      const method = id ? "PUT" : "POST";
      // posts API handles PUT via POST override for form, but for JSON we can use direct PUT/POST with JSON body
      // Our route's POST handles id+override, but let's use the JSON path: POST for create, and for update use POST with _method
      let res: Response;
      if (id) {
        res = await fetch(`/api/posts?id=${id}&_method=PUT`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        res = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts?id=${id}&_method=DELETE`, { method: "POST" });
    if (res.ok) router.push("/admin/blog");
    else alert("Delete failed");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

      <Card className="border-2 border-[#0038A0]/20 overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader>
          <CardTitle>{id ? "Edit Post" : "Create Post"}</CardTitle>
          <p className="text-sm text-zinc-500">Cover image + rich content. SEO fields help Google. Content supports headings, lists, links, images.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploader value={images} onChange={setImages} max={1} label="Cover Image" required />

          <div>
            <label className="text-sm font-semibold">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CCTV Installation Cost in Kenya 2026 — Complete Guide" required className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from title" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <p className="text-xs text-zinc-500 mt-1">URL: /blog/{slug || "your-slug"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold">Tags (comma separated)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="CCTV, Security, Kenya" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Excerpt * (150 chars) — card & SEO</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} maxLength={200} required className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" placeholder="Short summary for blog cards and Google snippet..." />
            <p className="text-xs text-zinc-500 text-right">{excerpt.length}/200</p>
          </div>

          <div>
            <label className="text-sm font-semibold">Content * — Rich Text</label>
            <div className="mt-1">
              <RichTextEditor value={content} onChange={setContent} placeholder="Write your article... Use headings, bullet lists, quotes, links and upload images." />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">SEO Title (60 chars)</label>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={60} placeholder="SEO title for Google (optional)" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <p className="text-xs text-zinc-500 text-right">{seoTitle.length}/60</p>
            </div>
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-[#0038A0] h-4 w-4" /> Published</label>
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[#0038A0] h-4 w-4" /> Featured</label>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">SEO Description (155 chars)</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} maxLength={160} placeholder="Meta description for search engines..." className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <p className="text-xs text-zinc-500 text-right">{seoDescription.length}/160</p>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11">{loading ? "Saving..." : id ? "Save Changes" : "Create Post"}</Button>

          {id && <Button type="button" variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50" onClick={handleDelete}>Delete Post</Button>}
        </CardContent>
      </Card>
    </form>
  );
}
