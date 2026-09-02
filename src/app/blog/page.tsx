import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | Syntech — Security, Solar, IT, Website, Graphic & AI Insights Kenya",
  description: "Syntech blog: CCTV installation costs Kenya 2026, solar backup systems, biometric access control, estate security guides, website design pricing, graphic design branding, AI solutions for SMEs. Expert insights from Kenya's #1 security & IT company.",
  keywords: ["CCTV Kenya", "CCTV installation cost", "solar backup Kenya", "biometrics Kenya", "estate security Kenya", "website design Kenya", "graphic design Kenya", "AI solutions Kenya", "Syntech blog", "security company Kenya"],
};

const FALLBACK_POSTS = [
  { title: "CCTV Installation Cost in Kenya 2026: Complete Price Guide (4CH to 32CH)", slug: "cctv-installation-cost-kenya-2026", excerpt: "Real 2026 pricing: 4CH from KES 28,500, 8CH from KES 52,000, 16CH from KES 115,000. Dome vs bullet cameras, storage options, hidden costs, and why 500+ Kenyan businesses trust Syntech for same-week installation with a 5-year warranty.", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80", tags: ["CCTV","Security","Kenya"], published: true, featured: true, createdAt: new Date().toISOString() },
  { title: "Solar Backup for CCTV & Electric Fence: 3KVA vs 5KVA vs Lithium", slug: "solar-backup-cctv-electric-fence-blackouts", excerpt: "Kenya's blackouts mean blind cameras. Compare 3KVA lead-acid vs 5KVA lithium systems, runtime calculations, pre-built Syntech kits from KES 85k, and why solar beats generators for reliable security backup.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80", tags: ["Solar","Backup","Power"], published: true, featured: true, createdAt: new Date().toISOString() },
  { title: "Website Design Cost in Kenya 2026: From KES 35k to Websites That Actually Convert", slug: "website-design-cost-kenya-2026", excerpt: "Why a KES 15k website costs you sales. Syntech's KES 35k websites deliver SEO optimization, M-Pesa integration, mobile-first design, blazing speed under 2 seconds, and AI-powered features that generate real leads.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", tags: ["Website Design","SEO","Kenya"], published: true, featured: true, createdAt: new Date().toISOString() },
  { title: "Graphic Design That Sells in Kenya: Beyond a Pretty Logo (2026 Guide)", slug: "graphic-design-kenya-2026-guide", excerpt: "Logos from KES 8k that pass the FKI Test (favicon, kiosk, invoice). Complete guide to brand identity, social media kits, vehicle wraps, color psychology, and AI-powered design tools for Kenyan businesses.", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80", tags: ["Graphic Design","Branding"], published: true, featured: true, createdAt: new Date().toISOString() },
  { title: "AI for Kenyan SMEs 2026: Chatbots, Automation & Vision That Save Real KES", slug: "ai-solutions-kenya-sme-2026", excerpt: "From KES 45k: WhatsApp AI chatbot that replies to CCTV quotes at 2am, AI camera monitoring that detects intruders, content AI that drafts SEO blogs, and lead scoring that increases close rates by 25%.", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80", tags: ["AI","Chatbot","Automation"], published: true, featured: true, createdAt: new Date().toISOString() },
  { title: "Biometric Access vs Keys: Why Kenyan Offices Are Switching in 2026", slug: "biometric-access-vs-keys-kenya-2026", excerpt: "Fingerprint, face, card — 98% fewer tail-gating incidents and auditable logs. Compare biometric access control systems from KES 35k, integration with CCTV and gates, and why Kenyan offices are ditching keys for good.", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80", tags: ["Biometrics"], published: true, createdAt: new Date().toISOString() },
  { title: "Estate Security: One Contract for 50–200 Homes (HOA Guide 2026)", slug: "estate-security-hoa-guide-kenya", excerpt: "How Kitengela & Syokimau estates save 35% with bulk CCTV, electric fencing, and automatic gates under a single SLA. Complete HOA security guide covering system design, maintenance, and cost breakdown per unit.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", tags: ["Estates","HOA"], published: true, featured: true, createdAt: new Date().toISOString() },
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
        <Badge className="bg-[#0038A0] text-white font-bold">BLOG • MANAGED BY ADMIN</Badge>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Syntech Insights</h1>
        <p className="text-zinc-600 mt-2">Security, solar & IT guides for Kenyan homes, estates & businesses. Updated by admin, SEO-optimized, 2026.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
            <Card className="overflow-hidden h-full hover:shadow-lg hover:border-[#0038A0]/30 transition flex flex-col">
              <div className="aspect-[16/9] overflow-hidden bg-zinc-100">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex gap-1 flex-wrap">{p.tags?.slice(0,2).map((t:string)=><Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}{p.featured && <Badge className="bg-[#0038A0] text-white text-[11px]">Featured</Badge>}</div>
                <CardTitle className="text-lg leading-tight group-hover:text-[#0038A0] line-clamp-2">{p.title}</CardTitle>
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
