"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { formatKES } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { ShoppingCart, Truck, ShieldCheck, ArrowLeft, Smartphone, CreditCard, Banknote, CheckCircle2, Loader2, Phone } from "lucide-react";

export default function CheckoutPage() {
  const cart = useStore((s) => s.cart);
  const clearCart = useStore((s) => s.clearCart);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", location: "", notes: "", delivery: "nairobi", includeInstall: false });
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "cod">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [stkLoading, setStkLoading] = useState(false);
  const [stkData, setStkData] = useState<any>(null);
  const [stkStatus, setStkStatus] = useState<"idle" | "sent" | "success" | "failed">("idle");
  const [pollError, setPollError] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const deliveryFee = form.delivery === "nairobi" ? (subtotal > 5000 ? 0 : 300) : form.delivery === "outside" ? 800 : 0;
  const installItemQty = form.includeInstall ? cart.reduce((sum, c) => sum + c.qty, 0) : 0;
  const installFee = installItemQty * 3500;
  const total = subtotal + deliveryFee + installFee;

  useEffect(() => {
    if (form.phone && !mpesaPhone) setMpesaPhone(form.phone);
  }, [form.phone]);

  const waText = `Hello Syntech! I want to place an ORDER:\n\n${cart.map((c) => `• ${c.name} × ${c.qty} = ${formatKES(c.price * c.qty)}`).join("\n")}\n\nSubtotal: ${formatKES(subtotal)}\nDelivery: ${formatKES(deliveryFee)}\nInstall: ${installFee ? formatKES(installFee) + ` (${installItemQty} items × KES 3,500)` : "—"}\nTotal: ${formatKES(total)}\n\nCustomer: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nAddress: ${form.address} ${form.location}\nNotes: ${form.notes}\n\nPlease confirm availability & installation cost.`;

  async function handlePlaceOrderCod(e: React.FormEvent) {
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
      router.push(`/checkout?success=1&order=${json.order?.id?.slice(0, 8) || ""}&method=cod`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMpesaPay() {
    if (!cart.length) return;
    if (!form.name || !mpesaPhone) {
      alert("Name and M-Pesa phone required");
      return;
    }
    let p = mpesaPhone.replace(/\s+/g, "").replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "");
    if (p.startsWith("+")) p = p.slice(1);
    if (p.startsWith("0")) p = "254" + p.slice(1);
    if (!/^254\d{9}$/.test(p)) {
      alert("Invalid M-Pesa phone. Use 07xx or 2547xxxxxxxx");
      return;
    }
    setStkLoading(true);
    setStkStatus("idle");
    setPollError(null);
    setStkData(null);

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ productId: c.productId, qty: c.qty, price: c.price })),
          phone: mpesaPhone,
          email: form.email,
          address: `${form.address} ${form.location}`.trim(),
          notes: `${form.notes}\n[Payment: M-Pesa STK Push to ${p} for ${formatKES(total)}]`.trim(),
          includeInstallation: form.includeInstall,
          deliveryFee,
          installationFee: installFee,
        }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderJson.error || "Order creation failed");
      const orderId = orderJson.order?.id;

      const stkRes = await fetch("/api/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: p, amount: total, orderId }),
      });
      const stkJson = await stkRes.json();
      if (!stkRes.ok) throw new Error(stkJson.error || "STK push failed");

      setStkData({ ...stkJson, orderId, phone: p, amount: total });
      setStkStatus("sent");

      let attempts = 0;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await fetch(`/api/mpesa/status?CheckoutRequestID=${stkJson.CheckoutRequestID}`);
          const statusJson = await statusRes.json();
          if (statusJson.status === "success") {
            if (pollRef.current) clearInterval(pollRef.current);
            setStkStatus("success");
            setStkLoading(false);
            clearCart();
            setStkData((prev: any) => ({ ...prev, receipt: statusJson.mpesaReceipt || statusJson.order?.mpesaRef, statusJson }));
          } else if (statusJson.status === "failed" || statusJson.status === "timeout") {
            if (pollRef.current) clearInterval(pollRef.current);
            setStkStatus("failed");
            setPollError(statusJson.message || "Payment failed or timed out.");
            setStkLoading(false);
          }
          if (attempts > 40) {
            if (pollRef.current) clearInterval(pollRef.current);
            setStkLoading(false);
            setPollError("Still pending — check your phone for M-Pesa prompt. We'll confirm via SMS.");
          }
        } catch (e) {}
      }, 2500);
    } catch (err: any) {
      setPollError(err.message);
      setStkStatus("failed");
    } finally {
      setStkLoading(false);
    }
  }

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const order = params.get("order");
    const method = params.get("method");
    if (success) {
      const isMpesa = method === "mpesa" || stkStatus === "success";
      return (
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className={`h-16 w-16 rounded-full grid place-items-center mx-auto text-2xl ${isMpesa ? "bg-green-600 text-white" : "bg-[#0038A0] text-white"}`}>
            {isMpesa ? <CheckCircle2 className="h-8 w-8" /> : "✓"}
          </div>
          <h1 className="text-2xl font-black mt-4">{isMpesa ? "Payment Successful!" : "Order Received!"}</h1>
          <p className="text-zinc-600 mt-2">{isMpesa ? `M-Pesa receipt: ${stkData?.receipt || params.get("receipt") || order || "—"}` : "We’ll call/WhatsApp you within 30 minutes to confirm."}</p>
          <p className="text-sm text-zinc-500 mt-1">Order ID: {order || stkData?.orderId?.slice(0, 8) || "—"} {stkData?.amount ? `• ${formatKES(stkData.amount)}` : ""}</p>
          {isMpesa && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-3">Your order is now CONFIRMED. We'll prepare delivery & installation. Check SMS for M-Pesa confirmation.</p>}
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link href="/shop"><Button variant="outline">Continue Shopping</Button></Link>
            <Link href="/dashboard"><Button>View Orders</Button></Link>
            <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank"><Button className="bg-[#25D366] hover:bg-[#20BD5A] text-white">Confirm on WhatsApp</Button></a>
          </div>
        </div>
      );
    }
  }

  if (stkStatus === "success") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="h-16 w-16 rounded-full bg-green-600 text-white grid place-items-center mx-auto"><CheckCircle2 className="h-8 w-8" /></div>
        <h1 className="text-2xl font-black mt-4">Payment Received!</h1>
        <p className="text-zinc-600 mt-2">M-Pesa confirmed • Receipt: <span className="font-mono font-bold">{stkData?.receipt || stkData?.mpesaReceipt || "MOCK..."}</span></p>
        <p className="text-sm text-zinc-500 mt-1">Order {stkData?.orderId?.slice(0, 8)} • {formatKES(stkData?.amount || total)} • {stkData?.phone}</p>
        <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-800 text-left">
          <p className="font-bold">What next?</p>
          <ul className="list-disc ml-5 mt-1 space-y-1 text-xs">
            <li>We’ll call you on {stkData?.phone} to confirm delivery</li>
            <li>Installation scheduled within 24h if selected</li>
            <li>5-year warranty activated</li>
          </ul>
        </div>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link href="/shop"><Button variant="outline">Shop More</Button></Link>
          <Button onClick={() => { setStkStatus("idle"); setStkData(null); router.push(`/checkout?success=1&order=${stkData?.orderId?.slice(0, 8)}&method=mpesa&receipt=${stkData?.receipt || ""}`); }}>View Order</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-[#0038A0] mb-4"><ArrowLeft className="h-4 w-4" /> Back to Cart</Link>
      <h1 className="text-2xl md:text-3xl font-black tracking-tight">Checkout</h1>
      <p className="text-sm text-zinc-500">M-Pesa STK Push • Pay on Delivery • WhatsApp — we confirm in 30 min.</p>

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
          <div className="space-y-6">
            <Card className="border-2 border-[#0038A0]/10">
              <div className="h-1 bg-[#0038A0]" />
              <CardHeader><CardTitle>Delivery Details</CardTitle><p className="text-sm text-zinc-500">Free delivery Nairobi &gt; KES 5k • Installation billed separately</p></CardHeader>
              <CardContent className="space-y-4">
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
                  <input type="checkbox" checked={form.includeInstall} onChange={(e) => setForm({ ...form, includeInstall: e.target.checked })} className="accent-[#0038A0] h-4 w-4" /> Include professional installation ({installItemQty ? `${installItemQty} item${installItemQty > 1 ? "s" : ""} × KES 3,500 = ${formatKES(installFee)}` : "KES 3,500 per item"} est.)
                </label>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#0038A0]/15">
              <div className="h-1 bg-[#0038A0]" />
              <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-[#0038A0]" /> Payment Method</CardTitle><p className="text-sm text-zinc-500">Choose how you want to pay — M-Pesa is instant, Pay on Delivery is cash on arrival.</p></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <button type="button" onClick={() => setPaymentMethod("mpesa")} className={`p-4 rounded-xl border-2 text-left transition ${paymentMethod === "mpesa" ? "border-[#0038A0] bg-[#F5F7FA] shadow-sm" : "border-zinc-200 hover:border-zinc-300 bg-white"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl grid place-items-center ${paymentMethod === "mpesa" ? "bg-[#0038A0] text-white" : "bg-zinc-100 text-zinc-600"}`}><Smartphone className="h-5 w-5" /></div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">M-Pesa STK Push</p>
                        <p className="text-xs text-zinc-500">Lipa na M-Pesa • Instant</p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border-2 grid place-items-center ${paymentMethod === "mpesa" ? "border-[#0038A0] bg-[#0038A0]" : "border-zinc-300"}`}>{paymentMethod === "mpesa" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}</div>
                    </div>
                    <p className="text-xs text-zinc-600 mt-2">Enter M-Pesa phone, tap Pay, then enter PIN on your phone. Works with real Daraja or mock demo.</p>
                  </button>

                  <button type="button" onClick={() => setPaymentMethod("cod")} className={`p-4 rounded-xl border-2 text-left transition ${paymentMethod === "cod" ? "border-[#0038A0] bg-[#F5F7FA] shadow-sm" : "border-zinc-200 hover:border-zinc-300 bg-white"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl grid place-items-center ${paymentMethod === "cod" ? "bg-[#0038A0] text-white" : "bg-zinc-100 text-zinc-600"}`}><Banknote className="h-5 w-5" /></div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">Pay on Delivery</p>
                        <p className="text-xs text-zinc-500">Cash / M-Pesa on arrival</p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border-2 grid place-items-center ${paymentMethod === "cod" ? "border-[#0038A0] bg-[#0038A0]" : "border-zinc-300"}`}>{paymentMethod === "cod" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}</div>
                    </div>
                    <p className="text-xs text-zinc-600 mt-2">Place order now, pay when rider arrives. We’ll confirm via call.</p>
                  </button>
                </div>

                {paymentMethod === "mpesa" ? (
                  <div className="space-y-4 border-2 border-green-200 bg-green-50/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-green-800"><Phone className="h-4 w-4" /> M-Pesa Phone for STK Push</div>
                    <div>
                      <Input value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} placeholder="07xx xxx xxx or 2547xxxxxxxx" className="bg-white border-green-300 focus:border-green-600" />
                      <p className="text-xs text-zinc-500 mt-1">We’ll send a push to this number for <span className="font-bold text-[#002070]">{formatKES(total)}</span>. Keep phone unlocked.</p>
                    </div>

                    {stkStatus === "sent" && (
                      <div className="bg-white border-2 border-amber-300 rounded-xl p-4 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0038A0]" />
                        <p className="font-bold mt-2">Check your phone!</p>
                        <p className="text-sm text-zinc-600">STK Push sent to <span className="font-mono font-bold">{stkData?.phone}</span> for {formatKES(stkData?.amount || total)}.</p>
                        <p className="text-xs text-zinc-500 mt-1">Enter M-Pesa PIN to complete. Waiting for confirmation… (auto-demo success in 8s if mock)</p>
                        <p className="text-xs font-mono text-zinc-400 mt-2">CheckoutRequestID: {stkData?.CheckoutRequestID?.slice(0, 16)}...</p>
                      </div>
                    )}

                    {pollError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{pollError}</p>}

                    <div className="grid grid-cols-1 gap-3">
                      <Button onClick={handleMpesaPay} disabled={stkLoading || stkStatus === "sent"} className="h-12 text-base bg-green-600 hover:bg-green-700 gap-2">
                        {stkLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending STK Push...</> : stkStatus === "sent" ? "Waiting for PIN..." : `Pay ${formatKES(total)} with M-Pesa`}
                      </Button>
                      <p className="text-xs text-center text-zinc-500">By paying you agree to 5-yr warranty. Mock mode auto-confirms for demo if no Daraja keys.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <form onSubmit={handlePlaceOrderCod} className="space-y-3">
                      <Button type="submit" disabled={loading} className="w-full h-12 text-base">{loading ? "Placing..." : `Place Order — ${formatKES(total)} (Pay on Delivery)`}</Button>
                      <p className="text-xs text-zinc-500 text-center">No payment now — we confirm first. You can also pay via M-Pesa on delivery.</p>
                    </form>
                  </div>
                )}

                <div className="border-t pt-3">
                  <p className="text-xs text-center text-zinc-500 mb-2">Or order instantly on WhatsApp</p>
                  <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer" className="block">
                    <Button type="button" className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white">Order on WhatsApp</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-24">
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
                  <div className="flex justify-between"><span className="text-zinc-500">Delivery</span><span className={deliveryFee === 0 ? "text-green-600 font-bold" : ""}>{deliveryFee === 0 ? "FREE" : formatKES(deliveryFee)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Installation est.</span><span>{installFee ? `${formatKES(installFee)} (${installItemQty}×KES 3,500)` : "—"}</span></div>
                  <div className="flex justify-between font-black text-base border-t pt-2 mt-2"><span>Total</span><span className="text-[#002070]">{formatKES(total)}</span></div>
                </div>
                <div className="bg-[#F5F7FA] border-2 border-[#0038A0]/10 rounded-xl p-3 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[#0038A0]" /> 5-year warranty • 24/7 support</p>
                  <p className="text-zinc-600">M-Pesa STK Push is instant and secure. You’ll get SMS receipt from M-Pesa.</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-center pt-2">
                  <div className="border rounded-lg p-2"><Truck className="h-4 w-4 mx-auto text-[#0038A0]" /><p className="font-semibold">Free Nairobi</p></div>
                  <div className="border rounded-lg p-2"><ShieldCheck className="h-4 w-4 mx-auto text-[#0038A0]" /><p className="font-semibold">5-Yr Warranty</p></div>
                  <div className="border rounded-lg p-2"><Smartphone className="h-4 w-4 mx-auto text-green-600" /><p className="font-semibold">M-Pesa</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
