import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/blog"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-black">New Blog Post</h1>
      </div>
      <Card className="border-2 border-[#7FAF25]/20">
        <div className="h-1 bg-[#7FAF25]" />
        <CardHeader><CardTitle>Create Post</CardTitle><p className="text-sm text-zinc-500">SEO fields + featured. Publishes to <code>/blog</code> instantly.</p></CardHeader>
        <CardContent>
          <form action="/api/posts" method="post" className="space-y-3">
            <input name="title" placeholder="Title * e.g. CCTV Cost Kenya 2026" required className="w-full border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="slug" placeholder="Slug (auto from title if empty) e.g. cctv-cost-kenya" className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="excerpt" placeholder="Excerpt (150 chars) — shows in cards & SEO" required className="w-full border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <textarea name="content" placeholder="Content * (supports line breaks)" rows={8} required className="w-full border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="image" placeholder="Image URL (Unsplash 1200x800)" required defaultValue="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80" className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <div className="grid md:grid-cols-2 gap-3">
              <input name="seoTitle" placeholder="SEO Title (60 chars) — optional" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <input name="tags" placeholder="Tags comma separated e.g. CCTV, Security, Kenya" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <input name="seoDescription" placeholder="SEO Description (155 chars) — for Google" className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked className="accent-[#7FAF25]" /> Published</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" className="accent-[#7FAF25]" /> Featured</label>
            </div>
            <Button type="submit" className="w-full h-11">Create Post</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
