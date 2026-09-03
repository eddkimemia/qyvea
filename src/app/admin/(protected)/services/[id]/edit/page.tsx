import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ServiceForm } from "@/components/admin/service-form";
import { ExternalLink, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let service: any = null;
  try {
    service = await prisma.service.findUnique({ where: { id } });
  } catch {}
  if (!service) return notFound();

  // Map slug to public URL: ServiceSlug enum to path
  const slugMap: Record<string, string> = {
    CCTV: "cctv",
    BIOMETRICS: "biometrics",
    ELECTRIC_FENCE: "electric-fence",
    AUTOMATIC_GATES: "automatic-gates",
    FIRE_ALARM: "fire-alarm-systems",
    NETWORKING: "networking",
    SMART_HOME: "smart-home-automation",
    SOLAR_INSTALLATION: "solar-installation",
    SOLAR_BACKUP: "solar-solutions",
    ELECTRICAL_INSTALLATION: "electrical-installation",
    BMS: "bms",
    CYBERSECURITY: "cybersecurity",
    SYSTEM_INTEGRATION: "system-integration",
    IT_SUPPORT: "it-support",
    MAINTENANCE: "maintenance",
    ESTATE_SOLUTIONS: "estates",
    WEBSITE_DESIGN: "website-design",
    GRAPHIC_DESIGN: "graphic-design",
    AI_SOLUTIONS: "ai-solutions",
  };
  const publicSlug = slugMap[service.slug] || service.slug.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/services" className="hover:text-[#0038A0] hover:underline">Services</Link>
        <span>/</span>
        <span className="text-zinc-900 font-medium">{service.title}</span>
        <span>/</span>
        <span className="text-[#0038A0] font-semibold">Edit</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4 items-start">
          <img src={service.image || "https://placehold.co/80x80/0038A0/FFFFFF?text=S"} alt={service.title} className="h-16 w-16 rounded-2xl object-cover border-2 border-[#0038A0]/10 shadow-sm hidden sm:block" />
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 flex-wrap">
              Edit Service
              <Badge variant="secondary" className="font-mono text-xs">{service.slug}</Badge>
              {service.featured && <Badge className="bg-black text-white text-xs">FEATURED</Badge>}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">Public: <span className="font-mono">/services/{publicSlug}</span> • Updated {new Date(service.updatedAt).toLocaleDateString()}</p>
            <div className="flex gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${service.active ? "bg-green-100 text-green-700 border border-green-200" : "bg-zinc-200 text-zinc-700"}`}>{service.active ? "Active — visible" : "Hidden"}</span>
              {service.priceFrom && <span className="text-xs px-2.5 py-1 rounded-full bg-[#0038A0] text-white font-bold">From KES {service.priceFrom.toLocaleString()}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/services/${publicSlug}`} target="_blank"><Button variant="outline" size="sm" className="gap-1.5"><Eye className="h-4 w-4" /> View</Button></Link>
          <Link href="/admin/services"><Button variant="ghost" size="sm">← Back</Button></Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <ServiceForm initial={service} id={service.id} />

        <div className="space-y-4 sticky top-20">
          <Card className="overflow-hidden border-2 border-[#0038A0]/10">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader className="pb-3"><CardTitle className="text-base">Live Preview</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="aspect-[16/9] rounded-xl overflow-hidden border bg-zinc-50">
                <img src={service.image || "https://placehold.co/400x220/0038A0/FFFFFF?text=Service"} alt={service.title} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-bold leading-tight">{service.title}</p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-3">{service.excerpt || service.description?.slice(0, 120) || "No excerpt"}</p>
              </div>
              <Link href={`/services/${publicSlug}`} target="_blank" className="block"><Button variant="outline" size="sm" className="w-full gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> View on site</Button></Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Service Meta</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between border-b py-2"><span className="text-zinc-500">ID</span><span className="font-mono">{service.id.slice(0, 12)}...</span></div>
              <div className="flex justify-between border-b py-2"><span className="text-zinc-500">Slug</span><span className="font-mono">{service.slug}</span></div>
              <div className="flex justify-between border-b py-2"><span className="text-zinc-500">Icon</span><span>{service.icon || "—"}</span></div>
              <div className="flex justify-between py-2"><span className="text-zinc-500">Created</span><span>{new Date(service.createdAt).toLocaleDateString()}</span></div>
            </CardContent>
          </Card>

          <Card className="border-[#0038A0]/20 bg-[#F5F7FA]/50">
            <CardContent className="p-4 space-y-2 text-sm">
              <p className="font-bold">Quick Actions</p>
              <Link href="/admin/services/new" className="block"><Button variant="outline" size="sm" className="w-full">+ Add Another Service</Button></Link>
              <Link href="/admin/services" className="block"><Button variant="ghost" size="sm" className="w-full">← All Services</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
