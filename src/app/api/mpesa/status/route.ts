import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const mockStore = globalThis as unknown as { __mpesaStore?: Map<string, any> };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("CheckoutRequestID") || searchParams.get("checkoutRequestId") || searchParams.get("id") || searchParams.get("orderId");
  
  // If orderId provided, check order status directly
  if (searchParams.get("orderId") && !searchParams.get("CheckoutRequestID")) {
    const orderId = searchParams.get("orderId")!;
    try {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return NextResponse.json({ status: "not_found" }, { status: 404 });
      const isPaid = order.status === "CONFIRMED" || order.status === "PROCESSING" || (order.mpesaRef && (order.mpesaRef.startsWith("MOCK") || order.mpesaRef.startsWith("Q") || order.mpesaRef.length > 8));
      // If still PENDING and has mpesaRef that looks like ws_CO, check store
      if (order.mpesaRef && order.mpesaRef.startsWith("ws_CO")) {
        const entry = mockStore.__mpesaStore?.get(order.mpesaRef);
        if (entry) return NextResponse.json({ status: entry.status, order, entry });
      }
      return NextResponse.json({ status: isPaid ? "success" : "pending", order });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  if (!id) return NextResponse.json({ error: "CheckoutRequestID or orderId required" }, { status: 400 });

  const entry = mockStore.__mpesaStore?.get(id);
  if (entry) {
    if (entry.status === "pending" && Date.now() - entry.createdAt > 5 * 60 * 1000) entry.status = "timeout";
    return NextResponse.json({ status: entry.status, amount: entry.amount, phone: entry.phone, orderId: entry.orderId, mpesaReceipt: entry.mpesaReceipt, provider: entry.provider });
  }

  // Fallback to DB
  try {
    const order = await prisma.order.findFirst({ where: { mpesaRef: id } });
    if (order) {
      const isPaid = order.status === "CONFIRMED" || order.status === "PROCESSING";
      return NextResponse.json({ status: isPaid ? "success" : "pending", order });
    }
    const byId = await prisma.order.findUnique({ where: { id } });
    if (byId) {
      const isPaid = byId.status === "CONFIRMED";
      return NextResponse.json({ status: isPaid ? "success" : "pending", order: byId });
    }
  } catch {}

  return NextResponse.json({ status: "not_found", message: "No transaction found" }, { status: 404 });
}
