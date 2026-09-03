import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Daraja callback structure: body.Body.stkCallback
    const stk = body?.Body?.stkCallback;
    if (!stk) {
      // Generic fallback for mock or other provider
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const CheckoutRequestID = stk.CheckoutRequestID;
    const ResultCode = stk.ResultCode;
    const ResultDesc = stk.ResultDesc;
    const CallbackMetadata = stk.CallbackMetadata;

    // Extract MpesaReceiptNumber and Amount if success
    let receipt: string | null = null;
    let amount: number | null = null;
    let phone: string | null = null;
    if (CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") receipt = item.Value;
        if (item.Name === "Amount") amount = item.Value;
        if (item.Name === "PhoneNumber") phone = String(item.Value);
      }
    }

    if (CheckoutRequestID) {
      // Update mock store if exists
      const mockStore = globalThis as unknown as { __mpesaStore?: Map<string, any> };
      const entry = mockStore.__mpesaStore?.get(CheckoutRequestID);
      if (entry) {
        entry.status = ResultCode === 0 ? "success" : "failed";
        entry.mpesaReceipt = receipt;
        entry.resultDesc = ResultDesc;
        mockStore.__mpesaStore!.set(CheckoutRequestID, entry);
      }

      // Update order
      try {
        const order = await prisma.order.findFirst({ where: { mpesaRef: CheckoutRequestID } });
        if (order) {
          if (ResultCode === 0) {
            await prisma.order.update({
              where: { id: order.id },
              data: { mpesaRef: receipt || CheckoutRequestID, status: "CONFIRMED" as any },
            });
          } else {
            await prisma.order.update({
              where: { id: order.id },
              data: { notes: `${order.notes || ""}\nMpesa failed: ${ResultDesc}`.trim() },
            });
          }
        } else {
          // try to find by CheckoutRequestID stored as mpesaRef exactly
          // no order, just acknowledge
        }
      } catch (e) {
        console.error("Callback order update failed", e);
      }
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (e: any) {
    console.error("Mpesa callback error", e);
    return NextResponse.json({ ResultCode: 1, ResultDesc: e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "POST Daraja callback to this endpoint. Configure MPESA_CALLBACK_URL to https://<domain>/api/mpesa/callback" });
}
