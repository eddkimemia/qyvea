"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatKES } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export function ProductActions({ product }: { product: { id: string; slug: string; name: string; price: number; oldPrice?: number | null; category: string } }) {
  const addToCart = useStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);
  const [withInstall, setWithInstall] = useState(false);

  const handleAdd = () => {
    addToCart({ productId: product.id, slug: product.slug, name: product.name, price: product.price, qty: 1, withInstall });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const waText = `Hello Qyvea! \n\nI want to ORDER this product:\n\n*${product.name}*\nPrice: ${formatKES(product.price)}${product.oldPrice ? " (was " + formatKES(product.oldPrice) + ")" : ""}\nCategory: ${product.category.replace("_"," ")}\nLink: https://qyvea.co.ke/shop/${product.slug}${withInstall ? "\n+ Professional Installation" : ""}\n\nPlease confirm:\n- Availability in stock\n- Delivery to [my location]\n- Installation cost (if needed)\n\nThank you!`;

  return (
    <>
      <label className="flex items-center gap-2 mt-3 font-medium cursor-pointer text-sm">
        <input type="checkbox" className="accent-[#7FAF25] h-4 w-4" checked={withInstall} onChange={(e) => setWithInstall(e.target.checked)} />
        Add installation service to my order
      </label>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Button size="lg" className="flex-1 h-12 text-base shadow-md" onClick={handleAdd}>
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </Button>
        <Link
          href={`https://wa.me/254113301244?text=${encodeURIComponent(waText)}`}
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
    </>
  );
}
