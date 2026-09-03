import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/lib/utils";
import { DashboardClient } from "@/components/dashboard-client";
import { ShoppingCart, Heart, FileText, Headphones, Package, Clock, Shield, Award, ArrowRight, User, Settings, LogOut, LayoutDashboard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const email = session.user.email.toLowerCase();
  const userId = (session.user as any).id;
  const role = (session.user as any).role || "USER";

  // Fetch full user record
  let dbUser: any = null;
  try {
    dbUser = await prisma.user.findUnique({ where: { email } });
    if (!dbUser && userId && !userId.startsWith("mock-")) {
      dbUser = await prisma.user.findUnique({ where: { id: userId } });
    }
  } catch {}

  // Fallback for mock users
  if (!dbUser) {
    dbUser = {
      id: userId,
      name: session.user.name || email.split("@")[0],
      email,
      phone: null,
      role,
      image: session.user.image || null,
      refCode: role === "PARTNER" ? "SYN-MOCK" : null,
      createdAt: new Date(),
    };
  }

  // Fetch orders - try userId first, then email/phone fallback
  let orders: any[] = [];
  let leads: any[] = [];
  let partnerLeads: any[] = [];
  try {
    // Orders by userId or email
    const orderWhere: any = {
      OR: [
        { userId: dbUser.id },
        { email: email },
        { phone: dbUser.phone || undefined },
      ].filter(Boolean),
    };
    // If mock user, don't query by mock id (won't match)
    if (userId?.startsWith("mock-")) {
      orderWhere.OR = [{ email }, { phone: dbUser.phone || undefined }].filter(Boolean);
      if (orderWhere.OR.length === 0) orderWhere.OR = [{ email }];
    }
    orders = await prisma.order.findMany({
      where: orderWhere,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Leads by user
    leads = await prisma.lead.findMany({
      where: {
        OR: [{ userId: dbUser.id }, { email }, { phone: dbUser.phone || undefined }].filter(Boolean),
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Partner leads
    if (role === "PARTNER") {
      partnerLeads = await prisma.lead.findMany({
        where: { partnerId: dbUser.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }
  } catch (e) {
    console.error("Dashboard fetch error", e);
  }

  const isAdmin = role === "ADMIN";
  const isPartner = role === "PARTNER";
  const isClient = role === "CLIENT";

  // Stats
  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === "PENDING" || o.status === "QUOTE_SENT").length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Dashboard</h1>
              <Badge className={`${isAdmin ? "bg-[#002070] text-white" : isPartner ? "bg-[#0038A0] text-white" : isClient ? "bg-[#0064D8] text-white" : "bg-zinc-900 text-white"} font-bold`}>
                {role}
              </Badge>
              {isAdmin && <Badge variant="outline" className="border-[#0038A0] text-[#0038A0]">Admin</Badge>}
            </div>
            <p className="text-sm text-zinc-500 mt-1">
              Welcome back, <span className="font-semibold text-zinc-900 dark:text-white">{dbUser.name || email.split("@")[0]}</span> • {email}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/shop"><Button variant="outline" size="sm" className="gap-1"><ShoppingCart className="h-4 w-4" /> Shop</Button></Link>
            <Link href="/quote"><Button size="sm" className="gap-1 bg-[#F00000] hover:bg-[#CC0000]">Get Quote <ArrowRight className="h-4 w-4" /></Button></Link>
            {isAdmin && <Link href="/admin"><Button size="sm" variant="secondary" className="bg-[#002070] text-white hover:bg-black gap-1"><LayoutDashboard className="h-4 w-4" /> Admin</Button></Link>}
          </div>
        </div>

        {/* Partner banner */}
        {isPartner && dbUser.refCode && (
          <Card className="mb-6 border-2 border-[#0038A0]/20 bg-gradient-to-r from-[#0038A0]/5 to-[#002070]/5 overflow-hidden">
            <div className="h-1 bg-[#0038A0]" />
            <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold flex items-center gap-2"><Award className="h-4 w-4 text-[#0038A0]" /> Partner Code: <span className="font-mono bg-white border px-2 py-1 rounded text-[#0038A0]">{dbUser.refCode}</span></p>
                <p className="text-xs text-zinc-500 mt-1">Share your link: <span className="font-mono text-zinc-700">https://syntech.co.ke/?ref={dbUser.refCode}</span> • Earn on every converted lead</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(`https://syntech.co.ke/?ref=${dbUser.refCode}`)}>Copy Link</Button>
                <Link href="/partners"><Button size="sm" variant="ghost">Partner Info</Button></Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-[#0038A0]/10 hover:shadow-md transition">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-1"><Package className="h-3 w-3" /> Orders</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{orders.length}</div>
              <p className="text-xs text-zinc-500">{pendingOrders} pending • {formatKES(totalSpent)} total</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-zinc-200 hover:shadow-md transition">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-1"><FileText className="h-3 w-3" /> Quotes</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{leads.length}</div>
              <p className="text-xs text-zinc-500">Leads & quotes requested</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-zinc-200 hover:shadow-md transition">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-1"><Heart className="h-3 w-3" /> Wishlist</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-black" id="wishlist-count">—</div>
              <p className="text-xs text-zinc-500"><Link href="/wishlist" className="underline hover:text-[#0038A0]">View wishlist →</Link></p>
            </CardContent>
          </Card>
          <Card className="bg-[#002070] text-white border-0">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-1"><Shield className="h-3 w-3" /> {isPartner ? "Partner Leads" : "Support"}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{isPartner ? partnerLeads.length : "24/7"}</div>
              <p className="text-xs text-zinc-400">{isPartner ? "Leads via your code" : "2hr response • 0715 135 141"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardClient
              user={JSON.parse(JSON.stringify(dbUser))}
              orders={JSON.parse(JSON.stringify(orders))}
              leads={JSON.parse(JSON.stringify(leads))}
              partnerLeads={JSON.parse(JSON.stringify(partnerLeads))}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-2 border-[#0038A0]/10 overflow-hidden">
              <div className="h-1 bg-[#0038A0]" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2"><User className="h-4 w-4 text-[#0038A0]" /> Profile</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3 items-center">
                  <img src={dbUser.image || `https://placehold.co/80x80/0038A0/FFFFFF?text=${(dbUser.name || email)[0].toUpperCase()}`} alt={dbUser.name || email} className="h-12 w-12 rounded-full object-cover border-2 border-[#0038A0]/10" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-tight truncate">{dbUser.name || "No name"}</p>
                    <p className="text-xs text-zinc-500 truncate">{email}</p>
                    <Badge variant="secondary" className="mt-1 text-[10px]">{role}</Badge>
                  </div>
                </div>
                <div className="text-xs space-y-2 pt-3 border-t">
                  <div className="flex justify-between"><span className="text-zinc-500">Phone</span><span className="font-medium">{dbUser.phone || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Member since</span><span className="font-medium">{new Date(dbUser.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Orders</span><span className="font-bold">{orders.length}</span></div>
                </div>
                <Link href="#settings" className="block"><Button variant="outline" size="sm" className="w-full gap-1"><Settings className="h-4 w-4" /> Edit Profile</Button></Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Link href="/shop"><Button variant="outline" size="sm" className="w-full gap-1"><ShoppingCart className="h-4 w-4" /> Shop</Button></Link>
                <Link href="/quote"><Button size="sm" className="w-full bg-[#0038A0] hover:bg-[#002070]">Quote</Button></Link>
                <Link href="/wishlist"><Button variant="outline" size="sm" className="w-full gap-1"><Heart className="h-4 w-4" /> Wishlist</Button></Link>
                <Link href="/cart"><Button variant="outline" size="sm" className="w-full gap-1"><ShoppingCart className="h-4 w-4" /> Cart</Button></Link>
                <a href={`tel:${process.env.NEXT_PUBLIC_PHONE || "+254715135141"}`} className="col-span-2"><Button variant="ghost" size="sm" className="w-full gap-1"><Headphones className="h-4 w-4" /> Call Support</Button></a>
              </CardContent>
            </Card>

            {/* Trust */}
            <Card className="border-[#0038A0]/10 bg-[#F5F7FA]/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-2 text-sm"><Shield className="h-4 w-4 text-[#0038A0] mt-0.5 shrink-0" /><div><p className="font-bold">5-Year Warranty</p><p className="text-xs text-zinc-500">On every installation</p></div></div>
                <div className="flex gap-2 text-sm"><Clock className="h-4 w-4 text-[#0038A0] mt-0.5 shrink-0" /><div><p className="font-bold">2-Hour Response</p><p className="text-xs text-zinc-500">Nairobi • Mombasa • Kisumu</p></div></div>
                <div className="flex gap-2 text-sm"><Award className="h-4 w-4 text-[#0038A0] mt-0.5 shrink-0" /><div><p className="font-bold">Licensed</p><p className="text-xs text-zinc-500">NCA • EPRA • PSRA • ISO</p></div></div>
              </CardContent>
            </Card>

            {/* Sign out */}
            <Card>
              <CardContent className="p-4">
                <form action={async () => { "use server"; const { signOut } = await import("@/lib/auth"); await signOut({ redirectTo: "/login" }); }}>
                  <Button type="submit" variant="ghost" size="sm" className="w-full gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"><LogOut className="h-4 w-4" /> Sign Out</Button>
                </form>
                <p className="text-xs text-center text-zinc-400 mt-2">Signed in as {email}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
