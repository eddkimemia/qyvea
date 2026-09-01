"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Heart, Menu, X, Phone, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE, SERVICES } from "@/lib/constants";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-950 dark:border-zinc-800">
      {/* Top bar — black secondary with lime accent */}
      <div className="bg-[#0A0A0A] text-white text-xs border-b-2 border-[#7FAF25]">
        <div className="container mx-auto flex h-7 items-center justify-between px-4">
          <div className="hidden md:flex gap-3 overflow-hidden whitespace-nowrap">
            <span>CCTV Installation • Biometric Access • Solar • Electric Fencing • IT Support • Automatic Gates • Fire Alarm • Electrical • Smart Home • 24/7 Emergency</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link href={`tel:${SITE.phone}`} className="flex items-center gap-1 hover:text-[#7FAF25] transition"><Phone className="h-3 w-3" />{SITE.phone}</Link>
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
          <Link href="/" className="flex items-center">
            {/* Placeholder logo image — no words, brand lime/black */}
            <img
              src="/logo.svg"
              alt="Qyvea"
              className="h-9 w-auto max-w-[140px] object-contain"
              loading="eager"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#7FAF25] transition">Home</Link>
            <Link href="/shop" className="hover:text-[#7FAF25] transition">Shop</Link>
            <div className="relative group">
              <button className="hover:text-[#7FAF25] transition">Services ▾</button>
              <div className="absolute left-1/2 top-full hidden group-hover:grid grid-cols-3 gap-6 p-6 bg-white border rounded-xl shadow-xl w-[720px] max-w-[calc(100vw-2rem)] -translate-x-1/2 mt-2 z-50 overflow-hidden">
                <div>
                  <p className="font-semibold text-xs uppercase tracking-widest text-zinc-500 mb-3">Security</p>
                  <div className="space-y-2 text-sm">
                    {SERVICES.filter(s=>s.cat==="Security").map(s=><Link key={s.slug} href={s.href} className="block hover:text-zinc-900">{s.title}</Link>)}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-xs uppercase tracking-widest text-zinc-500 mb-3">IT & Networking</p>
                  <div className="space-y-2 text-sm">
                    {SERVICES.filter(s=>s.cat==="IT & Networking").map(s=><Link key={s.slug} href={s.href} className="block hover:text-zinc-900">{s.title}</Link>)}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-xs uppercase tracking-widest text-zinc-500 mb-3">Power & Solar</p>
                  <div className="space-y-2 text-sm">
                    {SERVICES.filter(s=>s.cat==="Power & Solar").map(s=><Link key={s.slug} href={s.href} className="block hover:text-zinc-900">{s.title}</Link>)}
                    <Link href="/services/maintenance" className="block hover:text-zinc-900">Maintenance & Repair</Link>
                    <Link href="/estates" className="block hover:text-zinc-900">Estate Solutions</Link>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/about" className="hover:text-zinc-600">About</Link>
            <Link href="/estates" className="hover:text-zinc-600">Estates</Link>
          </nav>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input placeholder="Search products, services..." className="pl-9" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/shop?view=wishlist"><Button variant="ghost" size="icon" className="hover:text-[#7FAF25]"><Heart className="h-5 w-5" /></Button></Link>
            <Link href="/shop?view=cart"><Button variant="ghost" size="icon" className="relative hover:text-[#7FAF25]"><ShoppingCart className="h-5 w-5" /><span className="absolute -top-1 -right-1 bg-[#7FAF25] text-black text-[10px] font-bold rounded-full h-4 w-4 grid place-items-center">0</span></Button></Link>
            <Link href="/login" className="hidden sm:inline-flex"><Button variant="secondary" size="sm"><User className="h-4 w-4" /> Sign In</Button></Link>
            <Link href="#contact"><Button size="sm" className="hidden sm:inline-flex">Get Free Quote</Button></Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}</Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t py-4 space-y-3">
            <Link href="/" className="block py-2">Home</Link>
            <Link href="/shop" className="block py-2">Shop</Link>
            <Link href="/services/cctv" className="block py-2">CCTV</Link>
            <Link href="/services/biometrics" className="block py-2">Biometrics</Link>
            <Link href="/services/electric-fence" className="block py-2">Electric Fence</Link>
            <Link href="/estates" className="block py-2">Estate Solutions</Link>
            <Link href="/about" className="block py-2">About</Link>
            <Link href="#contact" className="block"><Button className="w-full">Get Free Quote</Button></Link>
          </div>
        )}
      </div>
    </header>
  );
}
