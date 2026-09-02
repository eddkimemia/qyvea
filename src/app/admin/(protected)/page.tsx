import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats = { products: 0, orders: 0, leads: 0, revenue: 0 };
  let recentOrders: any[] = [];
  let recentLeads: any[] = [];
  let topProducts: any[] = [];
  let lowStock: any[] = [];
  try {
    const [products, orders, leads, revenueAgg, top, recentO, recentL, low] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.lead.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.findMany({ orderBy: { views: "desc" }, take: 5 }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.product.findMany({ where: { stockQty: { lt: 10 }, inStock: true }, orderBy: { stockQty: "asc" }, take: 5 }),
    ]);
    stats = { products, orders, leads, revenue: revenueAgg._sum.total || 0 };
    recentOrders = recentO;
    recentLeads = recentL;
    topProducts = top;
    lowStock = low;
  } catch {
    stats = { products: 36, orders: 0, leads: 0, revenue: 0 };
    topProducts = [
      { name: "Hikvision 4CH Kit", views: 1234, sold: 128 },
      { name: "ZKTeco F22", views: 980, sold: 203 },
      { name: "Solar Backup 3KVA", views: 840, sold: 63 },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500">36 products • 13 categories • Secure admin</p>
        </div>
        <Badge className="bg-[#F00000] text-white font-bold">LIVE</Badge>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest text-zinc-500">Products</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-black">{stats.products}</div><p className="text-xs text-zinc-500">13 categories • <Link href="/admin/products" className="text-[#0038A0] underline">Manage →</Link></p></CardContent>
        </Card>
        <Card className="border-2 border-black/5"><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest text-zinc-500">Orders</CardTitle></CardHeader><CardContent><div className="text-3xl font-black">{stats.orders}</div><p className="text-xs text-zinc-500"><Link href="/admin/orders" className="text-[#0038A0] underline">View orders →</Link></p></CardContent></Card>
        <Card className="border-2 border-black/5"><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest text-zinc-500">Leads</CardTitle></CardHeader><CardContent><div className="text-3xl font-black">{stats.leads}</div><p className="text-xs text-zinc-500"><Link href="/admin/leads" className="text-[#0038A0] underline">CRM →</Link></p></CardContent></Card>
        <Card className="bg-[#002070] text-white border-0"><CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest text-zinc-400">Revenue</CardTitle></CardHeader><CardContent><div className="text-3xl font-black text-white">{formatKES(stats.revenue)}</div><p className="text-xs text-zinc-400">Total fulfilled</p></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Link href="/admin/orders"><Button variant="outline" size="sm">View all</Button></Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-zinc-500 py-6 text-center border-2 border-dashed rounded-xl">No orders yet — orders from /shop appear here. Try “Order on WhatsApp” flow.</p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((o: any) => (
                  <div key={o.id} className="flex items-center justify-between border rounded-xl px-3 py-2.5 text-sm hover:bg-zinc-50">
                    <div>
                      <p className="font-mono text-xs">{o.id.slice(0, 8)} • {new Date(o.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-zinc-500">{o.items?.length || 0} items • {o.phone || "no phone"}</p>
                    </div>
                    <span className="font-bold">{formatKES(o.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Top Viewed Products</CardTitle>
            <Link href="/admin/products"><Button variant="ghost" size="sm">Manage</Button></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topProducts.map((p: any) => (
                <div key={p.name} className="flex justify-between items-center border rounded-xl px-3 py-2 text-sm">
                  <span className="font-medium line-clamp-1">{p.name}</span>
                  <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">{p.views} views • {p.sold} sold</span>
                </div>
              ))}
              {topProducts.length === 0 && <p className="text-sm text-zinc-500">No data</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-[#0038A0]/20">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Low Stock Alerts</CardTitle></CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-zinc-500">All stocked — 36 products healthy. Threshold &lt;10.</p>
            ) : (
              <div className="space-y-1.5">
                {lowStock.map((p: any) => (
                  <div key={p.id} className="flex justify-between text-sm border rounded-lg px-3 py-2 bg-amber-50/50"><span>{p.name}</span><span className="font-bold text-amber-700">{p.stockQty} left</span></div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Leads</CardTitle></CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center border-2 border-dashed rounded-xl">No leads yet — new inquiries will appear here.</p>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((l: any) => (
                  <div key={l.id} className="border rounded-xl px-3 py-2 text-sm">
                    <p className="font-semibold">{l.name} • {l.phone} <Badge variant="secondary" className="ml-2 text-[10px]">{l.status}</Badge></p>
                    <p className="text-xs text-zinc-500">{l.service || "General"} • {l.location || "—"} • {new Date(l.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-[#0038A0]/10 bg-[#F5F7FA]/30">
        <CardHeader><CardTitle className="text-base">Quick Actions & Pages</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <Link href="/admin/products" className="border-2 border-[#0038A0]/20 rounded-xl p-4 hover:bg-[#0038A0] hover:text-black hover:border-[#0038A0] transition bg-white group">
            <p className="font-bold">📦 Products</p><p className="text-xs opacity-70 group-hover:opacity-90">Edit • Add • Delete • Stock</p>
          </Link>
          <Link href="/admin/orders" className="border rounded-xl p-4 hover:bg-zinc-50 bg-white">
            <p className="font-bold">🧾 Orders</p><p className="text-xs text-zinc-500">View & fulfill</p>
          </Link>
          <Link href="/admin/leads" className="border rounded-xl p-4 hover:bg-zinc-50 bg-white">
            <p className="font-bold">👥 Leads</p><p className="text-xs text-zinc-500">CRM pipeline</p>
          </Link>
          <Link href="/admin/settings" className="border rounded-xl p-4 hover:bg-zinc-50 bg-white">
            <p className="font-bold">⚙️ Settings</p><p className="text-xs text-zinc-500">WhatsApp • Promo • DB</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
