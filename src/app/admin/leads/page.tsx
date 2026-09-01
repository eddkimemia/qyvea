import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  let leads: any[] = [];
  try {
    leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  } catch { leads = []; }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Leads / CRM</h1>
        <Badge className="bg-black text-white">{leads.length} leads</Badge>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Lead Pipeline</CardTitle><p className="text-sm text-zinc-500">From home contact + service forms • Status: NEW → QUOTED → CONVERTED → LOST</p></CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-sm text-zinc-500 py-8 text-center border-2 border-dashed rounded-xl">No leads yet. Submit via <code className="bg-zinc-100 px-1 rounded">#contact</code> forms on home/services/estates.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-widest text-zinc-500 border-b bg-zinc-50">
                  <tr><th className="text-left p-2">Name</th><th className="text-left p-2">Phone</th><th className="text-left p-2">Service</th><th className="text-left p-2">Location</th><th className="text-left p-2">Source</th><th className="text-center p-2">Status</th><th className="text-right p-2">Date</th></tr>
                </thead>
                <tbody>
                  {leads.map((l: any) => (
                    <tr key={l.id} className="border-b last:border-0 hover:bg-[#F2F9E6]/30">
                      <td className="p-2 font-semibold">{l.name}</td>
                      <td className="p-2 font-mono text-xs">{l.phone}</td>
                      <td className="p-2"><Badge variant="secondary" className="text-[11px]">{(l.service || "GENERAL").replace("_"," ")}</Badge></td>
                      <td className="p-2 text-xs">{l.location || "—"}</td>
                      <td className="p-2 text-xs">{l.source || "direct"}</td>
                      <td className="p-2 text-center"><Badge className={`${l.status==="NEW" ? "bg-[#7FAF25] text-black" : l.status==="CONVERTED" ? "bg-black text-white" : "bg-zinc-200 text-zinc-700"} text-[11px]`}>{l.status}</Badge></td>
                      <td className="p-2 text-right text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
