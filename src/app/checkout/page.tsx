"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { formatKES } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { ShoppingCart, Truck, ShieldCheck, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const cart = useStore((s) => s.cart);
  const clearCart = useStore((s) => s.clearCart);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", location: "", notes: "", delivery: "nairobi", includeInstall: false });
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const deliveryFee = form.delivery === "nairobi" ? (subtotal > 5000 ? 0 : 300) : form.delivery === "outside" ? 800 : 0;
  const installFee = form.includeInstall ? 3500 : 0; // placeholder estimate
  const total = subtotal + deliveryFee + installFee;

  const waText = `Hello Syntech! I want to place an ORDER:\n\n${cart.map((c) => `• ${c.name} × ${c.qty} = ${formatKES(c.price * c.qty)}`).join("\n")}\n\nSubtotal: ${formatKES(subtotal)}\nDelivery: ${formatKES(deliveryFee)}\nInstall: ${formatKES(installFee)}\nTotal: ${formatKES(total)}\n\nCustomer: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nAddress: ${form.address} ${form.location}\nNotes: ${form.notes}\n\nPlease confirm availability.`;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!cart.length) return;
    if (!form.name || !form.phone) {
      alert("Name and phone required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ productId: c.productId, qty: c.qty, price: c.price })),
          phone: form.phone,
          email: form.email,
          address: `${form.address} ${form.location}`.trim(),
          notes: form.notes,
          includeInstallation: form.includeInstall,
          deliveryFee,
          installationFee: installFee,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Order failed");
      clearCart();
      router.push(`/checkout?success=1&order=${json.order?.id?.slice(0, 8) || ""}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("success")) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="h-16 w-16 rounded-full bg-[#0038A0] text-white grid place-items-center mx-auto text-2xl">✓</div>
        <h1 className="text-2xl font-black mt-4">Order Received!</h1>
        <p className="text-zinc-600 mt-2">We’ll call/WhatsApp you within 30 minutes to confirm.</p>
        <p className="text-sm text-zinc-500 mt-1">Order ID: {new URLSearchParams(window.location.search).get("order") || "—"}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/shop"><Button variant="outline">Continue Shopping</Button></Link>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank"><Button className="bg-[#25D366] hover:bg-[#20BD5A] text-white">Confirm on WhatsApp</Button></a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-[#0038A0] mb-4"><ArrowLeft className="h-4 w-4" /> Back to Shop</Link>
      <h1 className="text-2xl md:text-3xl font-black tracking-tight">Checkout</h1>
      <p className="text-sm text-zinc-500">Review your cart and enter delivery details — we confirm via WhatsApp/call in 30 min.</p>

      {cart.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-zinc-300" />
            <p className="font-semibold mt-3">Your cart is empty</p>
            <Link href="/shop"><Button className="mt-4">Browse 39 Products</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 mt-6">
          {/* Form */}
          <Card className="border-2 border-[#0038A0]/10">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader><CardTitle>Delivery Details</CardTitle><p className="text-sm text-zinc-500">Free delivery Nairobi &gt; KES 5k • Installation billed separately</p></CardHeader>
            <CardContent>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Full Name *</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required /></div>
                  <div><label className="text-sm font-medium">Phone *</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07xx xxx xxx" required /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Email</label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" /></div>
                  <div><label className="text-sm font-medium">Location / Estate</label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Westlands, Nairobi" /></div>
                </div>
                <div><label className="text-sm font-medium">Delivery Address</label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House / Apartment, Street, Building" /></div>
                <div>
                  <label className="text-sm font-medium">Delivery Option</label>
                  <select value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2 text-sm mt-1">
                    <option value="nairobi">Nairobi — Free over KES 5k (else KES 300)</option>
                    <option value="outside">Outside Nairobi — from KES 800</option>
                    <option value="pickup">Pickup — Westlands (Free)</option>
                  </select>
                </div>
                <div><label className="text-sm font-medium">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Delivery instructions, preferred time, etc." rows={3} className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2 text-sm mt-1" /></div>
                <label className="flex items-center gap-2 text-sm font-medium p-3 border-2 border-[#0038A0]/20 rounded-xl bg-[#F5F7FA] cursor-pointer">
                  <input type="checkbox" checked={form.includeInstall} onChange={(e) => setForm({ ...form, includeInstall: e.target.checked })} className="accent-[#0038A0] h-4 w-4" /> Include professional installation (+ KES 3,500 est.)
                </label>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button type="submit" disabled={loading} className="h-11">{loading ? "Placing..." : "Place Order"}</Button>
                  <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer"><Button type="button" className="w-full h-11 bg-[#25D366] hover:bg-[#20BD5A] text-white">Order on WhatsApp</Button></a>
                </div>
                <p className="text-xs text-zinc-500 text-center">By placing order you agree to 5-yr workmanship warranty & 2-hr response SLA. No payment now — we confirm first.</p>
              </form>
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Order Summary ({cart.length} items)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.slug}`} className="flex justify-between gap-2 text-sm border-b pb-2 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-zinc-500">Qty {item.qty} • {formatKES(item.price)} each</p>
                    </div>
                    <span className="font-bold whitespace-nowrap">{formatKES(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className="space-y-1.5 text-sm pt-2">
                  <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span className="font-medium">{formatKES(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Delivery</span><span className={deliveryFee === 0 ? "text-[#0038A0] font-bold" : ""}>{deliveryFee === 0 ? "FREE" : formatKES(deliveryFee)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Installation est.</span><span>{installFee ? formatKES(installFee) : "—"}</span></div>
                  <div className="flex justify-between font-black text-base border-t pt-2 mt-2"><span>Total</span><span>{formatKES(total)}</span></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-center pt-2">
                  <div className="border rounded-lg p-2"><Truck className="h-4 w-4 mx-auto text-[#0038A0]" /><p className="font-semibold">Free Nairobi</p></div>
                  <div className="border rounded-lg p-2"><ShieldCheck className="h-4 w-4 mx-auto text-[#0038A0]" /><p className="font-semibold">5-Yr Warranty</p></div>
                  <div className="border rounded-lg p-2"><span className="text-lg">✓</span><p className="font-semibold">Genuine</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#002070] text-white">
              <CardContent className="p-4 text-sm">
                <p className="font-bold text-[#0038A0]">Need help checkout?</p>
                <p className="text-zinc-300">Call {SITE.phone} or WhatsApp — we can place order for you in 1 min.</p>
                <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank"><Button size="sm" className="mt-3 bg-[#25D366] hover:bg-[#20BD5A] text-white w-full">Chat to Checkout</Button></a>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
