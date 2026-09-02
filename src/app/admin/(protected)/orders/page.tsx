import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({ include: { items: { include: { product: true } }, user: true }, orderBy: { createdAt: "desc" }, take: 50 });
  } catch { orders = []; }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Orders</h1>
        <Badge className="bg-[#0038A0] text-white">{orders.length} total</Badge>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Orders</CardTitle><p className="text-sm text-zinc-500">From shop “Add to Cart” + WhatsApp flow. Update status via DB or API.</p></CardHeader>
        <CardContent className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-zinc-500 py-8 text-center border-2 border-dashed rounded-xl">No orders yet. Place a test order from <code className="bg-zinc-100 px-1 rounded">/shop</code> or via WhatsApp button.</p>
          ) : (
            orders.map((o: any) => (
              <div key={o.id} className="border-2 border-zinc-100 rounded-xl p-4 hover:border-[#0038A0]/20 transition">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs">{o.id} • {new Date(o.createdAt).toLocaleString()}</p>
                    <p className="font-semibold">{formatKES(o.total)} <Badge variant="secondary" className="ml-2 text-[11px]">{o.status}</Badge> {o.includeInstallation && <Badge className="bg-[#0038A0] text-white text-[11px] ml-1">+Install</Badge>}</p>
                    <p className="text-xs text-zinc-500">{o.phone || "no phone"} • {o.email || "no email"} • {o.address || "no address"}</p>
                  </div>
                  <div className="text-xs text-zinc-500 text-right">
                    <p>Delivery: {formatKES(o.deliveryFee)} • Install: {formatKES(o.installationFee)}</p>
                    <p>{o.mpesaRef ? `M-Pesa: ${o.mpesaRef}` : "No M-Pesa ref"}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {o.items.map((it: any) => (
                    <span key={it.id} className="text-xs border px-2 py-1 rounded-full bg-zinc-50">{it.product?.name?.slice(0, 30) || it.productId.slice(0, 8)} × {it.qty}</span>
                  ))}
                </div>
                {o.notes && <p className="text-xs mt-2 p-2 bg-[#F5F7FA] rounded-lg">{o.notes}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
