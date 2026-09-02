"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Heart, Menu, X, Phone, Search, User, Trash2, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE, SERVICES } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { formatKES } from "@/lib/utils";

const MOBILE_SECTIONS = [
  { key: "security", label: "Security", color: "#0038A0", filter: "Security" },
  { key: "power", label: "Power & Solar", color: "#0064D8", filter: "Power & Solar" },
  { key: "it", label: "IT & Networking", color: "#F00000", filter: "IT & Networking" },
  { key: "digital", label: "Digital & Creative", color: "#0038A0", filter: "Digital & Creative" },
  { key: "ict", label: "ICT Products", color: "#F00000", filter: null },
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
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

  const toggleSection = (key: string) => {
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-950 dark:border-zinc-800">
      {/* Top bar */}
      <div className="bg-[#002070] text-white text-xs border-b-2 border-[#F00000]">
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
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/syntechlogo.jpg" alt="Syntech Solutions" className="h-12 md:h-14 w-auto max-w-[190px] object-contain rounded-md" loading="eager" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link href="/shop" className={`px-3 py-2 rounded-lg transition font-medium ${isActive("/shop") ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>Shop</Link>
            {/* SECURITY */}
            <div className="relative group">
              <button className={`px-3 py-2 rounded-lg transition flex items-center gap-1 font-medium ${SERVICES.filter(s=>s.cat==="Security").some(s=>isActive(s.href)) ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>Security <span className="text-xs opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-64 mt-2 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  {SERVICES.filter(s=>s.cat==="Security").map(s=><Link key={s.slug} href={s.href} className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">{s.title}</Link>)}
                </div>
              </div>
            </div>
            {/* POWER & SOLAR */}
            <div className="relative group">
              <button className={`px-3 py-2 rounded-lg transition flex items-center gap-1 font-medium ${SERVICES.filter(s=>s.cat==="Power & Solar").some(s=>isActive(s.href)) ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>Power & Solar <span className="text-xs opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-72 mt-2 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  {SERVICES.filter(s=>s.cat==="Power & Solar").map(s=><Link key={s.slug} href={s.href} className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">{s.title}</Link>)}
                  <div className="border-t my-1" />
                  <Link href="/services/maintenance" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] text-sm">Maintenance & Repair</Link>
                </div>
              </div>
            </div>
            {/* IT & NETWORKING */}
            <div className="relative group">
              <button className={`px-3 py-2 rounded-lg transition flex items-center gap-1 font-medium ${SERVICES.filter(s=>s.cat==="IT & Networking").some(s=>isActive(s.href)) ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>IT & Networking <span className="text-xs opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-72 mt-2 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  {SERVICES.filter(s=>s.cat==="IT & Networking").map(s=><Link key={s.slug} href={s.href} className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">{s.title}</Link>)}
                </div>
              </div>
            </div>
            {/* DIGITAL & CREATIVE */}
            <div className="relative group">
              <button className={`px-3 py-2 rounded-lg transition flex items-center gap-1 font-medium ${SERVICES.filter(s=>s.cat==="Digital & Creative").some(s=>isActive(s.href)) ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>Digital & Creative <span className="text-xs opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-72 mt-2 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  {SERVICES.filter(s=>s.cat==="Digital & Creative").map(s=><Link key={s.slug} href={s.href} className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">{s.title}</Link>)}
                </div>
              </div>
            </div>
            {/* ICT PRODUCTS */}
            <div className="relative group">
              <button className={`px-3 py-2 rounded-lg transition flex items-center gap-1 font-medium ${isActive("/shop?category=ICT") ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>ICT Products <span className="text-xs opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-56 mt-2 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  <Link href="/shop?category=ICT" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm font-semibold">All ICT Products</Link>
                  <div className="border-t my-1" />
                  <Link href="/shop?category=ICT&q=monitor" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">Monitors</Link>
                  <Link href="/shop?category=ICT&q=laptop" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">Laptops</Link>
                  <Link href="/shop?category=ICT&q=desktop" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">Desktops</Link>
                  <Link href="/shop?category=ICT&q=printer" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">Printers</Link>
                  <Link href="/shop?category=ICT&q=keyboard" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">Peripherals</Link>
                  <Link href="/shop?category=ICT&q=headset" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">Headsets & Webcams</Link>
                  <Link href="/shop?category=ICT&q=ssd" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">Storage</Link>
                  <Link href="/shop?category=ICT&q=UPS" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">UPS & Power</Link>
                  <Link href="/shop?category=ICT&q=router" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">Networking</Link>
                  <Link href="/shop?category=ICT&q=dock" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">Docking Stations</Link>
                </div>
              </div>
            </div>
            <Link href="/blog" className={`px-3 py-2 rounded-lg transition ${isActive("/blog") ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>Blog</Link>
          </nav>

          {/* Desktop right — only auth + hamburger */}
          <div className="hidden lg:flex items-center gap-1">
            {session?.user ? (
              <>
                {(session.user as any).role === "ADMIN" ? (
                  <Link href="/admin"><Button variant="secondary" size="sm" className="bg-[#002070] text-white hover:bg-black"><User className="h-4 w-4" /> Dashboard</Button></Link>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium max-w-[120px] truncate"><User className="h-4 w-4" /> {(session.user as any).email?.split("@")[0]}</span>
                )}
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}><LogOut className="h-4 w-4" /> Out</Button>
              </>
            ) : (
              <Link href="/login"><Button variant="secondary" size="sm"><User className="h-4 w-4" /> Sign In</Button></Link>
            )}
          </div>

          {/* Mobile right — hamburger only */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}</Button>
        </div>
      </div>

      {/* Search bar row — desktop: search + cart/wishlist/quote side by side */}
      <div className="border-t bg-[#F5F7FA]/70">
        <div className="container mx-auto px-4 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input placeholder="Search CCTV, solar, biometrics, gates, ICT products..." className="pl-10 pr-20 bg-white border-[#0038A0]/20 focus:border-[#0038A0] h-10 shadow-sm" value={query} onChange={(e) => setQuery(e.target.value)} />
              <Button type="submit" size="sm" className="absolute right-1 top-1 h-8 px-5">Search</Button>
            </form>
            {/* Desktop actions next to search */}
            <div className="hidden lg:flex items-center gap-1">
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
              <Link href="#contact"><Button size="sm">Get Free Quote</Button></Link>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile menu — accordion style */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="absolute top-full left-0 right-0 bg-white border-t-2 border-[#F00000] shadow-2xl z-50 lg:hidden max-h-[85vh] overflow-y-auto">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="block py-2.5 font-medium text-sm">Shop</Link>

              {MOBILE_SECTIONS.map((section) => {
                const isOpen = expandedSection === section.key;
                const services = section.filter ? SERVICES.filter((s) => s.cat === section.filter) : null;
                const ictLinks = section.key === "ict" ? [
                  { label: "All ICT Products", href: "/shop?category=ICT" },
                  { label: "Monitors", href: "/shop?category=ICT&q=monitor" },
                  { label: "Laptops", href: "/shop?category=ICT&q=laptop" },
                  { label: "Desktops", href: "/shop?category=ICT&q=desktop" },
                  { label: "Printers", href: "/shop?category=ICT&q=printer" },
                  { label: "Peripherals", href: "/shop?category=ICT&q=keyboard" },
                  { label: "UPS & Power", href: "/shop?category=ICT&q=UPS" },
                  { label: "Networking", href: "/shop?category=ICT&q=router" },
                  { label: "Docking Stations", href: "/shop?category=ICT&q=dock" },
                ] : null;

                return (
                  <div key={section.key}>
                    <div className="flex items-center">
                      <Link
                        href={services ? `/services/${services[0].slug}` : (ictLinks ? "/shop?category=ICT" : "#")}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 py-2.5 text-sm font-medium"
                      >
                        {section.label}
                      </Link>
                      <button
                        onClick={() => toggleSection(section.key)}
                        className="p-2 rounded-lg hover:bg-zinc-100 transition"
                        aria-label={`Toggle ${section.label}`}
                      >
                        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="pl-3 border-l-2 ml-2 space-y-0.5 mb-2" style={{ borderColor: section.color + "40" }}>
                        {services && services.map((s) => (
                          <Link key={s.slug} href={s.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-zinc-600 hover:text-[#002070]">
                            {s.title}
                          </Link>
                        ))}
                        {services && section.key === "power" && (
                          <Link href="/services/maintenance" onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-zinc-600 hover:text-[#002070]">
                            Maintenance & Repair
                          </Link>
                        )}
                        {ictLinks && ictLinks.map((link) => (
                          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-zinc-600 hover:text-[#002070]">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium">Blog</Link>

              <div className="border-t pt-3 mt-2 space-y-2">
                {session?.user ? (
                  <>
                    {(session.user as any).role === "ADMIN" && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-semibold text-[#F00000]">Dashboard</Link>}
                    <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }} className="block py-2 text-left text-sm w-full">Sign Out ({(session.user as any).email})</button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-semibold">Sign In</Link>
                )}
                <Link href="#contact" onClick={() => setMobileOpen(false)} className="block"><Button className="w-full bg-[#F00000] hover:bg-[#CC0000]">Get Free Quote</Button></Link>
              </div>
            </div>
          </div>
        </>
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
      {/* Mobile bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t-2 border-[#002070] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-3 gap-0">
          <Link href="/shop" className="flex flex-col items-center justify-center py-2.5 hover:bg-[#F5F7FA] transition">
            <div className="relative">
              <Heart className="h-5 w-5 text-[#002070]" />
              {wishlist.length > 0 && <span className="absolute -top-1.5 -right-2 bg-[#0038A0] text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 grid place-items-center">{wishlist.length}</span>}
            </div>
            <span className="text-[10px] font-semibold text-zinc-600 mt-0.5">Wishlist</span>
          </Link>
          <button onClick={() => setCartOpen(true)} className="flex flex-col items-center justify-center py-2.5 hover:bg-[#F5F7FA] transition">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-[#002070]" />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-2 bg-[#F00000] text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 grid place-items-center">{cartCount}</span>}
            </div>
            <span className="text-[10px] font-semibold text-zinc-600 mt-0.5">Cart</span>
          </button>
          <a href="#contact" className="flex flex-col items-center justify-center py-2.5 bg-[#002070] hover:bg-[#0038A0] transition">
            <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white"><path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z"/></svg>
            <span className="text-[10px] font-semibold text-white mt-0.5">Get Quote</span>
          </a>
        </div>
      </div>
      {/* Spacer for mobile bottom bar */}
      <div className="h-16 lg:hidden" />
    </header>
  );
}
