import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  let posts: any[] = [];
  try {
    const where: any = {};
    if (sp.q) where.title = { contains: sp.q, mode: "insensitive" };
    posts = await prisma.post.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 });
  } catch { posts = []; }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black">Blog</h1>
          <p className="text-sm text-zinc-500">{posts.length} posts • Managed by admin • SEO ready</p>
        </div>
        <Link href="/admin/blog/new"><Button>+ New Post</Button></Link>
      </div>

      <Card>
        <CardContent className="p-3 flex flex-wrap gap-2">
          <form className="flex gap-2 flex-1">
            <input name="q" defaultValue={sp.q} placeholder="Search title..." className="border rounded-lg px-3 py-1.5 text-sm flex-1" />
            <Button type="submit" size="sm" variant="secondary">Search</Button>
          </form>
          <Link href="/blog" target="_blank"><Button variant="outline" size="sm">View Blog ↗</Button></Link>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b text-xs uppercase tracking-widest text-zinc-500">
              <tr><th className="text-left p-3">Post</th><th className="text-center p-3">Status</th><th className="text-center p-3">Views</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No posts — <Link href="/admin/blog/new" className="underline text-[#0038A0]">create one</Link> or run <code className="bg-zinc-100 px-1 rounded">npm run db:seed</code></td></tr>
              ) : posts.map((p: any) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-[#F5F7FA]/30">
                  <td className="p-3">
                    <div className="flex gap-3">
                      <img src={p.image || "https://placehold.co/80x60/7FAF25/0A0A0A?text=Q"} alt={p.title} className="h-12 w-16 rounded-lg object-cover border" />
                      <div className="min-w-0">
                        <p className="font-semibold line-clamp-1 max-w-[320px]">{p.title}</p>
                        <p className="text-xs text-zinc-500">/{p.slug} • {p.tags?.join(", ") || "no tags"}</p>
                        <p className="text-xs text-zinc-400 line-clamp-1">{p.excerpt || ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={p.published ? "bg-[#0038A0] text-white" : "bg-zinc-200 text-zinc-700"}>{p.published ? "Published" : "Draft"}</Badge>
                    {p.featured && <Badge className="ml-1 bg-black text-white text-[10px]">Featured</Badge>}
                  </td>
                  <td className="p-3 text-center text-xs">{p.views}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/blog/${p.slug}`} target="_blank"><Button size="sm" variant="ghost" className="h-7 text-xs">View</Button></Link>
                      <Link href={`/admin/blog/${p.id}`}><Button size="sm" variant="outline" className="h-7 text-xs">Edit</Button></Link>
                      <form action={`/api/posts?id=${p.id}&_method=DELETE`} method="post"><Button size="sm" variant="ghost" className="h-7 text-xs text-red-600" type="submit">Del</Button></form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
