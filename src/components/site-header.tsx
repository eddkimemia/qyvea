"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Heart, Menu, X, Phone, Search, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE, SERVICES } from "@/lib/constants";
import { useStore } from "@/lib/store";

const MOBILE_SECTIONS = [
  { key: "security", label: "Security", color: "#0038A0", filter: "Security" },
  { key: "power", label: "Power & Solar", color: "#0064D8", filter: "Power & Solar" },
  { key: "it", label: "IT & Networking", color: "#F00000", filter: "IT & Networking" },
  { key: "digital", label: "Digital & Creative", color: "#0038A0", filter: "Digital & Creative" },
  { key: "ict", label: "ICT Products", color: "#F00000", filter: null },
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  return (
    <>
    <header className="w-full">
      {/* Top bar — NOT sticky */}
      <div className="bg-[#002070] text-white text-xs border-b-2 border-[#F00000]">
        <div className="container mx-auto flex h-7 items-center justify-between px-4">
          <div className="hidden md:flex gap-3 overflow-hidden whitespace-nowrap">
            <span>CCTV Installation • Biometric Access • Solar • Electric Fencing • IT Support • Automatic Gates • Fire Alarm • Electrical • Smart Home • 24/7 Emergency</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Link href={`tel:${SITE.phone}`} className="flex items-center gap-1 hover:text-[#0038A0] transition"><Phone className="h-3 w-3" />{SITE.phone}</Link>
            <Link href={`https://wa.me/${SITE.whatsapp}`} target="_blank" className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-2.5 py-0.5 rounded-full font-bold text-xs transition hidden sm:flex items-center gap-1">
              <svg viewBox="0 0 32 32" className="h-3 w-3 fill-white"><path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z"/></svg>
              WhatsApp
            </Link>
            {/* Mobile: quote button on right side of top bar */}
            <Link href="/quote" className="sm:hidden bg-[#F00000] hover:bg-[#CC0000] text-white px-2 py-0.5 rounded-full font-bold text-[10px] transition">Quote</Link>
          </div>
        </div>
      </div>

      {/* Main nav — FIXED */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src="/syntechlogo.jpg" alt="Syntech Solutions" className="h-10 md:h-12 w-auto max-w-[160px] object-contain rounded-md" loading="eager" />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-0.5 text-sm font-medium">
              {[
                { label: "Security", filter: "Security" },
                { label: "Power & Solar", filter: "Power & Solar" },
                { label: "IT & Networking", filter: "IT & Networking" },
                { label: "Digital & Creative", filter: "Digital & Creative" },
              ].map(({ label, filter }) => (
                <div key={filter} className="relative group">
                  <button className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 font-medium ${SERVICES.filter(s=>s.cat===filter).some(s=>isActive(s.href)) ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>{label} <span className="text-[10px] opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
                  <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-64 mt-2 z-50 overflow-hidden">
                    <div className="p-2 space-y-1">
                      {SERVICES.filter(s=>s.cat===filter).map(s=><Link key={s.slug} href={s.href} className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm">{s.title}</Link>)}
                      {filter==="Power & Solar" && <><div className="border-t my-1" /><Link href="/services/maintenance" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] text-sm">Maintenance & Repair</Link></>}
                    </div>
                  </div>
                </div>
              ))}
              {/* ICT PRODUCTS */}
              <div className="relative group">
                <button className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 font-medium ${isActive("/shop?category=ICT") ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>ICT <span className="text-[10px] opacity-60 group-hover:rotate-180 transition-transform">▾</span></button>
                <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white border-2 border-[#0038A0]/10 rounded-xl shadow-xl w-52 mt-2 z-50 overflow-hidden">
                  <div className="p-2 space-y-1">
                    <Link href="/shop?category=ICT" className="block px-3 py-2 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-sm font-semibold">All ICT Products</Link>
                    <div className="border-t my-1" />
                    {["Monitors","Laptops","Desktops","Printers","Peripherals","UPS & Power","Networking","Docking Stations"].map(l=>(
                      <Link key={l} href={`/shop?category=ICT&q=${l.toLowerCase().split(" ")[0]}`} className="block px-3 py-1.5 rounded-lg hover:bg-[#F5F7FA] hover:text-[#002070] text-xs">{l}</Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/shop" className={`px-2.5 py-1.5 rounded-lg transition font-medium ${isActive("/shop") ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>Shop</Link>
              <Link href="/blog" className={`px-2.5 py-1.5 rounded-lg transition ${isActive("/blog") ? "bg-[#0038A0] text-white" : "hover:bg-[#F5F7FA] hover:text-[#0038A0]"}`}>Blog</Link>
            </nav>

            {/* Right side — search, wishlist, cart, auth, quote */}
            <div className="flex items-center gap-0.5">
              {/* Search toggle */}
              <Button variant="ghost" size="icon" className="hover:text-[#0038A0] h-9 w-9" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="h-4 w-4" />
              </Button>
              {/* Wishlist */}
              <Link href="/wishlist" className="relative hidden sm:flex">
                <Button variant="ghost" size="icon" className="hover:text-[#0038A0] relative h-9 w-9">
                  <Heart className="h-4 w-4" />
                  {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-[#0038A0] text-white text-[8px] font-bold rounded-full h-3.5 w-3.5 grid place-items-center">{wishlist.length}</span>}
                </Button>
              </Link>
              {/* Cart */}
              <Link href="/cart"><Button variant="ghost" size="icon" className="relative hover:text-[#0038A0] h-9 w-9">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-[#F00000] text-white text-[8px] font-bold rounded-full h-3.5 w-3.5 grid place-items-center">{cartCount}</span>}
              </Button></Link>
              {/* Quote button — desktop */}
              <Link href="/quote" className="hidden sm:inline-flex"><Button size="sm" className="hidden lg:inline-flex h-8 text-xs">Get Quote</Button></Link>
              {/* Auth */}
              {session?.user ? (
                <>
                  {(session.user as any).role === "ADMIN" ? (
                    <Link href="/admin" className="hidden lg:inline-flex"><Button variant="secondary" size="sm" className="bg-[#002070] text-white hover:bg-black h-8 text-xs"><User className="h-3 w-3" /> Dashboard</Button></Link>
                  ) : (
                    <span className="hidden lg:flex items-center gap-1 text-xs font-medium max-w-[100px] truncate"><User className="h-3 w-3" /> {(session.user as any).email?.split("@")[0]}</span>
                  )}
                  <Button variant="ghost" size="sm" className="hidden lg:inline-flex h-8 text-xs" onClick={() => signOut({ callbackUrl: "/" })}><LogOut className="h-3 w-3" /></Button>
                </>
              ) : (
                <Link href="/login" className="hidden lg:inline-flex"><Button variant="secondary" size="sm" className="h-8 text-xs"><User className="h-3 w-3" /> Sign In</Button></Link>
              )}
              {/* Hamburger */}
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
            </div>
          </div>
        </div>

        {/* Inline search bar — slides down when search icon clicked */}
        {searchOpen && (
          <div className="border-t bg-[#F5F7FA]/80">
            <div className="container mx-auto px-4 py-2">
              <form onSubmit={handleSearch} className="relative max-w-xl mx-auto flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input placeholder="Search CCTV, solar, biometrics, ICT products..." className="pl-10 pr-4 bg-white border-[#0038A0]/20 focus:border-[#0038A0] h-9 text-sm" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
                </div>
                <Button type="submit" size="sm" className="h-9 px-4">Search</Button>
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(false)}><X className="h-4 w-4" /></Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 lg:hidden overflow-y-auto pt-2">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <button onClick={() => { setMobileOpen(false); router.push("/"); }} className="text-left"><img src="/syntechlogo.jpg" alt="Syntech" className="h-8 object-contain" /></button>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></Button>
            </div>
            <div className="px-4 py-3 space-y-1">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input placeholder="Search..." className="pl-10 text-sm h-9" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <Button type="submit" size="sm" className="h-9">Go</Button>
              </form>

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
                        className="flex-1 py-2 text-sm font-medium"
                      >
                        {section.label}
                      </Link>
                      <button onClick={() => toggleSection(section.key)} className="p-2 rounded-lg hover:bg-zinc-100 transition" aria-label={`Toggle ${section.label}`}>
                        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="pl-3 border-l-2 ml-2 space-y-0.5 mb-2" style={{ borderColor: section.color + "40" }}>
                        {services && services.map((s) => (
                          <Link key={s.slug} href={s.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-zinc-600 hover:text-[#002070]">{s.title}</Link>
                        ))}
                        {services && section.key === "power" && (
                          <Link href="/services/maintenance" onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-zinc-600 hover:text-[#002070]">Maintenance & Repair</Link>
                        )}
                        {ictLinks && ictLinks.map((link) => (
                          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-zinc-600 hover:text-[#002070]">{link.label}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">Blog</Link>

              <div className="border-t pt-3 mt-2 space-y-2">
                <Link href="/quote" onClick={() => setMobileOpen(false)} className="block"><Button className="w-full bg-[#F00000] hover:bg-[#CC0000]">Get Free Quote</Button></Link>
                {session?.user ? (
                  <>
                    {(session.user as any).role === "ADMIN" && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-semibold text-[#F00000]">Dashboard</Link>}
                    <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }} className="block py-2 text-left text-sm w-full">Sign Out ({(session.user as any).email})</button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-semibold">Sign In</Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}


    </header>
    {/* Spacer for fixed nav */}
    <div className="h-16" />
    </>
  );
}
