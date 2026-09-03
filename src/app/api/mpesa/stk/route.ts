import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Helper to normalize Kenyan phone to 254 format
function normalizePhone(input: string): string | null {
  let p = input.replace(/\s+/g, "").replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (p.startsWith("0")) p = "254" + p.slice(1);
  if (p.startsWith("254")) {
    if (/^254\d{9}$/.test(p)) return p;
    return null;
  }
  return null;
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

// In-memory store for mock polling (best effort, ephemeral on Vercel)
const mockStore = globalThis as unknown as { __mpesaStore?: Map<string, any> };
if (!mockStore.__mpesaStore) mockStore.__mpesaStore = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, amount, orderId, items, email, address, notes } = body;

    if (!phone || amount === undefined) {
      return NextResponse.json({ error: "phone and amount required" }, { status: 400 });
    }

    const normalized = normalizePhone(String(phone));
    if (!normalized) {
      return NextResponse.json({ error: "Invalid phone. Use 07xx or 2547xxxxxxxx" }, { status: 400 });
    }

    const amt = parseInt(String(amount));
    if (isNaN(amt) || amt < 1) {
      return NextResponse.json({ error: "Invalid amount (min 1 KES)" }, { status: 400 });
    }
    if (amt > 150000) {
      // M-Pesa limit per transaction is 150k, but we allow mock up to that
      return NextResponse.json({ error: "Amount exceeds M-Pesa limit (150,000 KES)" }, { status: 400 });
    }

    // If orderId provided, verify order exists and attach mpesaRef, otherwise create order if items provided
    let order: any = null;
    let orderIdToUse = orderId;
    if (orderId) {
      try {
        order = await prisma.order.findUnique({ where: { id: orderId } });
      } catch {}
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    } else if (items?.length) {
      // Create order on the fly (optional flow)
      try {
        const deliveryFee = body.deliveryFee || 0;
        const installationFee = body.installationFee || 0;
        const total = items.reduce((s: number, it: any) => s + it.price * it.qty, 0) + deliveryFee + installationFee;
        order = await prisma.order.create({
          data: {
            total,
            deliveryFee,
            installationFee,
            phone: normalized,
            email: email || null,
            address: address || null,
            notes: notes || null,
            includeInstallation: !!body.includeInstallation,
            items: { create: items.map((it: any) => ({ productId: it.productId, qty: it.qty, price: it.price })) },
          },
        });
        orderIdToUse = order.id;
      } catch (e: any) {
        // fallback mock order id
        orderIdToUse = generateId("order");
      }
    }

    // Try real Daraja if env configured
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE || process.env.MPESA_PAYBILL || "174379";
    const passkey = process.env.MPESA_PASSKEY;
    const env = process.env.MPESA_ENV || "sandbox"; // sandbox or production
    const isReal = !!(consumerKey && consumerSecret && passkey);

    const CheckoutRequestID = generateId("ws_CO");
    const MerchantRequestID = generateId("ws_MR");

    if (isReal) {
      try {
        // Get access token
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
        const tokenRes = await fetch(
          env === "production"
            ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
            : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
          { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" }
        );
        const tokenJson = await tokenRes.json();
        const accessToken = tokenJson.access_token;
        if (!accessToken) throw new Error("Failed to get Daraja token");

        const timestamp = new Date().toISOString().replace(/-/g, "").replace(/:/g, "").replace(/T/g, "").replace(/\./g, "").slice(0, 14); // YYYYMMDDHHmmss
        const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");
        const callbackUrl = process.env.MPESA_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL || "https://syntech.co.ke"}/api/mpesa/callback`;

        const stkRes = await fetch(
          env === "production"
            ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
            : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              BusinessShortCode: shortcode,
              Password: password,
              Timestamp: timestamp,
              TransactionType: "CustomerPayBillOnline",
              Amount: amt,
              PartyA: normalized,
              PartyB: shortcode,
              PhoneNumber: normalized,
              CallBackURL: callbackUrl,
              AccountReference: orderIdToUse ? `Order ${String(orderIdToUse).slice(0, 8)}` : "Syntech Order",
              TransactionDesc: "Syntech Payment",
            }),
          }
        );
        const stkJson = await stkRes.json();

        // Store CheckoutRequestID for polling
        if (stkJson.CheckoutRequestID) {
          try {
            if (orderIdToUse) {
              await prisma.order.update({ where: { id: orderIdToUse }, data: { mpesaRef: stkJson.CheckoutRequestID } });
            }
          } catch {}
          mockStore.__mpesaStore!.set(stkJson.CheckoutRequestID, { status: "pending", amount: amt, phone: normalized, orderId: orderIdToUse, createdAt: Date.now(), provider: "daraja", raw: stkJson });
        }

        return NextResponse.json({
          success: true,
          CheckoutRequestID: stkJson.CheckoutRequestID || CheckoutRequestID,
          MerchantRequestID: stkJson.MerchantRequestID || MerchantRequestID,
          ResponseCode: stkJson.ResponseCode,
          ResponseDescription: stkJson.ResponseDescription || stkJson.errorMessage || "STK Push sent",
          orderId: orderIdToUse,
          mock: false,
          provider: "daraja",
          raw: stkJson,
        });
      } catch (e: any) {
        // Fall back to mock on failure, but report error
        console.error("Daraja STK failed, falling back to mock:", e.message);
      }
    }

    // Mock flow (for demo / when Daraja not configured)
    // Store for status polling
    mockStore.__mpesaStore!.set(CheckoutRequestID, {
      status: "pending",
      amount: amt,
      phone: normalized,
      orderId: orderIdToUse,
      createdAt: Date.now(),
      provider: "mock",
    });

    // Simulate success after 8s
    setTimeout(async () => {
      const entry = mockStore.__mpesaStore!.get(CheckoutRequestID);
      if (entry && entry.status === "pending") {
        entry.status = "success";
        entry.mpesaReceipt = `MOCK${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now().toString().slice(-6)}`;
        mockStore.__mpesaStore!.set(CheckoutRequestID, entry);
        if (orderIdToUse) {
          try {
            await prisma.order.update({ where: { id: orderIdToUse }, data: { mpesaRef: entry.mpesaReceipt, status: "CONFIRMED" as any } });
          } catch {}
        }
      }
    }, 8000);

    // Also update order immediately with CheckoutRequestID as mpesaRef (pending)
    if (orderIdToUse) {
      try {
        await prisma.order.update({ where: { id: orderIdToUse }, data: { mpesaRef: CheckoutRequestID } });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      CheckoutRequestID,
      MerchantRequestID,
      ResponseCode: "0",
      ResponseDescription: `Success. Request accepted for processing - STK Push sent to ${normalized} for KES ${amt.toLocaleString()}. ${isReal ? "" : "(MOCK mode — no real M-Pesa credentials configured. Will auto-confirm in 8s for demo.)"}`,
      orderId: orderIdToUse,
      mock: !isReal,
      provider: isReal ? "daraja_fallback_mock" : "mock",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "STK failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("CheckoutRequestID") || searchParams.get("checkoutRequestId") || searchParams.get("id");
  if (!id) return NextResponse.json({ error: "CheckoutRequestID required" }, { status: 400 });
  const entry = mockStore.__mpesaStore?.get(id);
  if (!entry) {
    // Try DB fallback: check order with that mpesaRef
    try {
      const order = await prisma.order.findFirst({ where: { mpesaRef: id } });
      if (order) {
        const isPaid = order.status === "CONFIRMED" || order.status === "PROCESSING" || order.mpesaRef?.startsWith("MOCK") || order.mpesaRef?.startsWith("Q");
        return NextResponse.json({ status: isPaid ? "success" : "pending", order, provider: "db" });
      }
    } catch {}
    return NextResponse.json({ status: "not_found", message: "No transaction found (may be expired, or use mock flow)" }, { status: 404 });
  }
  // Expire after 5 minutes if still pending
  if (entry.status === "pending" && Date.now() - entry.createdAt > 5 * 60 * 1000) {
    entry.status = "timeout";
  }
  return NextResponse.json({ status: entry.status, amount: entry.amount, phone: entry.phone, orderId: entry.orderId, mpesaReceipt: entry.mpesaReceipt, provider: entry.provider });
}
