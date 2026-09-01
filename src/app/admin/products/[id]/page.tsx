import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: any = null;
  try {
    product = await prisma.product.findUnique({ where: { id } });
  } catch {}
  if (!product) return notFound();

  const categories = ["CCTV","INTERCOM","ACCESS_CONTROL","BIOMETRICS","NETWORKING","ELECTRIC_FENCE","GATE_AUTOMATION","FIRE_ALARM","SOLAR","SMART_HOME","ELECTRICAL","IT_SUPPORT","ACCESSORIES"];

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link href="/admin/products"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-black">Edit Product</h1>
        <span className="text-xs bg-zinc-100 px-2 py-1 rounded font-mono">{product.id.slice(0,8)}</span>
      </div>

      <Card className="border-2 border-[#7FAF25]/20">
        <div className="h-1 bg-[#7FAF25]" />
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <p className="text-sm text-zinc-500">{product.category.replace("_"," ")} • {product.slug}</p>
        </CardHeader>
        <CardContent>
          <form action={`/api/products?id=${product.id}`} method="post" className="grid md:grid-cols-2 gap-3">
            {/* We use POST with _method=PUT trick — API handles via ?id */}
            <input type="hidden" name="_method" value="PUT" />
            <input name="name" defaultValue={product.name} placeholder="Product name *" required className="md:col-span-2 border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="slug" defaultValue={product.slug} placeholder="slug" required className="border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <select name="category" defaultValue={product.category} required className="border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none bg-white">
              {categories.map(c=> <option key={c} value={c}>{c.replace("_"," ")}</option>)}
            </select>
            <input name="price" type="number" defaultValue={product.price} placeholder="Price KES *" required className="border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="oldPrice" type="number" defaultValue={product.oldPrice || ""} placeholder="Old price" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="image" defaultValue={product.image} placeholder="Image URL" required className="md:col-span-2 border-2 border-zinc-200 focus:border-[#7FAF25] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="stockQty" type="number" defaultValue={product.stockQty} placeholder="Stock qty" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="labourPrice" type="number" defaultValue={product.labourPrice || ""} placeholder="Labour KES" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <textarea name="description" defaultValue={product.description} placeholder="Description" rows={3} className="md:col-span-2 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <div className="md:col-span-2 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={product.featured} className="accent-[#7FAF25]" /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={product.active} className="accent-[#7FAF25]" /> Active</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="installationAvailable" defaultChecked={product.installationAvailable} className="accent-[#7FAF25]" /> Installation</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="inStock" defaultChecked={product.inStock} className="accent-[#7FAF25]" /> In stock</label>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full h-11">Save Changes (PUT)</Button>
            </div>
          </form>

          <form action={`/api/products?id=${product.id}&_method=DELETE`} method="post" className="mt-3">
            <Button type="submit" variant="outline" className="w-full h-11 border-red-200 text-red-700 hover:bg-red-50">Delete Product</Button>
          </form>

          <div className="mt-6 flex gap-3">
            <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover border" />
            <div className="text-xs text-zinc-500 space-y-1">
              <p>Views: {product.views} • Sold: {product.sold} • Rating: {product.rating}</p>
              <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(product.updatedAt).toLocaleString()}</p>
              <p>Stock: {product.stockQty} • Labour: {product.labourPrice ? `${product.labourPrice} KES` : "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
