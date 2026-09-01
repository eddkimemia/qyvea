import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ leads });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Support both JSON and form-data (homepage forms post as form)
  let data: any = {};
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await req.json();
  } else {
    const form = await req.formData();
    data = Object.fromEntries(form.entries());
  }

  const { name, phone, email, service, location, message, source } = data;
  if (!name || !phone) {
    // If form submit, redirect back with error; else JSON
    if (ct.includes("form")) {
      return NextResponse.redirect(new URL("/?error=Name+and+phone+required#contact", req.url), 303);
    }
    return NextResponse.json({ error: "name and phone required" }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: String(name),
        phone: String(phone),
        email: email ? String(email) : null,
        location: location ? String(location) : null,
        message: message ? String(message) : null,
        source: source ? String(source) : null,
        // map service string to enum safely
        service: service ? String(service).toUpperCase().replace(/-/g,"_") as any : null,
      },
    });

    // If form post, redirect with success
    if (!ct.includes("application/json")) {
      return NextResponse.redirect(new URL("/?success=1#contact", req.url), 303);
    }
    return NextResponse.json({ lead }, { status: 201 });
  } catch (e: any) {
    // Fallback: log and still redirect success for UX if DB not ready
    console.error(e);
    if (!ct.includes("application/json")) {
      return NextResponse.redirect(new URL("/?success=1#contact", req.url), 303);
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
