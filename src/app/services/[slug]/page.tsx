import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";

const SERVICES: Record<string, { title: string; desc: string; bullets: string[]; priceFrom: string; image: string }> = {
  cctv: { title: "CCTV Surveillance Systems Kenya", desc: "Professional CCTV, remote monitoring & analytics. Dome, bullet & PTZ.", bullets: ["Site assessment & planning","Camera mounting & setup","System configuration","Client training & handover"], priceFrom: "KES 25,000", image: IMAGES.services.cctv },
  biometrics: { title: "Biometric Access Control", desc: "Fingerprint, face & card access for offices & homes.", bullets: ["Fingerprint readers","Face recognition","Card & PIN backup","Time attendance"], priceFrom: "KES 18,000", image: IMAGES.services.biometric },
  "electric-fence": { title: "Electric Fencing", desc: "Perimeter security with energizer, alarm & monitoring.", bullets: ["Energizer & battery","Perimeter wiring","Alarm & siren","Monitoring integration"], priceFrom: "KES 45,000", image: IMAGES.products.energizer },
  "automatic-gates": { title: "Automatic Gates", desc: "Swing/sliding automation with remote & intercom.", bullets: ["Sliding & swing","Remote & keypad","Intercom integration","Safety sensors"], priceFrom: "KES 85,000", image: IMAGES.products.gate },
  "fire-alarm-systems": { title: "Fire Alarm Systems", desc: "Addressable & conventional detection for compliance.", bullets: ["Control panels","Smoke & heat detectors","Sounders & beacons","Compliance certificate"], priceFrom: "KES 35,000", image: IMAGES.products.fire },
  networking: { title: "Networking & Structured Cabling", desc: "LAN, fiber, WiFi, racks & points.", bullets: ["Cat6/Cat6A & fiber","Patch panels & racks","WiFi design","Testing & labeling"], priceFrom: "KES 15,000", image: IMAGES.services.networking },
  "smart-home-automation": { title: "Smart Home Automation", desc: "Lights, locks, curtains, voice control.", bullets: ["Smart locks","Lighting & curtains","Voice assistants","App control"], priceFrom: "KES 40,000", image: IMAGES.services.smartHome },
  "solar-installation": { title: "Solar Installation", desc: "On-grid, off-grid, hybrid for homes & biz.", bullets: ["Site survey & design","Panels & inverters","Batteries","Net metering"], priceFrom: "KES 95,000", image: IMAGES.services.solar },
  "solar-solutions": { title: "Solar Backup Solutions", desc: "Keep CCTV/fence/lights on during blackouts.", bullets: ["3KVA to 10KVA","Lithium & lead-acid","Auto changeover","5-year warranty"], priceFrom: "KES 85,000", image: IMAGES.services.solar },
  "electrical-installation": { title: "Electrical Installation", desc: "Wiring, DBs, compliance & testing.", bullets: ["Wiring & DBs","Earthing & testing","EPRA compliance","COC certificate"], priceFrom: "KES 12,000", image: IMAGES.products.electrical },
  bms: { title: "Building Management System", desc: "Centralized control for large facilities.", bullets: ["HVAC & lighting","Access & CCTV","Energy monitoring","Single dashboard"], priceFrom: "KES 150,000", image: IMAGES.services.networking },
  cybersecurity: { title: "Cybersecurity", desc: "Audit, firewall, endpoint protection.", bullets: ["Vulnerability audit","Firewall & VPN","Endpoint protection","Staff training"], priceFrom: "KES 20,000", image: IMAGES.hero.tech },
  "system-integration": { title: "System Integration", desc: "Unify security, IT & power systems.", bullets: ["Unified dashboard","API integration","Automation rules","Single support SLA"], priceFrom: "KES 30,000", image: IMAGES.hero.server },
  "it-support": { title: "IT Support", desc: "Helpdesk, maintenance, uptime SLA.", bullets: ["On-site & remote","Server & network","Backup & recovery","SLA 2hr response"], priceFrom: "KES 8,000", image: IMAGES.services.maintenance },
  "website-design": { title: "Website Design", desc: "Modern, SEO-ready, M-Pesa integrated websites that convert visitors into customers.", bullets: ["Figma to Next.js", "SEO + sitemap + JSON-LD", "M-Pesa & shop integration", "Blog CMS & training"], priceFrom: "KES 35,000", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" },
  "graphic-design": { title: "Graphic Design", desc: "Logos, brand identity, social and print that make you memorable — FKI tested.", bullets: ["Logo + brand sheet", "Social kit + mockups", "Print & packaging", "Files: SVG/PNG/PDF"], priceFrom: "KES 8,000", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80" },
  "ai-solutions": { title: "AI Solutions", desc: "Chatbots, automation, analytics — practical AI for Kenyan SMEs, hosted on your stack.", bullets: ["WhatsApp bot for quotes", "Blog AI drafts", "Vision for shoplifting", "No monthly GPT bills"], priceFrom: "KES 45,000", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" },
  maintenance: { title: "Maintenance & Repair", desc: "24/7 support, 2hr response Nairobi/Msa/Ksm.", bullets: ["Preventive maintenance","Emergency call-out","Spare parts","Health reports"], priceFrom: "KES 3,000", image: IMAGES.services.maintenance },
};

export const dynamic = "force-dynamic";

const SERVICE_CATEGORY_MAP: Record<string, string> = {
  cctv: "CCTV",
  biometrics: "BIOMETRICS",
  "electric-fence": "ELECTRIC_FENCE",
  "automatic-gates": "GATE_AUTOMATION",
  "fire-alarm-systems": "FIRE_ALARM",
  networking: "NETWORKING",
  "smart-home-automation": "SMART_HOME",
  "solar-installation": "SOLAR",
  "solar-solutions": "SOLAR",
  "electrical-installation": "ELECTRICAL",
  bms: "ACCESS_CONTROL",
  cybersecurity: "IT_SUPPORT",
  "system-integration": "IT_SUPPORT",
  "it-support": "IT_SUPPORT",
  "website-design": "IT_SUPPORT",
  "graphic-design": "ACCESSORIES",
  "ai-solutions": "IT_SUPPORT",
  maintenance: "ACCESSORIES",
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = SERVICES[slug];
  if (!svc) return notFound();

  const category = SERVICE_CATEGORY_MAP[slug];
  let relatedProducts: any[] = [];
  if (category) {
    try {
      relatedProducts = await prisma.product.findMany({
        where: { category: category as any, active: true },
        take: 4,
        orderBy: { sold: "desc" },
      });
    } catch {
      relatedProducts = [];
    }
  }
  // Fallback mock if DB empty — pick from seed-like data
  if (!relatedProducts.length && category) {
    const mockByCat: Record<string, any[]> = {
      CCTV: [
        { id: "m1", name: "Hikvision 4CH DVR Kit - 4 Bullet Cameras 1080p + 1TB", slug: "hikvision-4ch-kit-4bullet-1080p", category: "CCTV", price: 28500, oldPrice: 32000, rating: 4.7, reviewsCount: 34, inStock: true, badge: "HOT", installationAvailable: true },
        { id: "m2", name: "Hikvision PTZ 4MP 25x Zoom", slug: "hikvision-ptz-4mp-25x", category: "CCTV", price: 68000, rating: 4.8, reviewsCount: 19, inStock: true, installationAvailable: true },
      ],
      SOLAR: [
        { id: "m3", name: "Solar Backup Kit 3KVA Inverter + 2x200Ah", slug: "solar-backup-3kva-200ah", category: "SOLAR", price: 145000, oldPrice: 165000, rating: 4.9, reviewsCount: 44, inStock: true, badge: "SALE", installationAvailable: true },
        { id: "m4", name: "550W Monocrystalline Solar Panel - Tier 1", slug: "solar-panel-550w-tier1", category: "SOLAR", price: 18500, rating: 4.7, reviewsCount: 38, inStock: true, installationAvailable: true },
      ],
    };
    relatedProducts = (mockByCat[category] || []).slice(0, 4);
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Header with Unsplash image */}
      <div className="relative rounded-2xl overflow-hidden">
        <img src={svc.image} alt={svc.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#002070]/80 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0038A0]" />
        <div className="relative p-6 md:p-10 max-w-3xl">
          <Badge className="bg-[#0038A0] text-white font-bold mb-3">SERVICE • CERTIFIED • WARRANTIED</Badge>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">{svc.title}</h1>
          <p className="text-zinc-200 mt-3 leading-relaxed">{svc.desc} — Starting from <span className="text-[#0038A0] font-bold">{svc.priceFrom}</span>. Free site survey & quote.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`tel:${SITE.phone}`}><Button>Call {SITE.phone}</Button></Link>
            <Link href={`https://wa.me/${SITE.whatsapp}?text=Hi!%20I%20need%20${encodeURIComponent(svc.title)}`} target="_blank"><Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-black backdrop-blur">WhatsApp Quote</Button></Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-2 border-[#0038A0]/20 overflow-hidden">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader><CardTitle>What&apos;s Included</CardTitle><p className="text-xs text-zinc-500 uppercase tracking-widest">Professional scope</p></CardHeader>
          <CardContent><ul className="space-y-2.5 text-sm text-zinc-700">{svc.bullets.map(b=><li key={b} className="flex gap-2"><span className="h-2 w-2 rounded-full bg-[#0038A0] mt-1.5 shrink-0" />{b}</li>)}</ul></CardContent>
        </Card>
        <Card><CardHeader><CardTitle>Pricing</CardTitle><p className="text-xs text-zinc-500 uppercase tracking-widest">Transparent • No hidden costs</p></CardHeader><CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="border rounded-xl p-3 hover:border-[#0038A0]/30 transition"><p className="font-bold">Basic</p><p className="text-zinc-500 text-xs">Homes & shops</p><p className="font-bold mt-2 text-[#002070]">Call for Price</p></div>
            <div className="border-2 border-[#0038A0] rounded-xl p-3 bg-[#F5F7FA] shadow-sm"><p className="font-bold text-[#002070]">Business</p><p className="text-zinc-600 text-xs">Offices</p><p className="font-bold mt-2">Call for Price</p><Badge className="bg-[#0038A0] text-white text-[10px] mt-1">POPULAR</Badge></div>
            <div className="border rounded-xl p-3 hover:border-[#0038A0]/30 transition"><p className="font-bold">Enterprise</p><p className="text-zinc-500 text-xs">Large sites</p><p className="font-bold mt-2 text-[#002070]">Call for Price</p></div>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">Custom quotes based on site, quantity & complexity. Free survey within Nairobi. Countrywide available. <span className="text-[#0038A0] font-medium">5-year workmanship warranty.</span></p>
          <Link href="#contact"><Button className="w-full">Get Custom Quote in 30min</Button></Link>
        </CardContent></Card>
      </div>

      {/* Related Products — filtered by service category */}
      {relatedProducts.length > 0 && (
        <Card className="mt-6 overflow-hidden border-2 border-[#0038A0]/10">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Related Products — {category?.replace("_", " ")}</CardTitle>
                <p className="text-sm text-zinc-500">Genuine stock for {svc.title} • Supply & install • 5-yr warranty</p>
              </div>
              <Link href={`/shop?category=${category}`} className="hidden sm:inline-flex text-sm font-semibold text-[#0038A0] hover:text-[#0038A0] hover:underline">View all {category?.replace("_", " ")} →</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Link href={`/shop?category=${category}`} className="sm:hidden mt-4 block"><Button variant="outline" className="w-full">View all {category?.replace("_", " ")}</Button></Link>
          </CardContent>
        </Card>
      )}

      {/* Gallery preview for CCTV etc */}
      <Card className="mt-6 overflow-hidden">
        <div className="grid md:grid-cols-3 gap-0">
          <img src={IMAGES.hero.cctv} alt="Work 1" className="h-40 w-full object-cover" />
          <img src={IMAGES.products.smartHome} alt="Work 2" className="h-40 w-full object-cover" />
          <img src={IMAGES.products.networking} alt="Work 3" className="h-40 w-full object-cover" />
        </div>
        <p className="text-xs text-center text-zinc-500 py-2">Professional installation • Certified techs • 500+ projects</p>
      </Card>

      <Card className="mt-8 border-2 border-[#0038A0]/20 shadow-md" id="contact">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader><CardTitle>Secure Your Property Today</CardTitle><p className="text-sm text-zinc-500">Free consultation & custom quote. Our experts will design the perfect solution.</p></CardHeader>
        <CardContent>
          <form action="/api/leads" method="post" className="grid md:grid-cols-2 gap-3">
            <input name="name" placeholder="Full name *" required className="border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="phone" placeholder="Phone *" required className="border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="location" placeholder="Location (e.g., Westlands)" className="border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input type="hidden" name="service" value={slug.toUpperCase().replace(/-/g,"_")} />
            <textarea name="message" placeholder="Describe your site..." rows={3} className="md:col-span-2 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <Button type="submit" className="md:col-span-2 h-11 text-base">Send Request — 2hr Reply</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(SERVICES).map(slug=>({ slug }));
}
