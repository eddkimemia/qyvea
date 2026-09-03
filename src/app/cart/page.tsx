"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { formatKES } from "@/lib/utils";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShieldCheck, Truck, Wrench } from "lucide-react";

export default function CartPage() {
  const cart = useStore((s) => s.cart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateQty = useStore((s) => s.updateQty);
  const clearCart = useStore((s) => s.clearCart);
  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const whatsappMessage = `Hello Syntech! I want to order:\n\n${cart.map((c) => `• ${c.name} × ${c.qty} = ${formatKES(c.price * c.qty)}`).join("\n")}\n\nTotal: ${formatKES(cartTotal)}\n\nPlease confirm availability & delivery to [my location].`;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="h-20 w-20 rounded-full bg-zinc-100 grid place-items-center mx-auto mb-6">
          <ShoppingCart className="h-10 w-10 text-zinc-300" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Your Cart is Empty</h1>
        <p className="text-zinc-500 mt-3">Browse our shop and add products to get a quote.</p>
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
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-zinc-500 mt-1">{cartCount} item{cartCount !== 1 ? "s" : ""} in your cart</p>
        </div>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={clearCart}>
          <Trash2 className="h-4 w-4 mr-1" /> Clear All
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Cart Items */}
        <div className="space-y-3">
          {cart.map((item) => (
            <Card key={`${item.productId}-${item.slug}`} className="overflow-hidden">
              <CardContent className="p-4 flex gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.slug}`} className="font-semibold text-sm hover:text-[#0038A0] transition line-clamp-2">
                    {item.name}
                  </Link>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border-2 border-zinc-200 rounded-lg">
                      <button
                        onClick={() => updateQty(item.productId, Math.max(1, item.qty - 1))}
                        className="p-1.5 hover:bg-zinc-100 transition"
                        disabled={item.qty <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-bold min-w-[2rem] text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="p-1.5 hover:bg-zinc-100 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => removeFromCart(item.productId)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#002070]">{formatKES(item.price)}</p>
                  {item.qty > 1 && (
                    <p className="text-xs text-zinc-500">× {item.qty} = {formatKES(item.price * item.qty)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <Card className="border-2 border-[#0038A0]/15 sticky top-24">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Subtotal ({cartCount} items)</span><span className="font-semibold">{formatKES(cartTotal)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Delivery</span><span className="font-semibold text-green-600">{cartTotal >= 5000 ? "Free (Nairobi)" : "From KES 300"}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Installation</span><span className="text-xs text-zinc-400">Billed separately</span></div>
              </div>
              <div className="border-t pt-3 flex justify-between font-black text-lg">
                <span>Total</span>
                <span className="text-[#002070]">{formatKES(cartTotal)}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full bg-[#0038A0] hover:bg-[#002070] text-white gap-2 h-12 text-base font-bold">
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <p className="text-[11px] text-center text-zinc-500">M-Pesa STK Push • Card • Pay on Delivery</p>

              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full gap-2">
                  <svg viewBox="0 0 32 32" className="h-5 w-5 fill-[#25D366]"><path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z"/></svg>
                  Order on WhatsApp
                </Button>
              </a>
              <p className="text-[11px] text-center text-zinc-400">Instant quote • 5-yr warranty • 2hr response</p>

              <Link href="/shop" className="block">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Trust signals */}
          <Card className="border-[#0038A0]/10">
            <CardContent className="p-4 space-y-3">
              {[
                { icon: Truck, text: "Free delivery Nairobi over KES 5,000" },
                { icon: ShieldCheck, text: "5-year workmanship warranty" },
                { icon: Wrench, text: "Professional installation available" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-sm text-zinc-600">
                  <Icon className="h-4 w-4 text-[#0038A0] mt-0.5 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
