import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    return NextResponse.json({ settings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function parseBool(v: any) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "boolean") return v;
  if (v === "on" || v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return Boolean(v);
}

export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  const isForm = ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded");
  try {
    let data: any = {};
    if (isForm) {
      const form = await req.formData();
      data = Object.fromEntries(form.entries());
    } else {
      data = await req.json();
    }

    const payload: any = {};
    const strFields = ["whatsappNumber","phone","phoneDisplay","email","address","siteName","siteTagline","siteDescription","siteUrl","logoUrl","faviconUrl","promoText","promoCode","businessHours","facebookUrl","instagramUrl","linkedinUrl","tiktokUrl","xUrl","youtubeUrl","currency"];
    for (const f of strFields) {
      if (data[f] !== undefined) {
        const v = String(data[f]).trim();
        if (f === "whatsappNumber") payload[f] = v.replace(/\D/g, "");
        else payload[f] = v || null;
      }
    }
    if (data.promoActive !== undefined) payload.promoActive = parseBool(data.promoActive) ?? false;
    if (data.maintenanceMode !== undefined) payload.maintenanceMode = parseBool(data.maintenanceMode) ?? false;
    if (data.defaultDeliveryFee !== undefined) payload.defaultDeliveryFee = parseInt(String(data.defaultDeliveryFee)) || 0;
    if (data.taxRate !== undefined) payload.taxRate = parseFloat(String(data.taxRate)) || 0;

    const updated = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: payload,
      create: { id: "singleton", ...payload },
    });

    if (isForm) return NextResponse.redirect(new URL("/admin/settings?saved=1", req.url), 303);
    return NextResponse.json({ settings: updated });
  } catch (e: any) {
    if (isForm) return NextResponse.redirect(new URL(`/admin/settings?error=${encodeURIComponent(e.message)}`, req.url), 303);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
