import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatKES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const where: any = {};
  if (sp.q) where.name = { contains: sp.q, mode: "insensitive" };
  if (sp.category) where.category = sp.category;

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    products = [];
  }

  const categories = ["CCTV","INTERCOM","ACCESS_CONTROL","BIOMETRICS","NETWORKING","ELECTRIC_FENCE","GATE_AUTOMATION","FIRE_ALARM","SOLAR","SMART_HOME","ELECTRICAL","IT_SUPPORT","ACCESSORIES"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black">Products</h1>
          <p className="text-sm text-zinc-500">{products.length} products • All 13 categories • Click edit to update</p>
        </div>
        <Link href="/admin/products/new"><Button className="shadow-sm">+ Add Product</Button></Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 flex flex-wrap gap-2 items-center">
          <form className="flex flex-wrap gap-2 items-center flex-1">
            <input name="q" defaultValue={sp.q} placeholder="Search name..." className="border rounded-lg px-3 py-1.5 text-sm min-w-[200px]" />
            <select name="category" defaultValue={sp.category} className="border rounded-lg px-3 py-1.5 text-sm">
              <option value="">All categories</option>
              {categories.map(c => <option key={c} value={c}>{c.replace("_"," ")}</option>)}
            </select>
            <Button type="submit" size="sm" variant="secondary">Filter</Button>
            <Link href="/admin/products" className="text-sm underline">Clear</Link>
          </form>
          <Badge className="bg-[#0038A0] text-white">Live</Badge>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b text-xs uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Category</th>
                <th className="text-right p-3">Price</th>
                <th className="text-center p-3">Stock</th>
                <th className="text-center p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No products yet — click “Add Product” to create one.</td></tr>
              ) : (
                products.map((p: any) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-[#F5F7FA]/40">
                    <td className="p-3">
                      <div className="flex gap-3 items-center">
                        <img src={p.image || `https://placehold.co/48x48/0038A0/FFFFFF?text=${p.category[0]}`} alt={p.name} className="h-10 w-10 rounded-lg object-cover border" />
                        <div className="min-w-0">
                          <p className="font-semibold line-clamp-1 max-w-[260px]">{p.name}</p>
                          <p className="text-xs text-zinc-500">{p.slug} • ⭐ {p.rating} • {p.views} views</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3"><Badge variant="secondary" className="text-[11px]">{p.category.replace("_"," ")}</Badge></td>
                    <td className="p-3 text-right font-bold">{formatKES(p.price)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.stockQty < 10 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>{p.stockQty} • {p.inStock ? "In" : "Out"}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.active ? "bg-[#0038A0] text-white" : "bg-zinc-200"}`}>{p.active ? "Active" : "Hidden"}</span>
                      {p.featured && <span className="ml-1 text-[10px] bg-black text-white px-1.5 py-0.5 rounded-full">FEATURED</span>}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/products/${p.slug}/edit`}><Button size="sm" variant="outline" className="h-7 text-xs">Edit</Button></Link>
                        <form action={`/api/products?id=${p.id}&_method=DELETE`} method="post">
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600" type="submit">Del</Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t bg-zinc-50 flex justify-between items-center text-xs text-zinc-500">
          <span>Tip: Edit opens full form • Stock &lt;10 highlighted • Images from Unsplash</span>
          <span>{products.length} shown</span>
        </div>
      </Card>
    </div>
  );
}
