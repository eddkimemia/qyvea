import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { FileText, Headphones, CreditCard } from "lucide-react";

export const metadata = {
  title: "Clients Portal | Syntech Solutions Kenya",
  description: "Syntech clients portal — view subscriptions, invoices, and get support.",
};

export default function ClientsPage(){
  return <div className="container mx-auto px-4 py-8 md:py-10">
    <div className="max-w-3xl">
      <Badge className="bg-[#0038A0] text-white font-bold">CLIENTS</Badge>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Clients Portal</h1>
      <p className="text-zinc-600 mt-2">Subscriptions, invoices & maintenance tickets. Log in to view your service history and manage your account.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mt-8">
      <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#0038A0]" /> Active Subscriptions</CardTitle></CardHeader>
        <CardContent className="text-sm">
          <p className="text-zinc-500">No active subscriptions yet.</p>
          <p className="text-xs text-zinc-400 mt-2">Contact support to activate an estate security or maintenance contract. Monthly & annual plans available.</p>
          <Link href={`https://wa.me/${SITE.whatsapp}?text=Hi!%20I%27d%20like%20to%20set%20up%20a%20maintenance%20subscription.`} target="_blank" className="block mt-3">
            <Button variant="outline" size="sm" className="w-full">Contact Support</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-[#0038A0]" /> Invoices</CardTitle></CardHeader>
        <CardContent className="text-sm">
          <p className="text-zinc-500">M-Pesa & bank invoices appear here after order confirmation.</p>
          <p className="text-xs text-zinc-400 mt-2">All invoices include product costs, delivery, installation, and applicable taxes. 5-year warranty documented.</p>
          <Link href="/shop" className="block mt-3">
            <Button variant="outline" size="sm" className="w-full">View Orders</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Headphones className="h-4 w-4 text-[#0038A0]" /> Support</CardTitle></CardHeader>
        <CardContent className="text-sm">
          <p className="text-zinc-500">24/7 emergency support with 2-hour response SLA for Nairobi, Mombasa, and Kisumu.</p>
          <div className="mt-3 space-y-2">
            <a href={`tel:${SITE.phone}`} className="block"><Button variant="outline" size="sm" className="w-full">Call {SITE.phoneDisplay}</Button></a>
            <a href={`https://wa.me/${SITE.whatsapp}?text=Hi!%20I%20need%20support%20with%20my%20Syntech%20system.`} target="_blank" className="block"><Button size="sm" className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white">WhatsApp Support</Button></a>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="mt-8 border-2 border-[#0038A0]/10">
      <CardContent className="p-6 text-center">
        <h3 className="font-bold text-lg">Need to access your account?</h3>
        <p className="text-sm text-zinc-500 mt-1">Log in to view your service history, downloads, and warranty information.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/login"><Button>Sign In</Button></Link>
          <Link href="#contact"><Button variant="outline">Contact Us</Button></Link>
        </div>
      </CardContent>
    </Card>
  </div>
}
