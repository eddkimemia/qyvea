import { prisma } from "@/lib/db";
import { ServicesManager } from "@/components/admin/services-manager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({ orderBy: { title: "asc" } });
  } catch {
    services = [];
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black">Services</h1>
        <p className="text-sm text-zinc-500">Edit all service pages — title, excerpt, description, image, price, featured. Changes reflect on /services/* instantly.</p>
      </div>
      <ServicesManager initial={JSON.parse(JSON.stringify(services))} />
    </div>
  );
}
