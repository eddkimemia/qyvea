import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { title: "asc" } });
    return NextResponse.json({ services });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const methodOverride = url.searchParams.get("_method");
  const ct = req.headers.get("content-type") || "";
  const isForm = ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded");
  let data: any = {};
  let override = methodOverride;
  if (isForm) {
    const form = await req.formData();
    data = Object.fromEntries(form.entries());
    if (data._method) override = String(data._method).toUpperCase();
  } else {
    try { data = await req.json(); } catch { const form = await req.formData(); data = Object.fromEntries(form.entries()); if (data._method) override = String(data._method).toUpperCase(); }
    if (data._method) override = String(data._method).toUpperCase();
  }

  if (override === "DELETE" && id) {
    try {
      await prisma.service.delete({ where: { id } });
      if (isForm) return NextResponse.redirect(new URL("/admin/services?deleted=1", req.url), 303);
      return NextResponse.json({ ok: true });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
  }

  // handle upsert
  const payload: any = {};
  if (data.slug) payload.slug = String(data.slug).toUpperCase() as any;
  if (data.title) payload.title = String(data.title);
  if (data.excerpt !== undefined) payload.excerpt = data.excerpt ? String(data.excerpt) : null;
  if (data.description !== undefined) payload.description = data.description ? String(data.description) : null;
  if (data.icon !== undefined) payload.icon = data.icon ? String(data.icon) : null;
  if (data.image !== undefined) payload.image = data.image ? String(data.image) : null;
  if (data.priceFrom !== undefined) payload.priceFrom = data.priceFrom ? parseInt(String(data.priceFrom)) : null;
  if (data.featured !== undefined) payload.featured = data.featured === "on" || data.featured === "true" || data.featured === true;
  if (data.active !== undefined) payload.active = data.active === "on" || data.active === "true" || data.active === true;

  try {
    if (id && (override === "PUT" || override === "PATCH")) {
      const updated = await prisma.service.update({ where: { id }, data: payload });
      if (isForm) return NextResponse.redirect(new URL(`/admin/services?updated=1`, req.url), 303);
      return NextResponse.json(updated);
    }
    if (!id) {
      // create needs slug
      if (!payload.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
      const created = await prisma.service.create({ data: payload });
      if (isForm) return NextResponse.redirect(new URL("/admin/services?created=1", req.url), 303);
      return NextResponse.json(created, { status: 201 });
    }
    // fallback update by id
    if (id) {
      const updated = await prisma.service.update({ where: { id }, data: payload });
      return NextResponse.json(updated);
    }
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  } catch (e: any) {
    if (isForm) return NextResponse.redirect(new URL(`/admin/services?error=${encodeURIComponent(e.message)}`, req.url), 303);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const body = await req.json();
  try {
    const updated = await prisma.service.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
