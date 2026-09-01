import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import Link from "next/link";

export default function EstatesPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="relative rounded-2xl overflow-hidden">
        <img src={IMAGES.services.estate} alt="Estate aerial" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#0A0A0A]/85 to-black/40" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#7FAF25]" />
        <div className="relative p-6 md:p-10 text-center max-w-3xl mx-auto">
          <Badge className="bg-[#7FAF25] text-black font-bold">For Estates & Gated Communities</Badge>
          <h1 className="text-3xl md:text-4xl font-black mt-3 text-white tracking-tight leading-tight">Securing 50–200 Homes<br /><span className="text-[#7FAF25]">Under One Contract</span></h1>
          <p className="text-zinc-200 mt-3 leading-relaxed">Bulk pricing, single point of contact, and dedicated maintenance contracts for HOAs across Kitengela, Syokimau, Athi River, Ruiru, and beyond.</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link href="#contact"><Button size="lg">Request Bulk Pricing</Button></Link>
            <Link href={`tel:${SITE.phone}`}><Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-black backdrop-blur">Call Estate Team</Button></Link>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-8 text-center border-t border-white/10 pt-6">
            <div><div className="text-2xl font-black text-[#7FAF25]">15+</div><div className="text-xs text-zinc-400 uppercase tracking-widest">Estates Served</div></div>
            <div><div className="text-2xl font-black text-[#7FAF25]">2,000+</div><div className="text-xs text-zinc-400 uppercase tracking-widest">Homes Secured</div></div>
            <div><div className="text-2xl font-black text-[#7FAF25]">35%</div><div className="text-xs text-zinc-400 uppercase tracking-widest">Avg Cost Savings</div></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 md:gap-6 mt-8">
        {[
          ["Bulk Per-Unit Pricing","Volume discounts starting at 50 units. Fixed per-home costs. Flexible HOA payment terms."],
          ["Single Point of Contact","Dedicated project manager. Centralized scheduling. Unified reporting. Direct emergency line."],
          ["Fast Response SLA","4-hour emergency, 24-hour non-emergency, monthly health reports, priority support."],
        ].map(([t,d])=>(
          <Card key={t} className="border-2 hover:border-[#7FAF25]/20 hover:shadow-md transition overflow-hidden">
            <div className="h-1 bg-[#7FAF25]" />
            <CardHeader className="pb-2"><CardTitle className="text-base">{t}</CardTitle></CardHeader><CardContent className="text-sm text-zinc-600 leading-relaxed">{d}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 overflow-hidden border-2 border-[#7FAF25]/20">
        <div className="grid md:grid-cols-2">
          <div className="relative h-56 md:h-auto">
            <img src={IMAGES.services.estate} alt="Karen Greens" className="h-full w-full object-cover" />
            <div className="absolute bottom-3 left-3 bg-[#7FAF25] text-black text-xs font-bold px-3 py-1 rounded-full">FEATURED PROJECT</div>
          </div>
          <div className="p-6">
            <h3 className="font-black text-lg">Karen Greens Estate — 87 homes, 6 weeks, 35% savings</h3>
            <p className="text-sm text-zinc-600 mt-2">Complete security upgrade with CCTV, electric fencing, and biometric access control.</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-zinc-700 mt-4 marker:text-[#7FAF25]">
              <li>Perimeter electric fencing</li><li>CCTV at all entry points</li><li>Biometric access for residents</li><li>24/7 monitoring station</li><li>Monthly maintenance included</li>
            </ul>
            <blockquote className="mt-4 border-l-[3px] border-[#7FAF25] pl-4 italic text-sm text-zinc-600 bg-[#F2F9E6] py-3 rounded-r">“Qyvea transformed our entire estate security. One contract, one point of contact.” — Estate Manager, Karen Greens</blockquote>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
              <div className="bg-[#0A0A0A] text-white rounded-xl p-3"><div className="font-black text-[#7FAF25] text-lg">87</div>Homes</div>
              <div className="bg-[#7FAF25] text-black rounded-xl p-3"><div className="font-black text-lg">6</div>Weeks</div>
              <div className="border-2 border-[#7FAF25] rounded-xl p-3"><div className="font-black text-[#3F5D13] text-lg">35%</div>Savings</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-8 border-2 border-[#7FAF25]/30 shadow-lg" id="contact">
        <div className="h-1 bg-[#7FAF25]" />
        <CardHeader><CardTitle>Ready to Secure Your Entire Estate?</CardTitle><p className="text-sm text-zinc-500">Get bulk pricing + dedicated PM — we reply today.</p></CardHeader>
        <CardContent>
          <form action="/api/leads" method="post" className="grid md:grid-cols-2 gap-3">
            <input name="name" placeholder="HOA Contact Name *" required className="border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="phone" placeholder="Phone *" required className="border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="email" placeholder="Email" className="border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="location" placeholder="Estate Location (e.g., Kitengela)" className="border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <textarea name="message" placeholder="Number of homes, services needed..." rows={3} className="md:col-span-2 border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input type="hidden" name="service" value="ESTATE_SOLUTIONS" />
            <Button type="submit" className="md:col-span-2 h-11 text-base">Request Bulk Pricing — Reply Today</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
