import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/products"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-black">Add Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
