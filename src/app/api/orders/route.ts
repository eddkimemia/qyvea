import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ orders });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, phone, email, address, includeInstallation, notes, deliveryFee = 0, installationFee = 0 } = body;
    if (!items?.length) return NextResponse.json({ error: "items required" }, { status: 400 });
    const total = items.reduce((sum: number, it: any) => sum + it.price * it.qty, 0) + deliveryFee + installationFee;
    const order = await prisma.order.create({
      data: {
        total,
        deliveryFee,
        installationFee,
        phone,
        email,
        address,
        notes,
        includeInstallation: !!includeInstallation,
        items: { create: items.map((it: any) => ({ productId: it.productId, qty: it.qty, price: it.price })) },
      },
      include: { items: true },
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
