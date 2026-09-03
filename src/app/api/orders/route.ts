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

    // Validate productIds exist and resolve to valid ones
    // This prevents FK constraint violation if cart contains deleted/outdated products
    const validatedItems: any[] = [];
    const skipped: string[] = [];
    for (const it of items) {
      const rawId = String(it.productId);
      let validId: string | null = null;
      let priceToUse = parseInt(String(it.price)) || 0;

      // Try find by id first, then by slug
      try {
        const byId = await prisma.product.findUnique({ where: { id: rawId }, select: { id: true, price: true } });
        if (byId) {
          validId = byId.id;
          // Use DB price to prevent tampering, but allow passed price if DB not available
          if (byId.price) priceToUse = byId.price;
        } else {
          // Try slug fallback (cart may have old slug-based id)
          const bySlug = await prisma.product.findUnique({ where: { slug: rawId }, select: { id: true, price: true } });
          if (bySlug) {
            validId = bySlug.id;
            priceToUse = bySlug.price;
          }
        }
      } catch {}

      if (validId) {
        validatedItems.push({ productId: validId, qty: parseInt(String(it.qty)) || 1, price: priceToUse });
      } else {
        // Check if it's a mock/test product - try to find any fallback product
        skipped.push(it.name || rawId);
      }
    }

    // If all items invalid, try fallback to first available product or generic handling
    if (validatedItems.length === 0) {
      // Try to create order with a generic note instead of failing FK
      // Find a fallback product to satisfy FK (or create order without items and store items in notes)
      const fallback = await prisma.product.findFirst({ select: { id: true, price: true } });
      if (fallback && skipped.length > 0) {
        // Create a single fallback item representing the cart
        const totalFallback = items.reduce((sum: number, it: any) => sum + (parseInt(String(it.price)) || 0) * (parseInt(String(it.qty)) || 1), 0) + deliveryFee + installationFee;
        const enrichedNotes = `${notes || ""}\n[Original cart items unavailable - using fallback. Skipped: ${skipped.join(", ")}. Original total: ${totalFallback}]`.trim();
        const order = await prisma.order.create({
          data: {
            total: totalFallback,
            deliveryFee,
            installationFee,
            phone,
            email,
            address,
            notes: enrichedNotes,
            includeInstallation: !!includeInstallation,
            items: { create: [{ productId: fallback.id, qty: 1, price: totalFallback - deliveryFee - installationFee }] },
          },
          include: { items: true },
        });
        return NextResponse.json({ order, warning: `Some cart items were unavailable (${skipped.join(", ")}). Order created with fallback. Please update cart.` }, { status: 201 });
      }
      return NextResponse.json(
        {
          error: `Cart contains unavailable products (${skipped.join(", ") || "unknown"}). Please clear cart and add products again from shop.`,
          code: "INVALID_CART",
          skipped,
        },
        { status: 400 }
      );
    }

    const total = validatedItems.reduce((sum: number, it: any) => sum + it.price * it.qty, 0) + deliveryFee + installationFee;
    const enrichedNotes = skipped.length ? `${notes || ""}\n[Note: Skipped unavailable items: ${skipped.join(", ")}]`.trim() : notes;

    const order = await prisma.order.create({
      data: {
        total,
        deliveryFee,
        installationFee,
        phone,
        email,
        address,
        notes: enrichedNotes,
        includeInstallation: !!includeInstallation,
        items: { create: validatedItems },
      },
      include: { items: true },
    });

    const response: any = { order };
    if (skipped.length) response.warning = `Skipped unavailable items: ${skipped.join(", ")}`;
    return NextResponse.json(response, { status: 201 });
  } catch (e: any) {
    // Handle FK violation specifically
    const msg = e.message || "Order failed";
    if (msg.includes("Foreign key constraint") || msg.includes("OrderItem_productId_fkey")) {
      return NextResponse.json(
        {
          error: "Some products in your cart are no longer available. Please clear cart, refresh shop and add again.",
          code: "FK_VIOLATION",
          details: msg,
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
