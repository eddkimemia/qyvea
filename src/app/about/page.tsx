import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      {/* Hero with Unsplash office */}
      <div className="relative rounded-2xl overflow-hidden">
        <img src={IMAGES.about.office} alt="Syntech office Nairobi" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#002070]/80 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0038A0]" />
        <div className="relative p-6 md:p-10 max-w-3xl">
          <Badge className="bg-[#0038A0] text-white font-bold mb-3">About Syntech Limited</Badge>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Built to Protect —<br /><span className="text-[#0038A0]">Built to Last.</span></h1>
          <p className="text-zinc-200 mt-3 leading-relaxed">Kenya&apos;s trusted security & IT integration partner since 2022. Delivering professional solutions with integrity, innovation, and excellence — <span className="text-white font-semibold">500+ projects, 47 counties.</span></p>
          <div className="mt-5 flex gap-3">
            <Link href="#story"><Button size="sm" variant="secondary" className="bg-white text-black hover:bg-zinc-100">Our Story</Button></Link>
            <Link href="#team"><Button size="sm" className="bg-[#0038A0] text-white hover:bg-[#002070]">Meet the Team</Button></Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 md:gap-6 mt-8">
        <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader className="pb-2"><CardTitle className="text-lg">🎯 Mission</CardTitle></CardHeader><CardContent className="text-sm text-zinc-600 leading-relaxed">World-class security & IT solutions for safety and peace of mind. Every install warranted for 5 years.</CardContent>
        </Card>
        <Card className="border-2 border-[#002070]/10 hover:shadow-md transition">
          <CardHeader className="pb-2"><CardTitle className="text-lg">👁️ Vision</CardTitle></CardHeader><CardContent className="text-sm text-zinc-600 leading-relaxed">Kenya&apos;s leading security & tech integrator — from homes to hoas to enterprise.</CardContent>
        </Card>
        <Card className="border-2 border-[#0038A0]/10 hover:shadow-md transition bg-[#F5F7FA]">
          <CardHeader className="pb-2"><CardTitle className="text-lg">🛡️ Integrity</CardTitle></CardHeader><CardContent className="text-sm text-zinc-700 leading-relaxed">Honest, transparent, ethical in all relationships. Licensed, insured, documented.</CardContent>
        </Card>
      </div>

      <div id="story" className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8">
        <Card className="overflow-hidden">
          <div className="h-32 relative">
            <img src={IMAGES.hero.tech} alt="Timeline" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <h3 className="absolute bottom-3 left-4 text-white font-black text-lg">Our Story Since 2022</h3>
          </div>
          <CardContent className="pt-4">
            <ol className="relative border-l-2 border-[#0038A0]/30 pl-6 space-y-6 text-sm">
              {[
                ["2022","Foundation — Founded in Nairobi"],
                ["2023","Growth — 15 counties, NCA & EPRA"],
                ["2024","Integration — Smart home & IT services"],
                ["2025","Leadership — ISO 9001, PSRA licensed"],
                ["2026","National — 47 counties, 500+ projects"],
              ].map(([year, text])=>(
                <li key={year} className="relative"><span className="absolute -left-[29px] top-0 h-4 w-4 rounded-full bg-[#0038A0] border-2 border-white shadow" /><span className="font-bold text-[#002070]">{year}</span> — {text}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Card className="border-2 border-[#0038A0]/20">
          <CardHeader><CardTitle>Company Details</CardTitle><p className="text-xs text-zinc-500 uppercase tracking-widest">Registered • Licensed • Insured</p></CardHeader>
          <CardContent className="text-sm space-y-2.5">
            <p className="flex justify-between border-b py-1.5"><span className="text-zinc-500">Company</span><span className="font-semibold">Syntech Limited Kenya Ltd</span></p>
            <p className="flex justify-between border-b py-1.5"><span className="text-zinc-500">Registration</span><span className="font-mono text-xs">PVT/2021/123456</span></p>
            <p className="flex justify-between border-b py-1.5"><span className="text-zinc-500">Head Office</span><span className="font-medium">Westlands Tower, Nairobi</span></p>
            <p className="flex justify-between border-b py-1.5"><span className="text-zinc-500">Licenses</span><span className="font-medium">NCA, EPRA, PSRA, ISO 9001</span></p>
            <p className="flex justify-between"><span className="text-zinc-500">Insurance</span><span className="font-bold text-[#0038A0]">KES 50M All-Risk</span></p>
            <div className="pt-4 flex gap-3">
              <Link href={`tel:${SITE.phone}`}><Button>Call {SITE.phone}</Button></Link>
              <Link href="/estates"><Button variant="outline">Estate Solutions</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 id="team" className="text-2xl font-black mt-12 text-center tracking-tight">Meet Our Expert Team</h2>
      <p className="text-center text-zinc-500 text-sm">Certified engineers • 10+ years average experience</p>
      <div className="grid md:grid-cols-4 gap-5 mt-6">
        {[
          ["Elias Ngigi","CEO & Founder","Network engineer, IoT expert.","EN"],
          ["Virginia Wanjiru","CTO","Strategy, business & security innovation.","VW"],
          ["Joseph Njogu","COO","PMP certified, 10+ yrs project management.","JN"],
          ["Mathew Muchai","Tech Lead","8+ yrs CCTV, access & alarms.","MM"],
        ].map(([name, role, bio, initials])=>(
          <Card key={name} className="hover:border-[#0038A0]/30 hover:shadow-md transition overflow-hidden group">
            <div className="h-20 bg-gradient-to-br from-[#0038A0] to-[#0064D8] relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-2xl bg-white shadow-lg grid place-items-center font-black text-[#002070] border-2 border-[#0038A0] group-hover:scale-105 transition">{initials}</div>
            </div>
            <CardContent className="pt-10 text-center"><p className="font-bold">{name}</p><p className="text-xs text-[#0038A0] font-semibold uppercase tracking-widest">{role}</p><p className="text-xs text-zinc-600 mt-2 leading-relaxed">{bio}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-6 mt-10 text-center">
        <Card className="bg-[#002070] text-white border-0"><CardContent className="pt-6"><div className="text-3xl font-black text-[#0038A0]">500+</div><div className="text-sm text-zinc-400">Projects Completed</div></CardContent></Card>
        <Card className="bg-[#0038A0] text-white border-0"><CardContent className="pt-6"><div className="text-3xl font-black">47</div><div className="text-sm font-medium">Counties Served</div></CardContent></Card>
        <Card className="border-2 border-[#0038A0]"><CardContent className="pt-6"><div className="text-3xl font-black text-[#002070]">98%</div><div className="text-sm text-zinc-600 font-medium">Client Satisfaction</div></CardContent></Card>
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <img src={IMAGES.about.nairobi} alt="Nairobi tech" className="h-48 md:h-auto w-full object-cover" />
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <h3 className="font-black text-xl">Ready to secure your property?</h3>
            <p className="text-sm text-zinc-600 mt-2">Free site survey • No-obligation quote • Same-week installation across 47 counties.</p>
            <div className="mt-5 flex gap-3">
              <Link href={`tel:${SITE.phone}`}><Button>Call Now</Button></Link>
              <Link href={`https://wa.me/${SITE.whatsapp}`} target="_blank"><Button variant="outline">WhatsApp</Button></Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
