import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGES } from "@/lib/images";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchParams = { searchParams: Promise<{ q?: string; category?: string; sort?: string; min?: string; max?: string }> };

export default async function ShopPage({ searchParams }: SearchParams) {
  const sp = await searchParams;
  const where: any = { active: true };
  if (sp.q) where.name = { contains: sp.q, mode: "insensitive" };
  if (sp.category) where.category = sp.category;
  if (sp.min || sp.max) where.price = {};
  if (sp.min) where.price.gte = parseInt(sp.min);
  if (sp.max) where.price.lte = parseInt(sp.max);

  let orderBy: any = { createdAt: "desc" };
  if (sp.sort === "price_asc") orderBy = { price: "asc" };
  if (sp.sort === "price_desc") orderBy = { price: "desc" };
  if (sp.sort === "rating") orderBy = { rating: "desc" };
  if (sp.sort === "sold") orderBy = { sold: "desc" };

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({ where, orderBy, take: 48 });
  } catch {
    products = [];
  }

  if (!products.length) {
    products = [
      { id: "1", name: "Hikvision 4CH DVR Kit - 4 Bullet Cameras 1080p + 1TB", slug: "hikvision-4ch-kit-4bullet-1080p", category: "CCTV", price: 28500, oldPrice: 32000, rating: 4.7, reviewsCount: 34, inStock: true, badge: "HOT", installationAvailable: true },
      { id: "2", name: "ZKTeco F22 Biometric + Card Reader", slug: "zkteco-f22-biometric", category: "BIOMETRICS", price: 18500, oldPrice: 21000, rating: 4.6, reviewsCount: 41, inStock: true, badge: "FEATURED", installationAvailable: true },
      { id: "3", name: "Nemtek Druid 18 Energizer", slug: "nemtek-druid-18-energizer", category: "ELECTRIC_FENCE", price: 38000, oldPrice: null, rating: 4.7, reviewsCount: 29, inStock: true, installationAvailable: true },
      { id: "4", name: "Solar Backup Kit 3KVA Inverter + 2x200Ah + 2x550W", slug: "solar-backup-3kva-200ah", category: "SOLAR", price: 145000, oldPrice: 165000, rating: 4.9, reviewsCount: 44, inStock: true, badge: "SALE", installationAvailable: true },
    ].filter(p => {
      if (sp.category && p.category !== sp.category) return false;
      if (sp.q && !p.name.toLowerCase().includes(sp.q.toLowerCase())) return false;
      return true;
    });
  }

  const categories = ["CCTV","INTERCOM","ACCESS_CONTROL","BIOMETRICS","NETWORKING","ELECTRIC_FENCE","GATE_AUTOMATION","FIRE_ALARM","SOLAR","SMART_HOME","ELECTRICAL","IT_SUPPORT","ACCESSORIES"];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header with Unsplash tech banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <img src={IMAGES.hero.tech} alt="Security products" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#0A0A0A]/80 to-black/40" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#7FAF25]" />
        <div className="relative p-6 md:p-8 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <Badge className="bg-[#7FAF25] text-black font-bold mb-2">STORE • GENUINE • WARRANTIED</Badge>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Security Products & Professional Installation</h1>
            <p className="text-zinc-300 mt-1 text-sm md:text-base">Certified engineers install, commission and warrant every system we supply.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-white text-black px-3 py-1.5 rounded-full font-semibold flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#7FAF25]" /> Supply & Install</span>
            <span className="bg-[#7FAF25] text-black px-3 py-1.5 rounded-full font-bold">🔒 5-Yr Warranty</span>
            <span className="bg-black text-white border border-white/20 px-3 py-1.5 rounded-full font-medium">🚀 Same-Day Nairobi</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="h-fit sticky top-[72px] border-2 border-[#7FAF25]/10 shadow-sm">
          <div className="h-1 bg-[#7FAF25]" />
          <CardContent className="p-4 space-y-4">
            <form className="space-y-4">
              <div className="relative"><Input name="q" defaultValue={sp.q} placeholder="Search products, services..." className="focus-visible:ring-[#7FAF25] border-zinc-200" /></div>
              <div>
                <p className="text-sm font-bold mb-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#7FAF25]" /> Category</p>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  <Link href="/shop" className={`px-3 py-1.5 rounded-lg font-medium transition ${!sp.category ? "bg-[#7FAF25] text-black" : "hover:bg-[#F2F9E6] hover:text-[#3F5D13]"}`}>All</Link>
                  {categories.map(c=>(
                    <Link key={c} href={`/shop?category=${c}`} className={`px-3 py-1.5 rounded-lg capitalize transition ${sp.category===c ? "bg-[#0A0A0A] text-white font-semibold" : "hover:bg-zinc-100"}`}>{c.replace("_"," ")}</Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold mb-2">Price Range (KES)</p>
                <div className="flex gap-2">
                  <Input name="min" placeholder="Min" defaultValue={sp.min} className="focus-visible:ring-[#7FAF25]" />
                  <Input name="max" placeholder="Max" defaultValue={sp.max} className="focus-visible:ring-[#7FAF25]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold mb-2">Sort</p>
                <select name="sort" defaultValue={sp.sort} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-[#7FAF25] outline-none">
                  <option value="">Newest</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="sold">Best Sellers</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Apply Filters</Button>
              <Link href="/shop" className="block text-center text-sm font-medium text-[#5A7F1B] hover:text-[#7FAF25] underline">Clear Filters</Link>
            </form>
            <div className="pt-4 border-t">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Need help choosing?</p>
              <Link href="/#contact"><Button variant="outline" size="sm" className="w-full">Get Free Quote</Button></Link>
              <p className="text-xs text-zinc-500 mt-2 text-center">We reply in 30 min • Free survey</p>
            </div>
          </CardContent>
        </Card>

        <div>
          {products.length === 0 ? (
            <Card><CardContent className="p-12 text-center text-zinc-500">No products match your filters.</CardContent></Card>
          ) : (
            <>
              <p className="text-sm text-zinc-500 mb-3">{products.length} products • <span className="text-[#5A7F1B] font-medium">Free delivery in Nairobi over KES 5,000</span></p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {products.map((p:any)=><ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
