import Link from "next/link";
import { formatKES } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { imageForCategory } from "@/lib/images";

export type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    oldPrice?: number | null;
    image?: string | null;
    rating: number;
    reviewsCount: number;
    inStock: boolean;
    badge?: string | null;
    installationAvailable?: boolean;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const fallback = imageForCategory(product.category);
  const img = product.image || fallback;
  return (
    <div className="group relative rounded-xl border bg-white overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all dark:bg-zinc-900 dark:border-zinc-800 flex flex-col">
      {product.badge && <Badge className="absolute left-2 top-2 z-10 bg-[#7FAF25] text-black font-bold shadow">{product.badge}</Badge>}
      {discount > 0 && <span className="absolute right-2 top-2 z-10 bg-[#0A0A0A] text-white text-xs px-2 py-0.5 rounded-full font-bold">-{discount}%</span>}
      <Link href={`/shop/${product.slug}`} className="aspect-[4/3] bg-zinc-50 dark:bg-zinc-800 grid place-items-center overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs uppercase tracking-widest text-[#6A9A1F] font-semibold">{product.category.replace("_"," ")}</p>
        <Link href={`/shop/${product.slug}`} className="font-semibold leading-tight line-clamp-2 hover:text-[#6A9A1F] hover:underline min-h-[40px]">{product.name}</Link>
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {product.rating.toFixed(1)} <span className="text-zinc-500">({product.reviewsCount})</span>
          {product.installationAvailable && <span className="ml-auto text-[10px] bg-[#0A0A0A] text-white px-2 py-0.5 rounded-full font-medium">Install Available</span>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-black text-lg text-[#0A0A0A] dark:text-white">{formatKES(product.price)}</span>
          {product.oldPrice && <span className="text-sm text-zinc-500 line-through">{formatKES(product.oldPrice)}</span>}
        </div>
        <div className="flex gap-2 mt-2">
          <Button size="sm" className="flex-1"><ShoppingCart className="h-4 w-4" /> Add</Button>
          <Button size="sm" variant="outline"><Heart className="h-4 w-4" /></Button>
          <Link href={`/shop/${product.slug}`}><Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button></Link>
        </div>
        <p className={`text-xs font-medium ${product.inStock ? "text-[#5A7F1B]" : "text-red-600"}`}>{product.inStock ? "In Stock • Free delivery Nairobi > KES 5k" : "Out of Stock"}</p>
      </div>
    </div>
  );
}
