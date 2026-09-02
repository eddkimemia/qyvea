import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function PartnersPage(){
  return <div className="container mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold">Partners & Affiliates</h1>
    <p className="text-zinc-500">Earn commission on every converted lead. Your refCode tracks clicks → leads → conversions.</p>
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      <Card><CardHeader><CardTitle>Your Link</CardTitle></CardHeader><CardContent className="text-sm"><code className="bg-zinc-100 px-2 py-1 rounded">syntech.co.ke?ref=QYV-XXXX</code><p className="text-zinc-500 mt-2">Share via WhatsApp / social. Demo: QYV-PARTNER-001</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Commission</CardTitle></CardHeader><CardContent className="text-sm"><p className="text-2xl font-bold">KES 0</p><p className="text-zinc-500">Pending payout. Track in admin → Partners</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Leads</CardTitle></CardHeader><CardContent><Button>Join Program</Button><p className="text-xs text-zinc-500 mt-2">Login as PARTNER role to see live stats.</p></CardContent></Card>
    </div>
  </div>
}
