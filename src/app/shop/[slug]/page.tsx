import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatKES } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGES, imageForCategory } from "@/lib/images";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { ProductActions } from "@/components/product-actions";
import Link from "next/link";
import { Star, ShieldCheck, Truck, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: any = null;
  try {
    product = await prisma.product.findUnique({ where: { slug } });
    if (product) await prisma.product.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(()=>{});
  } catch {}

  if (!product) {
    const mock = ([...MOCK_PRODUCTS] as any[]).find((p) => p.slug === slug);
    if (!mock) return notFound();
    product = {
      ...mock,
      id: mock.id,
      description: `${mock.name} - Genuine, manufacturer warranty. Supply & install available countrywide. 5-year workmanship warranty.`,
      specs: [
        { key: "Warranty", value: "5 Years Workmanship + Manufacturer" },
        { key: "Installation", value: mock.installationAvailable ? "Available Same-Day in Nairobi" : "Product Only" },
      ],
      views: (mock as any).sold ? (mock as any).sold * 9 : 500,
      sold: (mock as any).sold || 50,
      stockQty: (mock as any).stockQty || 10,
    };
  }

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price)/product.oldPrice)*100) : 0;
  const heroImg = product.image || imageForCategory(product.category);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="text-sm text-zinc-500 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#0038A0] hover:underline">Home</Link> <span>/</span> <Link href="/shop" className="hover:text-[#0038A0] hover:underline">Shop</Link> <span>/</span> <span className="text-zinc-900 font-medium line-clamp-1">{product.name}</span>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-zinc-100 rounded-2xl grid place-items-center overflow-hidden dark:bg-zinc-800 border-2 border-[#0038A0]/10 relative">
            <img src={heroImg} alt={product.name} className="h-full w-full object-cover" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-[#002070] text-white font-semibold">{product.category.replace("_"," ")}</Badge>
              {product.badge && <Badge className="bg-[#0038A0] text-white font-bold">{product.badge}</Badge>}
              {discount>0 && <Badge className="bg-red-600 text-white font-bold">-{discount}%</Badge>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[IMAGES.products.networking, IMAGES.products.cctvKit, IMAGES.hero.tech].map((src,i)=>(
              <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 hover:border-[#0038A0] transition cursor-pointer">
                <img src={src} alt="thumb" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-[26px] font-black leading-tight tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="flex items-center gap-1 bg-[#F5F7FA] border border-[#0038A0]/20 px-2 py-1 rounded-full text-xs font-semibold"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {product.rating?.toFixed(1) ?? "4.5"} <span className="text-zinc-500 font-normal">({product.reviewsCount} reviews)</span></span>
            <span className="text-zinc-400">•</span> <span className="text-zinc-500 text-xs">{product.views} views</span> <span className="text-zinc-400">•</span> <span className="text-xs font-medium">{product.sold} sold</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-black text-[#002070]">{formatKES(product.price)}</span>
            {product.oldPrice && <span className="line-through text-zinc-500">{formatKES(product.oldPrice)}</span>}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${product.inStock ? "bg-[#0038A0] text-white" : "bg-red-100 text-red-700"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
          </div>

          <p className="mt-4 text-zinc-600 leading-relaxed text-sm md:text-base">{product.description}</p>

          {product.specs && Array.isArray(product.specs) && (
            <Card className="mt-4 border-2 border-[#0038A0]/10"><CardContent className="p-0 grid grid-cols-2 gap-0 text-sm divide-x divide-y">
              {(product.specs as any[]).map((s:any,i:number)=><div key={i} className="flex justify-between p-3 bg-white"><span className="text-zinc-500">{s.key}</span><span className="font-semibold">{s.value}</span></div>)}
            </CardContent></Card>
          )}

          <Card className="mt-4 bg-[#F5F7FA] border-[#0038A0]/30">
            <CardContent className="p-4 flex gap-3 items-start">
              <div className="h-9 w-9 rounded-xl bg-[#0038A0] text-white grid place-items-center shrink-0"><Wrench className="h-4 w-4" /></div>
              <div className="text-sm flex-1">
                <p className="font-bold">Professional Installation Available</p>
                <p className="text-zinc-600 mt-1">Our certified technicians will install this product at your premises. {product.labourPrice ? <span className="font-semibold text-[#002070]">Labour from {formatKES(product.labourPrice)}.</span> : ""} Same-day in Nairobi.</p>
              </div>
            </CardContent>
          </Card>

          <ProductActions product={{ id: product.id, slug: product.slug, name: product.name, price: product.price, oldPrice: product.oldPrice, category: product.category }} />

          <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-center">
            <div className="border-2 border-[#0038A0]/20 rounded-xl p-3 bg-[#F5F7FA]"><Truck className="h-5 w-5 mx-auto text-[#0038A0]" /><p className="font-bold mt-1">Free delivery</p><p className="text-zinc-500">Nairobi &gt; KES 5k</p></div>
            <div className="border rounded-xl p-3"><ShieldCheck className="h-5 w-5 mx-auto text-[#0038A0]" /><p className="font-bold mt-1">5-Year Warranty</p><p className="text-zinc-500">Workmanship</p></div>
            <div className="border rounded-xl p-3"><Wrench className="h-5 w-5 mx-auto text-[#0038A0]" /><p className="font-bold mt-1">Certified Install</p><p className="text-zinc-500">Same-day available</p></div>
          </div>

          <p className="mt-4 text-xs text-zinc-500 bg-zinc-50 rounded-lg p-3">Nationwide delivery from KES 300 • Installation billed separately after delivery • 100% genuine manufacturer warranty • Licensed NCA/EPRA/PSRA</p>
        </div>
      </div>

      <Card className="mt-8 border-2 border-[#0038A0]/10 overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader><CardTitle>You May Also Like</CardTitle><p className="text-sm text-zinc-500">More from {product.category.replace("_"," ")} — genuine stock with installation available.</p></CardHeader>
        <CardContent className="text-sm text-zinc-500">Explore similar products in our catalogue, all warranted and ready for same-week installation.</CardContent>
      </Card>
    </div>
  );
}
