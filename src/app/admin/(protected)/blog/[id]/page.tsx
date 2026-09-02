import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post: any = null;
  try { post = await prisma.post.findUnique({ where: { id } }); } catch {}
  if (!post) return notFound();

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/blog"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-black">Edit Post</h1>
        <span className="text-xs bg-zinc-100 px-2 py-1 rounded font-mono">{post.id.slice(0,8)}</span>
      </div>
      <Card className="border-2 border-[#7FAF25]/20">
        <div className="h-1 bg-[#7FAF25]" />
        <CardHeader><CardTitle>{post.title}</CardTitle><p className="text-sm text-zinc-500">/{post.slug} • {post.views} views</p></CardHeader>
        <CardContent>
          <form action={`/api/posts?id=${post.id}`} method="post" className="space-y-3">
            <input type="hidden" name="_method" value="PUT" />
            <input name="title" defaultValue={post.title} required className="w-full border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="slug" defaultValue={post.slug} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="excerpt" defaultValue={post.excerpt || ""} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <textarea name="content" defaultValue={post.content} rows={8} required className="w-full border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="image" defaultValue={post.image || ""} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <div className="grid md:grid-cols-2 gap-3">
              <input name="seoTitle" defaultValue={post.seoTitle || ""} placeholder="SEO Title" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <input name="tags" defaultValue={post.tags?.join(", ") || ""} placeholder="Tags" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <input name="seoDescription" defaultValue={post.seoDescription || ""} placeholder="SEO Description" className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={post.published} className="accent-[#7FAF25]" /> Published</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={post.featured} className="accent-[#7FAF25]" /> Featured</label>
            </div>
            <Button type="submit" className="w-full h-11">Save Changes</Button>
          </form>
          <form action={`/api/posts?id=${post.id}&_method=DELETE`} method="post" className="mt-3">
            <Button type="submit" variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">Delete Post</Button>
          </form>
          <div className="mt-4 flex gap-2">
            <img src={post.image} alt={post.title} className="h-20 w-28 object-cover rounded-lg border" />
            <div className="text-xs text-zinc-500">
              <p>Created: {new Date(post.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(post.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
