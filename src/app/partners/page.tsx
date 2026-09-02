import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Users, DollarSign, Link2, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Partners & Affiliates | Syntech Solutions Kenya",
  description: "Join the Syntech partner program — earn commission on every converted lead. Share your referral link and earn.",
};

export default function PartnersPage(){
  return <div className="container mx-auto px-4 py-8 md:py-10">
    <div className="max-w-3xl">
      <Badge className="bg-[#0038A0] text-white font-bold">PARTNER PROGRAM</Badge>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Partners & Affiliates</h1>
      <p className="text-zinc-600 mt-2">Earn commission on every converted lead. Your unique refCode tracks clicks → leads → conversions across CCTV, solar, websites, AI, and more.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mt-8">
      <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Link2 className="h-4 w-4 text-[#0038A0]" /> Your Referral Link</CardTitle></CardHeader>
        <CardContent className="text-sm">
          <code className="bg-zinc-100 px-2 py-1 rounded text-xs block break-all">syntech.co.ke?ref=YOUR-CODE</code>
          <p className="text-zinc-500 mt-2">Share via WhatsApp, social media, or your website. Demo code: <span className="font-mono font-semibold">QYV-PARTNER-001</span></p>
        </CardContent>
      </Card>

      <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-[#0038A0]" /> Commission Structure</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between border-b pb-1"><span className="text-zinc-600">CCTV / Security installs</span><span className="font-bold text-[#002070]">5%</span></div>
          <div className="flex justify-between border-b pb-1"><span className="text-zinc-600">Solar / electrical</span><span className="font-bold text-[#002070]">5%</span></div>
          <div className="flex justify-between border-b pb-1"><span className="text-zinc-600">Website / design / AI</span><span className="font-bold text-[#002070]">8%</span></div>
          <div className="flex justify-between"><span className="text-zinc-600">Product sales</span><span className="font-bold text-[#002070]">3%</span></div>
          <p className="text-xs text-zinc-400 mt-2">Paid via M-Pesa after order delivery & confirmation.</p>
        </CardContent>
      </Card>

      <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#0038A0]" /> How It Works</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-3">
          <div className="flex gap-3"><span className="h-6 w-6 rounded-full bg-[#0038A0] text-white text-xs font-bold grid place-items-center shrink-0">1</span><p>Sign up and get your unique referral code</p></div>
          <div className="flex gap-3"><span className="h-6 w-6 rounded-full bg-[#0038A0] text-white text-xs font-bold grid place-items-center shrink-0">2</span><p>Share your link on WhatsApp, social, or your website</p></div>
          <div className="flex gap-3"><span className="h-6 w-6 rounded-full bg-[#0038A0] text-white text-xs font-bold grid place-items-center shrink-0">3</span><p>We track leads & conversions automatically</p></div>
          <div className="flex gap-3"><span className="h-6 w-6 rounded-full bg-[#0038A0] text-white text-xs font-bold grid place-items-center shrink-0">4</span><p>Get paid via M-Pesa after delivery confirmation</p></div>
        </CardContent>
      </Card>
    </div>

    <Card className="mt-8 bg-[#002070] text-white border-0 overflow-hidden">
      <CardContent className="p-6 md:p-8 text-center">
        <h3 className="font-black text-xl">Ready to Start Earning?</h3>
        <p className="text-zinc-300 mt-2 max-w-lg mx-auto">Log in with your partner account to view your dashboard, track referrals, and see your commission balance.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/login"><Button className="bg-white text-[#002070] hover:bg-zinc-100">Sign In as Partner</Button></Link>
          <Link href={`https://wa.me/${SITE.whatsapp}?text=Hi!%20I%27m%20interested%20in%20becoming%20a%20Syntech%20partner.`} target="_blank"><Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#002070]">WhatsApp Us</Button></Link>
        </div>
      </CardContent>
    </Card>
  </div>
}
