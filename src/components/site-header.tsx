"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Heart, Menu, X, Phone, Search, User, Trash2, Minus, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE, SERVICES } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { formatKES } from "@/lib/utils";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/shop?q=${encodeURIComponent(query.trim())}` as any);
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-950 dark:border-zinc-800">
      {/* Top bar — black secondary with lime accent */}
      <div className="bg-[#002070] text-white text-xs border-b-2 border-[#0038A0]">
        <div className="container mx-auto flex h-7 items-center justify-between px-4">
          <div className="hidden md:flex gap-3 overflow-hidden whitespace-nowrap">
            <span>CCTV Installation • Biometric Access • Solar • Electric Fencing • IT Support • Automatic Gates • Fire Alarm • Electrical • Smart Home • 24/7 Emergency</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link href={`tel:${SITE.phone}`} className="flex items-center gap-1 hover:text-[#0038A0] transition"><Phone className="h-3 w-3" />{SITE.phone}</Link>
            <Link href={`https://wa.me/${SITE.whatsapp}`} target="_blank" className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-2.5 py-0.5 rounded-full font-bold text-xs transition flex items-center gap-1">
              <svg viewBox="0 0 32 32" className="h-3 w-3 fill-white" aria-hidden="true"><path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z"/></svg>
              WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            {/* Syntech logo — no words, brand blue */}
            <img
              src="/syntechlogo.jpg"
              alt="Syntech Solutions"
              className="h-9 w-auto max-w-[160px] object-contain rounded-md"
              loading="eager"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link href="/shop" className="px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#0038A0] transition">Shop</Link>
            {/* SECURITY ▼ */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#0038A0] transition flex items-center gap-1 font-medium">Security <span className="text-xs opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-64 mt-2 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  {SERVICES.filter(s=>s.cat==="Security").map(s=><Link key={s.slug} href={s.href} className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">{s.title}</Link>)}
                </div>
              </div>
            </div>
            {/* IT & NETWORKING ▼ */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#0038A0] transition flex items-center gap-1 font-medium">IT & Networking <span className="text-xs opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-72 mt-2 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  {SERVICES.filter(s=>s.cat==="IT & Networking").map(s=><Link key={s.slug} href={s.href} className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">{s.title}</Link>)}
                </div>
              </div>
            </div>
            {/* POWER & SOLAR ▼ */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#0038A0] transition flex items-center gap-1 font-medium">Power & Solar <span className="text-xs opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-72 mt-2 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  {SERVICES.filter(s=>s.cat==="Power & Solar").map(s=><Link key={s.slug} href={s.href} className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">{s.title}</Link>)}
                  <div className="border-t my-1" />
                  <Link href="/services/maintenance" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] text-sm">Maintenance & Repair</Link>
                  <Link href="/estates" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] text-sm font-medium text-[#0038A0]">Estate Solutions</Link>
                </div>
              </div>
            </div>
            <Link href="/estates" className="px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#0038A0] transition">Estates</Link>
            <Link href="/about" className="px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#0038A0] transition">About</Link>
            <Link href="/blog" className="px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#0038A0] transition">Blog</Link>
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/shop" className="relative">
              <Button variant="ghost" size="icon" className="hover:text-[#0038A0] relative">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-[#0038A0] text-white text-[10px] font-bold rounded-full h-4 w-4 grid place-items-center">{wishlist.length}</span>}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative hover:text-[#0038A0]" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#0038A0] text-white text-[10px] font-bold rounded-full h-4 w-4 grid place-items-center">{cartCount}</span>}
            </Button>
            {session?.user ? (
              <>
                {(session.user as any).role === "ADMIN" ? (
                  <Link href="/admin" className="hidden sm:inline-flex"><Button variant="secondary" size="sm" className="bg-[#002070] text-white hover:bg-black"><User className="h-4 w-4" /> Dashboard</Button></Link>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium max-w-[120px] truncate"><User className="h-4 w-4" /> {(session.user as any).email?.split("@")[0]}</span>
                )}
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => signOut({ callbackUrl: "/" })}><LogOut className="h-4 w-4" /> Out</Button>
              </>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex"><Button variant="secondary" size="sm"><User className="h-4 w-4" /> Sign In</Button></Link>
            )}
            <Link href="#contact"><Button size="sm" className="hidden sm:inline-flex">Get Free Quote</Button></Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}</Button>
          </div>
        </div>
      </div>
      {/* Search below nav — full width */}
      <div className="border-t bg-[#F5F7FA]/70">
        <div className="container mx-auto px-4 py-2.5">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input placeholder="Search CCTV, solar, biometrics, gates... (39 products)" className="pl-10 pr-20 bg-white border-[#0038A0]/20 focus:border-[#0038A0] h-10 shadow-sm" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button type="submit" size="sm" className="absolute right-1 top-1 h-8 px-5">Search</Button>
          </form>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="container mx-auto px-4 lg:hidden border-t py-4 space-y-3">
          <Link href="/shop" className="block py-2 font-medium">Shop</Link>
          <div className="pl-2 border-l-2 border-[#0038A0]/20 ml-1 space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0038A0]">Services</p>
            <Link href="/services/cctv" className="block py-1.5 text-sm">CCTV Installation</Link>
            <Link href="/services/biometrics" className="block py-1.5 text-sm">Biometric Access</Link>
            <Link href="/services/electric-fence" className="block py-1.5 text-sm">Electric Fence</Link>
            <Link href="/services/automatic-gates" className="block py-1.5 text-sm">Automatic Gates</Link>
            <Link href="/services/networking" className="block py-1.5 text-sm">Networking</Link>
            <Link href="/services/solar-installation" className="block py-1.5 text-sm">Solar</Link>
          </div>
          <Link href="/estates" className="block py-2">Estate Solutions</Link>
          <Link href="/about" className="block py-2">About</Link>
          <Link href="/blog" className="block py-2">Blog</Link>
          {session?.user ? (
            <>
              {(session.user as any).role === "ADMIN" && <Link href="/admin" className="block py-2 font-semibold text-[#0038A0]">Dashboard</Link>}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block py-2 text-left w-full">Sign Out ({(session.user as any).email})</button>
            </>
          ) : (
            <Link href="/login" className="block py-2 font-semibold">Sign In</Link>
          )}
          <Link href="#contact" className="block"><Button className="w-full">Get Free Quote</Button></Link>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-[100vh] shadow-2xl flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-[#002070] text-white">
              <h3 className="font-black flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-[#0038A0]" /> Cart ({cartCount})</h3>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setCartOpen(false)}><X className="h-5 w-5" /></Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto text-zinc-300" />
                  <p className="font-semibold mt-3">Your cart is empty</p>
                  <p className="text-sm text-zinc-500">Add products to get a quote via WhatsApp</p>
                  <Link href="/shop" onClick={() => setCartOpen(false)}><Button className="mt-4">Browse Shop</Button></Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.productId}-${item.slug}`} className="flex gap-3 border rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.slug} • Qty: {item.qty}</p>
                      <p className="font-bold text-sm text-[#002070]">{formatKES(item.price)} × {item.qty} = {formatKES(item.price * item.qty)}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.productId)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-3 bg-zinc-50">
                <div className="flex justify-between font-black text-lg"><span>Total</span><span className="text-[#002070]">{formatKES(cartTotal)}</span></div>
                <p className="text-xs text-zinc-500">Free delivery Nairobi &gt; KES 5k • Installation billed separately</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={clearCart} className="w-full">Clear</Button>
                  <Link href="/checkout" onClick={() => setCartOpen(false)}><Button className="w-full">Checkout</Button></Link>
                </div>
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hello Syntech! I want to order:\n\n${cart.map((c) => `• ${c.name} × ${c.qty} = ${formatKES(c.price * c.qty)}`).join("\n")}\n\nTotal: ${formatKES(cartTotal)}\n\nPlease confirm availability & delivery to [my location].`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2 h-11">
                    <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white"><path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z"/></svg>
                    Order on WhatsApp
                  </Button>
                </a>
                <p className="text-[11px] text-center text-zinc-400">Instant quote • No payment now • 5-yr warranty</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
