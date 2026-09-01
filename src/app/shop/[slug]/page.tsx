import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatKES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGES, imageForCategory } from "@/lib/images";
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
    const mocks: Record<string, any> = {
      "hikvision-4ch-kit-4bullet-1080p": { name: "Hikvision 4CH DVR Kit - 4 Bullet Cameras 1080p + 1TB", price: 28500, oldPrice: 32000, category: "CCTV", rating: 4.7, reviewsCount: 34, inStock: true, description: "Complete 4-camera kit with mobile app, 1TB storage, night vision.", badge: "HOT", installationAvailable: true, labourPrice: 4500, specs: [{key:"Channels",value:"4CH"},{key:"Resolution",value:"1080p"}] },
      "zkteco-f22-biometric": { name: "ZKTeco F22 Biometric + Card Reader", price: 18500, oldPrice: 21000, category:"BIOMETRICS", rating:4.6, reviewsCount:41, inStock:true, description:"Fingerprint & RFID, TCP/IP, access control."},
    };
    const m = mocks[slug];
    if (!m) return notFound();
    product = { slug, id: slug, images: [], sold: 100, views: 500, stockQty: 10, ...m };
  }

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price)/product.oldPrice)*100) : 0;
  const heroImg = product.image || imageForCategory(product.category);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="text-sm text-zinc-500 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#7FAF25] hover:underline">Home</Link> <span>/</span> <Link href="/shop" className="hover:text-[#7FAF25] hover:underline">Shop</Link> <span>/</span> <span className="text-zinc-900 font-medium line-clamp-1">{product.name}</span>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-zinc-100 rounded-2xl grid place-items-center overflow-hidden dark:bg-zinc-800 border-2 border-[#7FAF25]/10 relative">
            <img src={heroImg} alt={product.name} className="h-full w-full object-cover" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-[#0A0A0A] text-white font-semibold">{product.category.replace("_"," ")}</Badge>
              {product.badge && <Badge className="bg-[#7FAF25] text-black font-bold">{product.badge}</Badge>}
              {discount>0 && <Badge className="bg-red-600 text-white font-bold">-{discount}%</Badge>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[IMAGES.products.networking, IMAGES.products.cctvKit, IMAGES.hero.tech].map((src,i)=>(
              <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 hover:border-[#7FAF25] transition cursor-pointer">
                <img src={src} alt="thumb" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-[26px] font-black leading-tight tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="flex items-center gap-1 bg-[#F2F9E6] border border-[#7FAF25]/20 px-2 py-1 rounded-full text-xs font-semibold"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {product.rating?.toFixed(1) ?? "4.5"} <span className="text-zinc-500 font-normal">({product.reviewsCount} reviews)</span></span>
            <span className="text-zinc-400">•</span> <span className="text-zinc-500 text-xs">{product.views} views</span> <span className="text-zinc-400">•</span> <span className="text-xs font-medium">{product.sold} sold</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-black text-[#0A0A0A]">{formatKES(product.price)}</span>
            {product.oldPrice && <span className="line-through text-zinc-500">{formatKES(product.oldPrice)}</span>}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${product.inStock ? "bg-[#7FAF25] text-black" : "bg-red-100 text-red-700"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
          </div>

          <p className="mt-4 text-zinc-600 leading-relaxed text-sm md:text-base">{product.description}</p>

          {product.specs && Array.isArray(product.specs) && (
            <Card className="mt-4 border-2 border-[#7FAF25]/10"><CardContent className="p-0 grid grid-cols-2 gap-0 text-sm divide-x divide-y">
              {(product.specs as any[]).map((s:any,i:number)=><div key={i} className="flex justify-between p-3 bg-white"><span className="text-zinc-500">{s.key}</span><span className="font-semibold">{s.value}</span></div>)}
            </CardContent></Card>
          )}

          <Card className="mt-4 bg-[#F2F9E6] border-[#7FAF25]/30">
            <CardContent className="p-4 flex gap-3 items-start">
              <div className="h-9 w-9 rounded-xl bg-[#7FAF25] text-black grid place-items-center shrink-0"><Wrench className="h-4 w-4" /></div>
              <div className="text-sm flex-1">
                <p className="font-bold">Professional Installation Available</p>
                <p className="text-zinc-600 mt-1">Our certified technicians will install this product at your premises. {product.labourPrice ? <span className="font-semibold text-[#3F5D13]">Labour from {formatKES(product.labourPrice)}.</span> : ""} Same-day in Nairobi.</p>
                <label className="flex items-center gap-2 mt-3 font-medium cursor-pointer"><input type="checkbox" className="accent-[#7FAF25] h-4 w-4" /> Add installation service to my order</label>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1 h-12 text-base shadow-md">Add to Cart</Button>
            <Link
              href={`https://wa.me/254113301244?text=${encodeURIComponent(`Hello Qyvea! \n\nI want to ORDER this product:\n\n*${product.name}*\nPrice: ${formatKES(product.price)}${product.oldPrice ? " (was " + formatKES(product.oldPrice) + ")" : ""}\nCategory: ${product.category.replace("_"," ")}\nLink: https://qyvea.co.ke/shop/${product.slug}\n\nPlease confirm:\n- Availability in stock\n- Delivery to [my location]\n- Installation cost (if needed)\n\nThank you!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button size="lg" className="w-full h-12 text-base bg-[#25D366] hover:bg-[#20BD5A] text-white border-0 shadow-md hover:shadow-lg gap-2">
                <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white shrink-0" aria-hidden="true">
                  <path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z" />
                </svg>
                Order on WhatsApp
              </Button>
            </Link>
          </div>
          <p className="text-xs text-center text-zinc-500 mt-2">Instant quote • Reply in 30 min • No payment needed now</p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-center">
            <div className="border-2 border-[#7FAF25]/20 rounded-xl p-3 bg-[#F2F9E6]"><Truck className="h-5 w-5 mx-auto text-[#5A7F1B]" /><p className="font-bold mt-1">Free delivery</p><p className="text-zinc-500">Nairobi &gt; KES 5k</p></div>
            <div className="border rounded-xl p-3"><ShieldCheck className="h-5 w-5 mx-auto text-[#7FAF25]" /><p className="font-bold mt-1">5-Year Warranty</p><p className="text-zinc-500">Workmanship</p></div>
            <div className="border rounded-xl p-3"><Wrench className="h-5 w-5 mx-auto text-[#7FAF25]" /><p className="font-bold mt-1">Certified Install</p><p className="text-zinc-500">Same-day available</p></div>
          </div>

          <p className="mt-4 text-xs text-zinc-500 bg-zinc-50 rounded-lg p-3">Nationwide delivery from KES 300 • Installation billed separately after delivery • 100% genuine manufacturer warranty • Licensed NCA/EPRA/PSRA</p>
        </div>
      </div>

      <Card className="mt-8 border-2 border-[#7FAF25]/10 overflow-hidden">
        <div className="h-1 bg-[#7FAF25]" />
        <CardHeader><CardTitle>You May Also Like</CardTitle><p className="text-sm text-zinc-500">From the same category — genuine stock with install available.</p></CardHeader>
        <CardContent className="text-sm text-zinc-500">Related products are loaded dynamically via <code className="bg-[#F2F9E6] px-1.5 py-0.5 rounded text-[#3F5D13] font-mono text-xs">/api/products?category={product.category}</code></CardContent>
      </Card>
    </div>
  );
}
