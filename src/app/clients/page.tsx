import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { FileText, Headphones, CreditCard, Shield, Clock, Award } from "lucide-react";
import { formatKES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  const role = (session?.user as any)?.role;

  // If logged in as CLIENT, show personalized dashboard
  if (session?.user?.email && role === "CLIENT") {
    let user: any = null;
    let subscriptions: any[] = [];
    let orders: any[] = [];
    let leads: any[] = [];
    try {
      user = await prisma.user.findUnique({ where: { email: email! } });
      if (user) {
        subscriptions = await prisma.subscription.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 });
        orders = await prisma.order.findMany({
          where: { OR: [{ userId: user.id }, { email }] },
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        });
        leads = await prisma.lead.findMany({ where: { OR: [{ userId: user.id }, { email }] }, orderBy: { createdAt: "desc" }, take: 5 });
      }
    } catch {}

    return (
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge className="bg-[#0064D8] text-white font-bold">CLIENT PORTAL</Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Welcome, {user?.name || email?.split("@")[0]}</h1>
            <p className="text-zinc-600 mt-2">Your subscriptions, service history & support — all in one place.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard"><Button variant="outline">My Dashboard</Button></Link>
            <Link href="/shop"><Button>Shop</Button></Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#0038A0]" /> Active Subscriptions</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {subscriptions.length === 0 ? (
                <>
                  <p className="text-zinc-500">No active subscriptions yet.</p>
                  <p className="text-xs text-zinc-400 mt-2">Maintenance & estate security contracts appear here.</p>
                </>
              ) : (
                <div className="space-y-2">
                  {subscriptions.map((s: any) => (
                    <div key={s.id} className="border rounded-lg p-3 bg-zinc-50">
                      <p className="font-bold text-xs">{s.service.replace("_", " ")}</p>
                      <p className="text-xs text-zinc-500">{formatKES(s.amount)} • {s.status}</p>
                      <p className="text-xs text-zinc-400">{s.expiresAt ? `Expires ${new Date(s.expiresAt).toLocaleDateString()}` : "—"}</p>
                    </div>
                  ))}
                </div>
              )}
              <Link href={`https://wa.me/${SITE.whatsapp}?text=Hi!%20I%27d%20like%20to%20set%20up%20a%20maintenance%20subscription.`} target="_blank" className="block mt-3">
                <Button variant="outline" size="sm" className="w-full">Contact Support</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-[#0038A0]" /> Recent Orders</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {orders.length === 0 ? (
                <>
                  <p className="text-zinc-500">No orders yet.</p>
                  <p className="text-xs text-zinc-400 mt-2">M-Pesa & invoices after checkout.</p>
                </>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 3).map((o: any) => (
                    <div key={o.id} className="border rounded-lg p-2 bg-white">
                      <p className="font-mono text-xs font-bold">{o.id.slice(0, 8)} • {new Date(o.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs">{formatKES(o.total)} • <Badge variant="secondary" className="text-[10px]">{o.status}</Badge></p>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/dashboard" className="block mt-3">
                <Button variant="outline" size="sm" className="w-full">View All Orders</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#0038A0]/20 hover:shadow-md transition overflow-hidden">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Headphones className="h-4 w-4 text-[#0038A0]" /> Support</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="text-zinc-500">24/7 emergency — 2hr SLA</p>
              <div className="mt-3 space-y-2">
                <a href={`tel:${SITE.phone}`} className="block"><Button variant="outline" size="sm" className="w-full">Call {SITE.phoneDisplay}</Button></a>
                <a href={`https://wa.me/${SITE.whatsapp}?text=Hi!%20I%20need%20support%20with%20my%20Syntech%20system.`} target="_blank" className="block"><Button size="sm" className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white">WhatsApp Support</Button></a>
              </div>
              {leads.length > 0 && <p className="text-xs text-zinc-400 mt-3">{leads.length} support tickets • Latest: {leads[0].service || "General"}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="border-2 border-[#0038A0]/10">
            <CardHeader><CardTitle className="text-base">Service History</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {orders.length === 0 && leads.length === 0 ? (
                <p className="text-zinc-500">No history yet. Your installations and maintenance visits will appear here.</p>
              ) : (
                <div className="space-y-2">
                  {[...orders, ...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5).map((item: any) => (
                    <div key={item.id} className="flex gap-2 text-xs border-b pb-2 last:border-0">
                      <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${item.total ? "bg-[#0038A0]" : "bg-[#0064D8]"}`} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{item.total ? `Order ${formatKES(item.total)} • ${item.status}` : `${item.service || "Lead"} • ${item.status}`}</p>
                        <p className="text-zinc-500 truncate">{new Date(item.createdAt).toLocaleDateString()} • {item.phone || item.location || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#002070] text-white border-0 overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-black flex items-center gap-2"><Shield className="h-5 w-5 text-[#0038A0]" /> Your Warranty</h3>
              <p className="text-sm text-zinc-300 mt-2">Every installation is backed by our 5-year workmanship warranty.</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                <Award className="h-4 w-4 text-[#0038A0]" /> NCA • EPRA • PSRA • ISO 9001:2015
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/dashboard"><Button size="sm" variant="secondary" className="bg-white text-[#002070] hover:bg-zinc-100">My Dashboard</Button></Link>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank"><Button size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#002070]">WhatsApp</Button></a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not CLIENT or not logged in - show marketing portal
  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <div className="max-w-3xl">
        <Badge className="bg-[#0038A0] text-white font-bold">CLIENTS</Badge>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Clients Portal</h1>
        <p className="text-zinc-600 mt-2">Subscriptions, invoices & maintenance tickets. Log in to view your service history and manage your account.</p>
        {session?.user?.email && (
          <div className="mt-4 p-3 bg-[#F5F7FA] border-2 border-[#0038A0]/10 rounded-xl flex items-center justify-between">
            <p className="text-sm">You are signed in as <span className="font-bold">{session.user.email}</span> ({(session.user as any).role})</p>
            <Link href="/dashboard"><Button size="sm">Go to Dashboard</Button></Link>
          </div>
        )}
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
            <Link href={session?.user?.email ? "/dashboard" : "/shop"} className="block mt-3">
              <Button variant="outline" size="sm" className="w-full">{session?.user?.email ? "View Dashboard" : "View Orders"}</Button>
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
            <Link href="/dashboard"><Button variant="outline">My Dashboard</Button></Link>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
        <Card className="p-4"><Clock className="h-6 w-6 mx-auto text-[#0038A0]" /><p className="font-bold mt-2 text-sm">2-Hour Response</p><p className="text-xs text-zinc-500">Nairobi • Mombasa • Kisumu</p></Card>
        <Card className="p-4"><Shield className="h-6 w-6 mx-auto text-[#0038A0]" /><p className="font-bold mt-2 text-sm">5-Year Warranty</p><p className="text-xs text-zinc-500">All installations</p></Card>
        <Card className="p-4"><Award className="h-6 w-6 mx-auto text-[#0038A0]" /><p className="font-bold mt-2 text-sm">Licensed</p><p className="text-xs text-zinc-500">NCA • EPRA • PSRA • ISO</p></Card>
      </div>
    </div>
  );
}
