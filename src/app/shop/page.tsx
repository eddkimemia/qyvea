import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGES } from "@/lib/images";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
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
  let dbFailed = false;
  try {
    products = await prisma.product.findMany({ where, orderBy, take: 48 });
  } catch {
    products = [];
    dbFailed = true;
  }

  // Fallback to MOCK_PRODUCTS (39 items, all 13 categories) when DB empty / not migrated
  if (!products.length) {
    let filtered: any[] = [...MOCK_PRODUCTS] as any[];
    if (sp.category) filtered = filtered.filter((p) => p.category === sp.category);
    if (sp.q) filtered = filtered.filter((p) => p.name.toLowerCase().includes(sp.q!.toLowerCase()));
    if (sp.min) filtered = filtered.filter((p) => p.price >= parseInt(sp.min!));
    if (sp.max) filtered = filtered.filter((p) => p.price <= parseInt(sp.max!));
    // sort mock like DB
    if (sp.sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
    else if (sp.sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
    else if (sp.sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
    else if (sp.sort === "sold") filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    products = filtered;
    // annotate fallback for UI
    if (dbFailed) products = filtered; // still show mock
  }

  const categories = ["CCTV","INTERCOM","ACCESS_CONTROL","BIOMETRICS","NETWORKING","ELECTRIC_FENCE","GATE_AUTOMATION","FIRE_ALARM","SOLAR","SMART_HOME","ELECTRICAL","IT_SUPPORT","ACCESSORIES"];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header with Unsplash tech banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <img src={IMAGES.hero.tech} alt="Security products" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#002070]/80 to-black/40" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0038A0]" />
        <div className="relative p-6 md:p-8 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <Badge className="bg-[#0038A0] text-white font-bold mb-2">STORE • GENUINE • WARRANTIED</Badge>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Security Products & Professional Installation</h1>
            <p className="text-zinc-300 mt-1 text-sm md:text-base">Certified engineers install, commission and warrant every system we supply.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-white text-black px-3 py-1.5 rounded-full font-semibold flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#0038A0]" /> Supply & Install</span>
            <span className="bg-[#0038A0] text-white px-3 py-1.5 rounded-full font-bold">🔒 5-Yr Warranty</span>
            <span className="bg-black text-white border border-white/20 px-3 py-1.5 rounded-full font-medium">🚀 Same-Day Nairobi</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="h-fit sticky top-[72px] border-2 border-[#0038A0]/10 shadow-sm">
          <div className="h-1 bg-[#0038A0]" />
          <CardContent className="p-4 space-y-4">
            <form className="space-y-4">
              <div className="relative"><Input name="q" defaultValue={sp.q} placeholder="Search products, services..." className="focus-visible:ring-[#0038A0] border-zinc-200" /></div>
              <div>
                <p className="text-sm font-bold mb-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0038A0]" /> Category</p>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  <Link href="/shop" className={`px-3 py-1.5 rounded-lg font-medium transition ${!sp.category ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#002070]"}`}>All</Link>
                  {categories.map(c=>(
                    <Link key={c} href={`/shop?category=${c}`} className={`px-3 py-1.5 rounded-lg capitalize transition ${sp.category===c ? "bg-[#002070] text-white font-semibold" : "hover:bg-zinc-100"}`}>{c.replace("_"," ")}</Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold mb-2">Price Range (KES)</p>
                <div className="flex gap-2">
                  <Input name="min" placeholder="Min" defaultValue={sp.min} className="focus-visible:ring-[#0038A0]" />
                  <Input name="max" placeholder="Max" defaultValue={sp.max} className="focus-visible:ring-[#0038A0]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold mb-2">Sort</p>
                <select name="sort" defaultValue={sp.sort} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-[#0038A0] outline-none">
                  <option value="">Newest</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="sold">Best Sellers</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Apply Filters</Button>
              <Link href="/shop" className="block text-center text-sm font-medium text-[#0038A0] hover:text-[#0038A0] underline">Clear Filters</Link>
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
              <p className="text-sm text-zinc-500 mb-3">{products.length} products • <span className="text-[#0038A0] font-medium">Free delivery in Nairobi over KES 5,000</span></p>
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
