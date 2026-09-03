import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: any = null;
  try {
    product = await prisma.product.findUnique({ where: { id } });
  } catch {}
  if (!product) return notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/products"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-black">Edit Product</h1>
        <span className="text-xs bg-zinc-100 px-2 py-1 rounded font-mono">{product.id.slice(0, 8)}</span>
      </div>
      <ProductForm initial={product} id={product.id} />
      <div className="max-w-4xl text-xs text-zinc-500 space-y-1 border rounded-xl p-3 bg-zinc-50">
        <p>Views: {product.views} • Sold: {product.sold} • Rating: {product.rating}</p>
        <p>Created: {new Date(product.createdAt).toLocaleString()} • Updated: {new Date(product.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
