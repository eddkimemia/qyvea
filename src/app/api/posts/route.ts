import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const where: any = {};
  if (q) where.title = { contains: q, mode: "insensitive" };
  const published = searchParams.get("published");
  if (published) where.published = published === "true";
  try {
    const posts = await prisma.post.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ posts });
  } catch (e: any) {
    return NextResponse.json({ posts: [], error: e.message }, { status: 500 });
  }
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const methodOverride = url.searchParams.get("_method");
  const ct = req.headers.get("content-type") || "";
  const isForm = ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded");
  try {
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
      await prisma.post.delete({ where: { id } });
      if (isForm) return NextResponse.redirect(new URL("/admin/blog?deleted=1", req.url), 303);
      return NextResponse.json({ ok: true });
    }
    if ((override === "PUT" || override === "PATCH") && id) {
      const payload: any = {
        title: data.title ? String(data.title) : undefined,
        slug: data.slug ? slugify(String(data.slug)) : data.title ? slugify(String(data.title)) : undefined,
        excerpt: data.excerpt ? String(data.excerpt) : undefined,
        content: data.content ? String(data.content) : undefined,
        image: data.image ? String(data.image) : undefined,
        seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
        seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
        tags: data.tags ? String(data.tags).split(",").map((t:string)=>t.trim()).filter(Boolean) : undefined,
        published: data.published === "on" || data.published === "true" || data.published === true,
        featured: data.featured === "on" || data.featured === "true" || data.featured === true,
      };
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
      const updated = await prisma.post.update({ where: { id }, data: payload });
      if (isForm) return NextResponse.redirect(new URL(`/admin/blog/${id}?updated=1`, req.url), 303);
      return NextResponse.json(updated);
    }
    if (!id) {
      const payload: any = {
        title: String(data.title),
        slug: data.slug ? slugify(String(data.slug)) : slugify(String(data.title)),
        excerpt: data.excerpt ? String(data.excerpt) : null,
        content: String(data.content || ""),
        image: data.image ? String(data.image) : null,
        seoTitle: data.seoTitle ? String(data.seoTitle) : null,
        seoDescription: data.seoDescription ? String(data.seoDescription) : null,
        tags: data.tags ? String(data.tags).split(",").map((t:string)=>t.trim()).filter(Boolean) : [],
        published: data.published === "on" || data.published === "true" || data.published === true,
        featured: data.featured === "on" || data.featured === "true" || data.featured === true,
      };
      const created = await prisma.post.create({ data: payload });
      if (isForm) return NextResponse.redirect(new URL("/admin/blog?created=1", req.url), 303);
      return NextResponse.json(created, { status: 201 });
    }
    // fallback PUT
    if (id) {
      const payload: any = {
        title: data.title ? String(data.title) : undefined,
        slug: data.slug ? slugify(String(data.slug)) : undefined,
        excerpt: data.excerpt ? String(data.excerpt) : undefined,
        content: data.content ? String(data.content) : undefined,
        image: data.image ? String(data.image) : undefined,
        seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
        seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
        tags: data.tags ? String(data.tags).split(",").map((t:string)=>t.trim()).filter(Boolean) : undefined,
        published: data.published !== undefined ? (data.published === "on" || data.published === "true" || data.published === true) : undefined,
        featured: data.featured !== undefined ? (data.featured === "on" || data.featured === "true" || data.featured === true) : undefined,
      };
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
      const updated = await prisma.post.update({ where: { id }, data: payload });
      if (isForm) return NextResponse.redirect(new URL(`/admin/blog/${id}?updated=1`, req.url), 303);
      return NextResponse.json(updated);
    }
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  } catch (e: any) {
    if (isForm) return NextResponse.redirect(new URL(`/admin/blog?error=${encodeURIComponent(e.message)}`, req.url), 303);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try {
    const body = await req.json();
    const updated = await prisma.post.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try { await prisma.post.delete({ where: { id } }); return NextResponse.json({ ok: true }); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
