import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post: any = null;
  try { post = await prisma.post.findUnique({ where: { id } }); } catch {}
  if (!post) return notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/blog"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-black">Edit Post</h1>
        <span className="text-xs bg-zinc-100 px-2 py-1 rounded font-mono">{post.id.slice(0, 8)}</span>
      </div>
      <BlogForm initial={post} id={post.id} />
      <div className="max-w-4xl text-xs text-zinc-500 space-y-1 border rounded-xl p-3 bg-zinc-50">
        <p>Views: {post.views} • Created: {new Date(post.createdAt).toLocaleString()} • Updated: {new Date(post.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
