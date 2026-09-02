import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | Qyvea Limited — Security, Solar & IT Insights Kenya",
  description: "Qyvea blog: CCTV costs, solar backup, biometrics, estate security guides. Expert installs across 47 counties. Updated 2026.",
};

const FALLBACK_POSTS = [
  { title: "CCTV Installation Cost in Kenya 2026: What Affects Your Quote?", slug: "cctv-installation-cost-kenya-2026", excerpt: "4CH vs 8CH vs 16CH, dome vs bullet, storage and labour — real 2026 pricing.", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80", tags: ["CCTV","Security"], published: true, featured: true, createdAt: new Date().toISOString() },
  { title: "Solar Backup for CCTV & Electric Fence: Stay Secure During Blackouts", slug: "solar-backup-cctv-electric-fence-blackouts", excerpt: "Keep fence, cameras and lights on when Kenya Power goes off. 3KVA vs 5KVA.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80", tags: ["Solar","Backup"], published: true, featured: true, createdAt: new Date().toISOString() },
  { title: "Biometric Access vs Keys: Why Kenyan Offices Are Switching in 2026", slug: "biometric-access-vs-keys-kenya-2026", excerpt: "Fingerprint, face, card — 98% fewer incidents and auditable logs.", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80", tags: ["Biometrics"], published: true, createdAt: new Date().toISOString() },
  { title: "Estate Security: One Contract for 50–200 Homes (HOA Guide)", slug: "estate-security-hoa-guide-kenya", excerpt: "How Kitengela & Syokimau estates save 35% with bulk CCTV, fence and gates.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", tags: ["Estates"], published: true, featured: true, createdAt: new Date().toISOString() },
];

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }], take: 20 });
  } catch { posts = []; }
  if (!posts.length) posts = FALLBACK_POSTS;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl">
        <Badge className="bg-[#7FAF25] text-black font-bold">BLOG • MANAGED BY ADMIN</Badge>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Qyvea Insights</h1>
        <p className="text-zinc-600 mt-2">Security, solar & IT guides for Kenyan homes, estates & businesses. Updated by admin, SEO-optimized, 2026.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
            <Card className="overflow-hidden h-full hover:shadow-lg hover:border-[#7FAF25]/30 transition flex flex-col">
              <div className="aspect-[16/9] overflow-hidden bg-zinc-100">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex gap-1 flex-wrap">{p.tags?.slice(0,2).map((t:string)=><Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}{p.featured && <Badge className="bg-[#7FAF25] text-black text-[11px]">Featured</Badge>}</div>
                <CardTitle className="text-lg leading-tight group-hover:text-[#7FAF25] line-clamp-2">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1">
                <p className="text-sm text-zinc-600 line-clamp-3">{p.excerpt}</p>
                <p className="text-xs text-zinc-400 mt-3">{new Date(p.createdAt).toLocaleDateString()} • 5 min read</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
