import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/services"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-black">Add Service</h1>
      </div>
      <ServiceForm />
    </div>
  );
}
