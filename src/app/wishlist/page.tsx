"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatKES } from "@/lib/utils";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  category: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  badge?: string;
};

export default function WishlistPage() {
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (!wishlist.length) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/products?slugs=${wishlist.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch {}
      setLoading(false);
    }
    fetchProducts();
  }, [wishlist]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      qty: 1,
    });
  };

  if (!wishlist.length && !loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="h-20 w-20 rounded-full bg-zinc-100 grid place-items-center mx-auto mb-6">
          <Heart className="h-10 w-10 text-zinc-300" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Your Wishlist is Empty</h1>
        <p className="text-zinc-500 mt-3">Save products you love and come back to them later.</p>
        <Link href="/shop">
          <Button className="mt-6 gap-2">Browse Shop <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">My Wishlist</h1>
          <p className="text-sm text-zinc-500 mt-1">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/shop"><Button variant="outline" size="sm">Browse Shop</Button></Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-zinc-100" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-zinc-100 rounded w-3/4" />
                <div className="h-3 bg-zinc-100 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group hover:shadow-md transition">
              <Link href={`/shop/${product.slug}`} className="block">
                <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  )}
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-[#0038A0] text-white font-bold text-[10px]">{product.badge}</Badge>
                  )}
                  {product.oldPrice && (
                    <Badge className="absolute top-3 right-3 bg-red-600 text-white font-bold text-[10px]">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </Badge>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="font-semibold text-sm line-clamp-2 hover:text-[#0038A0] transition">{product.name}</h3>
                </Link>
                <p className="text-xs text-zinc-500 mt-1 capitalize">{product.category?.replace("_", " ")}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-bold text-[#002070]">{formatKES(product.price)}</span>
                  {product.oldPrice && <span className="text-xs text-zinc-400 line-through">{formatKES(product.oldPrice)}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1 gap-1" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => toggleWishlist(product.slug)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
