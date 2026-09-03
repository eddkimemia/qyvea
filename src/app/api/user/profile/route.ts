import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = session.user.email.toLowerCase();
  const { name, phone, image } = await req.json();

  if (name && name.length > 100) return NextResponse.json({ error: "Name too long" }, { status: 400 });
  if (phone && phone.length > 20) return NextResponse.json({ error: "Phone too long" }, { status: 400 });

  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        name: name ? String(name).trim() : undefined,
        phone: phone ? String(phone).trim() : undefined,
        image: image ? String(image).trim() : undefined,
      },
      select: { id: true, name: true, email: true, phone: true, image: true, role: true },
    });
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = session.user.email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true, phone: true, image: true, role: true, refCode: true, createdAt: true } });
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
