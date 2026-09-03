import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { formatKES } from "@/lib/utils";
import { Eye, ExternalLink, Package, Star, TrendingUp, Box } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: any = null;
  try {
    product = await prisma.product.findUnique({ where: { id } });
  } catch {}
  if (!product) return notFound();

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/products" className="hover:text-[#0038A0] hover:underline">Products</Link>
        <span>/</span>
        <span className="text-zinc-900 font-medium line-clamp-1">{product.name}</span>
        <span>/</span>
        <span className="text-[#0038A0] font-semibold">Edit</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4 items-start">
          <img
            src={product.image || `https://placehold.co/80x80/0038A0/FFFFFF?text=${product.category[0]}`}
            alt={product.name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-[#0038A0]/10 shadow-sm hidden sm:block"
          />
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 flex-wrap">
              Edit Product
              <Badge variant="secondary" className="font-mono text-xs">{product.id.slice(0, 8)}</Badge>
              {product.featured && <Badge className="bg-black text-white text-xs">FEATURED</Badge>}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {product.category.replace("_", " ")} • <span className="font-mono">{product.slug}</span> • Updated {new Date(product.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${product.active ? "bg-[#0038A0] text-white" : "bg-zinc-200 text-zinc-700"}`}>{product.active ? "Active" : "Hidden"}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${product.inStock ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
              {discount > 0 && <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-red-600 text-white">-{discount}% OFF</span>}
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-zinc-100 border">⭐ {product.rating} • {product.views} views • {product.sold} sold</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/shop/${product.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5"><Eye className="h-4 w-4" /> View</Button>
          </Link>
          <Link href={`/admin/products`}>
            <Button variant="ghost" size="sm">← Back to list</Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Form */}
        <ProductForm initial={product} id={product.id} />

        {/* Sidebar preview & stats */}
        <div className="space-y-4 sticky top-20">
          <Card className="overflow-hidden border-2 border-[#0038A0]/10">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-[#0038A0]" /> Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border bg-zinc-50">
                <img src={product.image || `https://placehold.co/400x300/0038A0/FFFFFF?text=${product.category}`} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-bold leading-tight line-clamp-2">{product.name}</p>
                <p className="text-xs text-[#002070] font-semibold mt-1 uppercase tracking-widest">{product.category.replace("_", " ")}</p>
                <p className="text-lg font-black text-[#002070] mt-1">{formatKES(product.price)} {product.oldPrice && <span className="text-sm line-through text-zinc-500 font-normal">{formatKES(product.oldPrice)}</span>}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="border rounded-lg p-2 bg-white"><Box className="h-4 w-4 mx-auto text-[#0038A0]" /><p className="font-bold mt-1">{product.stockQty}</p><p className="text-zinc-500">Stock</p></div>
                <div className="border rounded-lg p-2 bg-white"><Star className="h-4 w-4 mx-auto text-amber-500" /><p className="font-bold mt-1">{product.rating}</p><p className="text-zinc-500">Rating</p></div>
                <div className="border rounded-lg p-2 bg-white"><TrendingUp className="h-4 w-4 mx-auto text-[#0038A0]" /><p className="font-bold mt-1">{product.views}</p><p className="text-zinc-500">Views</p></div>
              </div>
              <Link href={`/shop/${product.slug}`} target="_blank" className="block">
                <Button variant="outline" size="sm" className="w-full gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> View on store</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Product Meta</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between border-b py-2"><span className="text-zinc-500">ID</span><span className="font-mono">{product.id.slice(0, 12)}...</span></div>
              <div className="flex justify-between border-b py-2"><span className="text-zinc-500">Slug</span><span className="font-mono truncate max-w-[160px]">{product.slug}</span></div>
              <div className="flex justify-between border-b py-2"><span className="text-zinc-500">Category</span><span className="font-medium">{product.category}</span></div>
              <div className="flex justify-between border-b py-2"><span className="text-zinc-500">Badge</span><span className="font-medium">{product.badge || "—"}</span></div>
              <div className="flex justify-between border-b py-2"><span className="text-zinc-500">Tags</span><span className="font-medium truncate max-w-[160px]">{product.tags?.join(", ") || "—"}</span></div>
              <div className="flex justify-between py-2"><span className="text-zinc-500">Labour</span><span className="font-medium">{product.labourPrice ? formatKES(product.labourPrice) : "—"}</span></div>
              <div className="pt-2 text-zinc-500 space-y-1 border-t mt-2">
                <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(product.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#0038A0]/20 bg-[#F5F7FA]/50">
            <CardContent className="p-4 space-y-2 text-sm">
              <p className="font-bold">Quick Actions</p>
              <Link href="/admin/products/new" className="block"><Button variant="outline" size="sm" className="w-full">+ Add Another Product</Button></Link>
              <Link href="/admin/products" className="block"><Button variant="ghost" size="sm" className="w-full">← All Products</Button></Link>
              <a href={`https://wa.me/254715135141?text=${encodeURIComponent(`Hi, check product: ${product.name} - https://syntech.co.ke/shop/${product.slug}`)}`} target="_blank" className="block">
                <Button size="sm" className="w-full bg-[#25D366] hover:bg-[#1ebd59]">Share on WhatsApp</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
