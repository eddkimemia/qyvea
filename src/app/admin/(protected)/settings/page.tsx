import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings: any = null;
  let counts = { products: 0, users: 0, orders: 0, leads: 0, posts: 0 };
  try {
    settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    const [p, u, o, l, po] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.lead.count(),
      prisma.post.count(),
    ]);
    counts = { products: p, users: u, orders: o, leads: l, posts: po };
  } catch {}
  settings = settings || {
    whatsappNumber: "254715135141",
    phone: "+254 715 135 141",
    phoneDisplay: "0715 135 141",
    email: "info@syntech.co.ke",
    address: "Westlands, Nairobi",
    siteName: "Syntech Solutions",
    siteTagline: "One Company, Every Solution",
    siteDescription: "Kenya's trusted security & IT integration company.",
    siteUrl: "https://syntech.co.ke",
    logoUrl: "/syntechlogo.jpg",
    faviconUrl: "/fav.png",
    promoText: "Free Delivery in Nairobi on orders over KES 5,000",
    promoCode: "",
    promoActive: true,
    businessHours: "Mon–Fri: 8:00 AM – 6:00 PM",
    maintenanceMode: false,
    facebookUrl: "https://www.facebook.com/SyntechSolutions",
    instagramUrl: "https://www.instagram.com/syntechsolutions",
    linkedinUrl: "https://www.linkedin.com/company/syntech-solutions-ltd",
    tiktokUrl: "https://www.tiktok.com/@syntechsolutions",
    xUrl: "https://x.com/syntechsolutions",
    youtubeUrl: "https://www.youtube.com/@syntechsolutions",
    defaultDeliveryFee: 0,
    taxRate: 0,
    currency: "KES",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">Settings</h1>
          <p className="text-sm text-zinc-500">All site configuration — logos, contact, social, promo, commerce. Changes reflect instantly (DB-driven).</p>
        </div>
        <Badge variant="secondary" className="bg-[#0038A0] text-white">Store Configuration</Badge>
      </div>

      <SettingsForm initial={settings} />

      <Card>
        <CardHeader><CardTitle>Store Overview</CardTitle><p className="text-sm text-zinc-500">Live counts from your Syntech database.</p></CardHeader>
        <CardContent className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
          <div className="border rounded-xl p-3 text-center"><p className="text-2xl font-black">{counts.products}</p><p className="text-xs text-zinc-500">Products</p></div>
          <div className="border rounded-xl p-3 text-center"><p className="text-2xl font-black">{counts.users}</p><p className="text-xs text-zinc-500">Users</p></div>
          <div className="border rounded-xl p-3 text-center"><p className="text-2xl font-black">{counts.orders}</p><p className="text-xs text-zinc-500">Orders</p></div>
          <div className="border rounded-xl p-3 text-center"><p className="text-2xl font-black">{counts.leads}</p><p className="text-xs text-zinc-500">Leads</p></div>
          <div className="border rounded-xl p-3 text-center"><p className="text-2xl font-black">{counts.posts}</p><p className="text-xs text-zinc-500">Posts</p></div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/50">
        <CardHeader><CardTitle className="text-red-700">Danger Zone</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-red-200 text-red-700">Export will be added via /api/export</Badge>
          <p className="text-xs text-red-600 w-full">Irreversible actions — back up DB first. Use Prisma Studio for advanced ops.</p>
        </CardContent>
      </Card>
    </div>
  );
}
