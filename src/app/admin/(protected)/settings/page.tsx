import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings: any = null;
  let counts = { products: 0, users: 0 };
  try {
    settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    counts.products = await prisma.product.count();
    counts.users = await prisma.user.count();
  } catch {}
  settings = settings || { whatsappNumber: "254715135141", promoText: "Free Delivery in Nairobi on orders over KES 5,000", promoCode: "", promoActive: true };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Settings</h1>
        <Badge variant="secondary" className="bg-[#0038A0] text-white">Store Configuration</Badge>
      </div>

      <Card className="border-2 border-[#0038A0]/20">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader><CardTitle>Store Settings</CardTitle><p className="text-sm text-zinc-500">Update your store’s public settings — changes reflect instantly on the website.</p></CardHeader>
        <CardContent>
          <form action="/api/settings" method="post" className="space-y-4">
            <div>
              <label className="text-sm font-semibold">WhatsApp Number</label>
              <input name="whatsappNumber" defaultValue={settings.whatsappNumber} placeholder="254715135141" required className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
              <p className="text-xs text-zinc-500 mt-1">Used for WhatsApp buttons and floating chat. Include country code without +.</p>
            </div>
            <div>
              <label className="text-sm font-semibold">Promo Banner Text</label>
              <input name="promoText" defaultValue={settings.promoText} placeholder="Free Delivery..." className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold">Promo Code</label>
                <input name="promoCode" defaultValue={settings.promoCode || ""} placeholder="SYNTECH5" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              </div>
              <div className="flex items-end gap-2 pb-2">
                <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="promoActive" defaultChecked={settings.promoActive} className="accent-[#0038A0] h-4 w-4" /> Promo Active</label>
              </div>
            </div>
            <Button type="submit" className="w-full h-11">Save Settings</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Store Overview</CardTitle><p className="text-sm text-zinc-500">Quick stats for your Syntech store.</p></CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between border-b py-2"><span className="text-zinc-500">Products</span><span className="font-bold">{counts.products}</span></div>
          <div className="flex justify-between border-b py-2"><span className="text-zinc-500">Users</span><span className="font-bold">{counts.users}</span></div>
          <div className="flex justify-between border-b py-2"><span className="text-zinc-500">Website</span><span className="font-medium">syntech.co.ke</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Support</span><span className="text-xs">0715 135 141 • info@syntech.co.ke</span></div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/50">
        <CardHeader><CardTitle className="text-red-700">Danger Zone</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">Export Products CSV</Button>
          <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">Clear All Orders</Button>
          <p className="text-xs text-red-600 w-full">Irreversible — use with caution. Back up DB first.</p>
        </CardContent>
      </Card>
    </div>
  );
}
