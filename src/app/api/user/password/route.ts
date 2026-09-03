import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = session.user.email.toLowerCase();
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Both passwords required" }, { status: 400 });

  // Validate new password strength (same as signup)
  const errors: string[] = [];
  if (newPassword.length < 8) errors.push("At least 8 characters");
  if (newPassword.length > 128) errors.push("Under 128 characters");
  if (!/[A-Z]/.test(newPassword)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(newPassword)) errors.push("One lowercase letter");
  if (!/[0-9]/.test(newPassword)) errors.push("One number");
  if (!/[^A-Za-z0-9]/.test(newPassword)) errors.push("One special character");
  if (errors.length) return NextResponse.json({ error: errors.join(", ") }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return NextResponse.json({ error: "User not found or no password set" }, { status: 404 });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return NextResponse.json({ error: "Current password incorrect" }, { status: 401 });

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hash } });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
