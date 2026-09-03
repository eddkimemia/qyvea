import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const role = searchParams.get("role");
  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
    ];
  }
  if (role) where.role = role;
  try {
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, name: true, email: true, phone: true, role: true, image: true, refCode: true, createdAt: true },
    });
    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ct = req.headers.get("content-type") || "";
  const isForm = ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded");
  let data: any = {};
  if (isForm) {
    const form = await req.formData();
    data = Object.fromEntries(form.entries());
  } else {
    try { data = await req.json(); } catch { const form = await req.formData(); data = Object.fromEntries(form.entries()); }
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").toLowerCase().trim();
  const phone = String(data.phone || "").trim() || null;
  const role = String(data.role || "USER").toUpperCase();
  const password = String(data.password || "");
  const image = data.image ? String(data.image) : null;

  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  if (!["USER", "CLIENT", "PARTNER", "ADMIN"].includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password min 6 chars" }, { status: 400 });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    const hash = await bcrypt.hash(password, 10);
    const refCode = role === "PARTNER" ? `SYN-${Math.random().toString(36).slice(2, 8).toUpperCase()}` : null;
    const user = await prisma.user.create({
      data: { name: name || email.split("@")[0], email, phone, password: hash, role: role as any, image, refCode },
    });
    if (isForm) return NextResponse.redirect(new URL("/admin/users?created=1", req.url), 303);
    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } }, { status: 201 });
  } catch (e: any) {
    if (isForm) return NextResponse.redirect(new URL(`/admin/users?error=${encodeURIComponent(e.message)}`, req.url), 303);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  let data: any = {};
  try { data = await req.json(); } catch { const form = await req.formData(); data = Object.fromEntries(form.entries()); }
  
  const payload: any = {};
  if (data.name !== undefined) payload.name = String(data.name).trim() || null;
  if (data.email !== undefined) payload.email = String(data.email).toLowerCase().trim();
  if (data.phone !== undefined) payload.phone = String(data.phone).trim() || null;
  if (data.role !== undefined) {
    const r = String(data.role).toUpperCase();
    if (!["USER", "CLIENT", "PARTNER", "ADMIN"].includes(r)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    payload.role = r;
    if (r === "PARTNER" && !data.refCode) {
      // generate if not has
      const u = await prisma.user.findUnique({ where: { id } });
      if (!u?.refCode) payload.refCode = `SYN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    }
    if (r !== "PARTNER") payload.refCode = null;
  }
  if (data.image !== undefined) payload.image = data.image ? String(data.image) : null;
  if (data.password) {
    if (String(data.password).length < 6) return NextResponse.json({ error: "Password min 6" }, { status: 400 });
    payload.password = await bcrypt.hash(String(data.password), 10);
  }
  try {
    const updated = await prisma.user.update({ where: { id }, data: payload });
    return NextResponse.json({ user: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const session = await auth();
  const selfId = (session?.user as any)?.id;
  if (selfId === id) return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  try {
    // check mock admin
    if (id === "mock-admin" || id === "mock-partner") return NextResponse.json({ error: "Cannot delete mock user" }, { status: 400 });
    await prisma.user.delete({ where: { id } });
    // also delete related? cascade handles
    const url = new URL(req.url);
    const isForm = req.headers.get("content-type")?.includes("form") ?? false;
    if (isForm) return NextResponse.redirect(new URL("/admin/users?deleted=1", req.url), 303);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
