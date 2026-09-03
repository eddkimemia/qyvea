"use client";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { SITE } from "@/lib/constants";
import { useStore } from "@/lib/store";

export function MobileBottomBar() {
  const wishlist = useStore((s) => s.wishlist);
  const cart = useStore((s) => s.cart);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[55] lg:hidden bg-white border-t-2 border-[#002070] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-3 gap-0">
        <Link href="/wishlist" className="flex flex-col items-center justify-center py-2.5 hover:bg-[#F5F7FA] transition">
          <div className="relative">
            <Heart className="h-5 w-5 text-[#002070]" />
            {wishlist.length > 0 && <span className="absolute -top-1.5 -right-2 bg-[#0038A0] text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 grid place-items-center">{wishlist.length}</span>}
          </div>
          <span className="text-[10px] font-semibold text-zinc-600 mt-0.5">Wishlist</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center justify-center py-2.5 hover:bg-[#F5F7FA] transition">
          <div className="relative">
            <ShoppingCart className="h-5 w-5 text-[#002070]" />
            {cartCount > 0 && <span className="absolute -top-1.5 -right-2 bg-[#F00000] text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 grid place-items-center">{cartCount}</span>}
          </div>
          <span className="text-[10px] font-semibold text-zinc-600 mt-0.5">Cart</span>
        </Link>
        <Link href="/quote" className="flex flex-col items-center justify-center py-2.5 bg-[#002070] hover:bg-[#0038A0] transition">
          <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white"><path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z"/></svg>
          <span className="text-[10px] font-semibold text-white mt-0.5">Get Quote</span>
        </Link>
      </div>
    </div>
  );
}
