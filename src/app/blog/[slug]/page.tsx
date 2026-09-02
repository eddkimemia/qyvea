import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const FALLBACK = {
  "cctv-installation-cost-kenya-2026": { title: "CCTV Installation Cost in Kenya 2026: What Affects Your Quote?", excerpt: "4CH vs 8CH vs 16CH, dome vs bullet, storage and labour — real 2026 pricing.", content: "Planning CCTV in 2026? Costs depend on camera count, resolution (1080p vs 5MP), storage (1TB vs 4TB), night vision, and analytics.\n\nQyvea tip: For a 3-bedroom home, a 4CH 1080p kit + 1TB at KES 28,500 installed covers most needs. Businesses need 8CH+ with remote monitoring — from KES 52,000.\n\nWe offer same-week install, 5-year workmanship warranty, and free site survey across 47 counties.", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80", tags: ["CCTV","Security"], seoTitle: "CCTV Installation Cost Kenya 2026 | Qyvea", seoDescription: "CCTV cost in Kenya 2026: 4CH, 8CH, 16CH pricing, what affects quotes, and Qyvea’s 5-year warranty.", createdAt: new Date().toISOString() },
  "solar-backup-cctv-electric-fence-blackouts": { title: "Solar Backup for CCTV & Electric Fence: Stay Secure During Blackouts", excerpt: "Keep fence, cameras and lights on when Kenya Power goes off.", content: "Blackouts shouldn’t mean black screens. A 3KVA inverter + 2x200Ah + 2x550W keeps 8 cameras, fence and lights for 8-12 hours.\n\nBundles from KES 85k with auto-changeover and lithium options. Qyvea designs for your load, installs in 1-3 days, and warrants 5 years.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80", tags: ["Solar"], seoTitle: "Solar Backup for CCTV & Fence Kenya | Qyvea", seoDescription: "Solar backup kits Kenya: 3KVA & 5KVA for CCTV & fence, lithium vs lead-acid, prices and install by Qyvea.", createdAt: new Date().toISOString() },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: any = null;
  try { post = await prisma.post.findUnique({ where: { slug } }); } catch {}
  if (!post) post = (FALLBACK as any)[slug];
  if (!post) return { title: "Post not found" };
  return {
    title: post.seoTitle || `${post.title} | Qyvea Blog`,
    description: post.seoDescription || post.excerpt,
    openGraph: { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, images: post.image ? [post.image] : [], type: "article" },
    alternates: { canonical: `https://qyvea.co.ke/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: any = null;
  try {
    post = await prisma.post.findUnique({ where: { slug } });
    if (post) await prisma.post.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(()=>{});
  } catch {}
  if (!post) post = (FALLBACK as any)[slug];
  if (!post) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.image,
    author: { "@type": "Organization", name: "Qyvea Limited" },
    publisher: { "@type": "Organization", name: "Qyvea Limited", logo: { "@type": "ImageObject", url: "https://qyvea.co.ke/logo.svg" } },
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/blog" className="text-sm text-[#7FAF25] hover:underline">← Back to Blog</Link>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mt-4">
        <div className="flex gap-2 flex-wrap">{post.tags?.map((t:string)=><Badge key={t} variant="secondary">{t}</Badge>)}<Badge className="bg-[#7FAF25] text-black">Qyvea</Badge></div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">{post.title}</h1>
        <p className="text-zinc-600 mt-3 text-lg">{post.excerpt}</p>
        <p className="text-xs text-zinc-400 mt-2">{new Date(post.createdAt).toLocaleDateString()} • {post.views || 0} views • Westlands, Nairobi</p>
      </div>
      <div className="mt-6 rounded-2xl overflow-hidden border">
        <img src={post.image} alt={post.title} className="w-full h-auto max-h-[420px] object-cover" />
      </div>
      <Card className="mt-6">
        <CardContent className="p-6 prose prose-zinc max-w-none">
          <p className="whitespace-pre-line leading-relaxed">{post.content}</p>
          <div className="not-prose mt-6 flex gap-2">
            <Link href="/shop"><Button>Shop Equipment</Button></Link>
            <Link href="/#contact"><Button variant="outline">Get Free Quote</Button></Link>
          </div>
        </CardContent>
      </Card>
      <p className="text-xs text-zinc-400 mt-6">Managed by admin at <Link href="/admin/blog" className="underline">/admin/blog</Link> • SEO title: {post.seoTitle}</p>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ slug: "cctv-installation-cost-kenya-2026" }, { slug: "solar-backup-cctv-electric-fence-blackouts" }];
}
