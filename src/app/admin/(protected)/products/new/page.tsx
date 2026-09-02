import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewProductPage() {
  const categories = ["CCTV","INTERCOM","ACCESS_CONTROL","BIOMETRICS","NETWORKING","ELECTRIC_FENCE","GATE_AUTOMATION","FIRE_ALARM","SOLAR","SMART_HOME","ELECTRICAL","IT_SUPPORT","ACCESSORIES"];
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link href="/admin/products"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-black">Add Product</h1>
      </div>
      <Card className="border-2 border-[#0038A0]/20">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader><CardTitle>Add New Product</CardTitle><p className="text-sm text-zinc-500">Add a new product to your store. The image will be displayed in the shop.</p></CardHeader>
        <CardContent>
          <form action="/api/products" method="post" className="grid md:grid-cols-2 gap-3">
            <input name="name" placeholder="Product name *" required className="md:col-span-2 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="slug" placeholder="slug e.g. hikvision-ptz-4mp" required className="border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <select name="category" required className="border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none bg-white">
              <option value="">Category *</option>
              {categories.map(c=> <option key={c} value={c}>{c.replace("_"," ")}</option>)}
            </select>
            <input name="price" type="number" placeholder="Price KES *" required className="border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="oldPrice" type="number" placeholder="Old price KES (optional)" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="image" placeholder="Image URL (Unsplash) *" required className="md:col-span-2 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" defaultValue="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80" />
            <input name="stockQty" type="number" placeholder="Stock qty" defaultValue={10} className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="labourPrice" type="number" placeholder="Labour KES (if install)" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <textarea name="description" placeholder="Description" rows={3} className="md:col-span-2 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            <div className="md:col-span-2 flex gap-3">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" className="accent-[#0038A0]" /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked className="accent-[#0038A0]" /> Active</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="installationAvailable" className="accent-[#0038A0]" /> Installation available</label>
            </div>
            <Button type="submit" className="md:col-span-2 h-11">Create Product</Button>
            <p className="md:col-span-2 text-xs text-zinc-500 text-center">Product will appear in your shop immediately.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
