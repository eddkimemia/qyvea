import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  let partners: any[] = [];
  let leadsByPartner: Record<string, number> = {};
  try {
    partners = await prisma.user.findMany({ where: { role: "PARTNER" }, orderBy: { createdAt: "desc" } });
    const leads = await prisma.lead.groupBy({ by: ["partnerId"], _count: true });
    leads.forEach((g: any) => { if (g.partnerId) leadsByPartner[g.partnerId] = g._count; });
  } catch {}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">Partners</h1>
          <p className="text-sm text-zinc-500">{partners.length} partners • refCode for tracking • manage in Users</p>
        </div>
        <Link href="/admin/users"><Button size="sm">Manage Users →</Button></Link>
      </div>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="text-base">Partner Accounts</CardTitle><p className="text-sm text-zinc-500">Partners get refCode used in ?ref=CODE lead tracking. Commission via leads status.</p></CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <p className="text-sm text-zinc-500 py-8 text-center border-2 border-dashed rounded-xl">No partners yet — create via <Link href="/admin/users" className="underline text-[#0038A0]">Users → New User → Role PARTNER</Link>.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b text-xs uppercase tracking-widest text-zinc-500"><tr><th className="text-left p-3">Partner</th><th className="text-left p-3">Ref Code</th><th className="text-center p-3">Leads</th><th className="text-right p-3">Joined</th></tr></thead>
                <tbody>
                  {partners.map((p: any) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-zinc-50/50">
                      <td className="p-3">
                        <div className="flex gap-3 items-center">
                          <img src={p.image || `https://placehold.co/40x40/0038A0/FFFFFF?text=${p.email[0]}`} alt={p.email} className="h-9 w-9 rounded-full object-cover border" />
                          <div>
                            <p className="font-semibold">{p.name || p.email.split("@")[0]}</p>
                            <p className="text-xs text-zinc-500 font-mono">{p.email} • {p.phone || "no phone"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3"><Badge variant="secondary" className="font-mono">{p.refCode || "—"}</Badge></td>
                      <td className="p-3 text-center"><Badge className="bg-[#0038A0] text-white">{leadsByPartner[p.id] || 0}</Badge></td>
                      <td className="p-3 text-right text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-[#0038A0]/10 bg-[#F5F7FA]/30">
        <CardHeader><CardTitle className="text-base">How partner tracking works</CardTitle></CardHeader>
        <CardContent className="text-sm text-zinc-600 space-y-1">
          <p>• Partner shares link: <code className="bg-white border px-1.5 py-0.5 rounded">https://syntech.co.ke/?ref=SYN-XXXX</code></p>
          <p>• Lead form auto-captures <code className="bg-white border px-1 py-0.5 rounded">source=refCode</code> + <code>partnerId</code></p>
          <p>• View leads in <Link href="/admin/leads" className="underline text-[#0038A0]">Leads CRM</Link> filtered by source, convert → commission</p>
          <p>• Create partner in <Link href="/admin/users" className="underline text-[#0038A0]">Users</Link> with role PARTNER, refCode auto-generated.</p>
        </CardContent>
      </Card>
    </div>
  );
}
