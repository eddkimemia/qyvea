import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const slugs = searchParams.get("slugs");
  const take = Math.min(parseInt(searchParams.get("take") || "20"), 100);
  const skip = parseInt(searchParams.get("skip") || "0");

  const where: any = { active: true };
  if (q) where.name = { contains: q, mode: "insensitive" };
  if (category) where.category = category;
  if (featured) where.featured = featured === "true";
  if (slugs) where.slug = { in: slugs.split(",").map((s) => s.trim()) };

  try {
    const [items, total] = await Promise.all([
      prisma.product.findMany({ where, take, skip, orderBy: { createdAt: "desc" } }),
      prisma.product.count({ where }),
    ]);
    return NextResponse.json({ items, products: items, total, take, skip });
  } catch (e: any) {
    return NextResponse.json({ items: [], total: 0, error: e.message }, { status: 500 });
  }
}

function parseBool(v: any) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "boolean") return v;
  if (v === "on" || v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return Boolean(v);
}

async function handleUpsert(data: any, id?: string) {
  const payload: any = {};
  // Map form fields to prisma fields
  if (data.name) payload.name = String(data.name);
  if (data.slug) payload.slug = String(data.slug).toLowerCase().trim().replace(/\s+/g, "-");
  if (data.category) payload.category = String(data.category);
  if (data.price) payload.price = parseInt(String(data.price));
  if (data.oldPrice) payload.oldPrice = data.oldPrice ? parseInt(String(data.oldPrice)) : null;
  else if (data.oldPrice === "" || data.oldPrice === null) payload.oldPrice = null;
  if (data.image) payload.image = String(data.image);
  if (data.description) payload.description = String(data.description);
  if (data.stockQty !== undefined) payload.stockQty = parseInt(String(data.stockQty)) || 0;
  if (data.labourPrice !== undefined) payload.labourPrice = data.labourPrice ? parseInt(String(data.labourPrice)) : null;
  if (data.badge !== undefined) payload.badge = data.badge ? String(data.badge) : null;

  const featured = parseBool(data.featured);
  if (featured !== undefined) payload.featured = featured;
  const active = parseBool(data.active);
  if (active !== undefined) payload.active = active;
  const installationAvailable = parseBool(data.installationAvailable);
  if (installationAvailable !== undefined) payload.installationAvailable = installationAvailable;
  const inStock = parseBool(data.inStock);
  if (inStock !== undefined) payload.inStock = inStock;

  if (payload.stockQty !== undefined) payload.inStock = payload.stockQty > 0;
  if (payload.image && !payload.images) payload.images = [payload.image];

  // Defaults for create
  if (!id) {
    payload.rating = 4.5;
    payload.reviewsCount = 0;
    payload.views = 0;
    payload.sold = 0;
    payload.tags = payload.category ? [payload.category, "Syntech"] : ["Syntech"];
    if (payload.price && !payload.specs) {
      payload.specs = [
        { key: "Warranty", value: "5 Years Workmanship + Manufacturer" },
        { key: "Installation", value: payload.installationAvailable ? "Available Same-Day in Nairobi" : "Product Only" },
      ];
    }
  }

  if (id) {
    // clean undefined to avoid overwriting with null
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
    return await prisma.product.update({ where: { id }, data: payload });
  } else {
    return await prisma.product.create({ data: payload });
  }
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const methodOverride = url.searchParams.get("_method");
  const ct = req.headers.get("content-type") || "";

  // Handle form submissions (admin UI)
  const isForm = ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded");

  try {
    let data: any = {};
    let override = methodOverride;

    if (isForm) {
      const form = await req.formData();
      data = Object.fromEntries(form.entries());
      // form may contain _method
      if (data._method) override = String(data._method).toUpperCase();
    } else {
      try {
        data = await req.json();
      } catch {
        // fallback to formData if json fails
        const form = await req.formData();
        data = Object.fromEntries(form.entries());
        if (data._method) override = String(data._method).toUpperCase();
      }
      if (data._method) override = String(data._method).toUpperCase();
    }

    // DELETE via POST override
    if (override === "DELETE" && id) {
      await prisma.product.delete({ where: { id } });
      if (isForm) return NextResponse.redirect(new URL("/admin/products?deleted=1", req.url), 303);
      return NextResponse.json({ ok: true });
    }

    // UPDATE via POST override
    if ((override === "PUT" || override === "PATCH") && id) {
      const updated = await handleUpsert(data, id);
      if (isForm) return NextResponse.redirect(new URL(`/admin/products/${id}?updated=1`, req.url), 303);
      return NextResponse.json(updated);
    }

    // CREATE (no id)
    if (!id) {
      const created = await handleUpsert(data);
      if (isForm) return NextResponse.redirect(new URL("/admin/products?created=1", req.url), 303);
      return NextResponse.json(created, { status: 201 });
    }

    // If id but no override, treat as PUT
    if (id) {
      const updated = await handleUpsert(data, id);
      if (isForm) return NextResponse.redirect(new URL(`/admin/products/${id}?updated=1`, req.url), 303);
      return NextResponse.json(updated);
    }

    // fallback
    const created = await handleUpsert(data);
    if (isForm) return NextResponse.redirect(new URL("/admin/products?created=1", req.url), 303);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (isForm) {
      return NextResponse.redirect(new URL(`/admin/products?error=${encodeURIComponent(e.message)}`, req.url), 303);
    }
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try {
    const body = await req.json();
    const updated = await handleUpsert(body, id);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
