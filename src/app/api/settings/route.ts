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
    if (data.whatsappNumber) payload.whatsappNumber = String(data.whatsappNumber).replace(/\D/g, "");
    if (data.promoText !== undefined) payload.promoText = String(data.promoText);
    if (data.promoCode !== undefined) payload.promoCode = String(data.promoCode);
    if (data.promoActive !== undefined) {
      const v = data.promoActive;
      payload.promoActive = v === "on" || v === "true" || v === true || v === "1";
    }

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
