"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";
import { ShieldCheck, Clock, Award, Phone, ArrowRight, CheckCircle2, Send } from "lucide-react";

const SERVICES = [
  "CCTV Installation",
  "Biometric Access Control",
  "Electric Fencing",
  "Automatic Gates",
  "Fire Alarm Systems",
  "Networking & Structured Cabling",
  "Smart Home Automation",
  "Solar Installation",
  "Solar Backup Solutions",
  "Electrical Installation",
  "Building Management System",
  "Cybersecurity",
  "System Integration",
  "IT Support",
  "Website Design",
  "Graphic Design",
  "AI Solutions",
  "ICT Products",
  "Other",
];

const PROPERTY_TYPES = [
  "Residential Home",
  "Apartment / Flat",
  "Office",
  "Warehouse / Factory",
  "School / University",
  "Hospital / Clinic",
  "Hotel / Resort",
  "Shopping Mall / Retail",
  "Estate / HOA",
  "Government Building",
  "Other",
];

const BUDGET_RANGES = [
  "Under KES 25,000",
  "KES 25,000 – 50,000",
  "KES 50,000 – 100,000",
  "KES 100,000 – 250,000",
  "KES 250,000 – 500,000",
  "Over KES 500,000",
  "Not sure yet",
];

export default function QuotePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      service: String(form.get("service") || ""),
      location: String(form.get("location") || ""),
      message: [
        form.get("property") ? `Property: ${form.get("property")}` : "",
        form.get("budget") ? `Budget: ${form.get("budget")}` : "",
        form.get("details") ? `Details: ${form.get("details")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      source: "quote-page",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again or WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 grid place-items-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Quote Request Received!</h1>
        <p className="text-zinc-600 mt-3 text-lg">
          Our team will review your requirements and get back to you within <span className="font-bold text-[#002070]">2 hours</span>.
        </p>
        <div className="mt-6 bg-[#F5F7FA] rounded-xl p-6 border border-[#0038A0]/10">
          <p className="text-sm text-zinc-600">Need an instant quote?</p>
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi Syntech! I just submitted a quote request and need an instant response.")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="mt-3 bg-[#25D366] hover:bg-[#20BD55] gap-2">
              <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white"><path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z"/></svg>
              Chat on WhatsApp
            </Button>
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link href="/shop"><Button variant="outline">Browse Products</Button></Link>
          <Link href="/"><Button>Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-[#002070] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0038A0] to-[#002070]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F00000]" />
        <div className="container mx-auto px-4 py-10 md:py-14 relative">
          <Badge className="bg-[#F00000] text-white font-bold mb-3 border-0">FREE • NO OBLIGATION</Badge>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Get a Free Quote</h1>
          <p className="text-zinc-300 mt-2 max-w-xl text-sm md:text-base">
            Tell us about your project and we&apos;ll design a tailored solution within 30 minutes. Free site survey in Nairobi.
          </p>
          <div className="flex flex-wrap gap-4 mt-5 text-sm">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#F00000]" /> Reply in 2hrs</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#F00000]" /> 5-Year Warranty</span>
            <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-[#F00000]" /> NCA Licensed</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Quote Form */}
          <Card className="border-2 border-[#0038A0]/15 shadow-md">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-[#0038A0]" /> Request a Quote
              </CardTitle>
              <p className="text-sm text-zinc-500">Fill in your details and we&apos;ll get back to you with a tailored proposal.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Full Name *</label>
                    <Input name="name" placeholder="John Kamau" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone Number *</label>
                    <Input name="phone" placeholder="0712 345 678" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email Address</label>
                  <Input name="email" type="email" placeholder="john@company.co.ke" />
                </div>

                {/* Service & Location */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Service Required *</label>
                    <select name="service" required className="w-full border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none bg-white transition">
                      <option value="">Select a service</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Property Location *</label>
                    <Input name="location" placeholder="e.g., Westlands, Nairobi" required />
                  </div>
                </div>

                {/* Property & Budget */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Property Type</label>
                    <select name="property" className="w-full border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none bg-white transition">
                      <option value="">Select property type</option>
                      {PROPERTY_TYPES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Estimated Budget</label>
                    <select name="budget" className="w-full border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none bg-white transition">
                      <option value="">Select budget range</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Project Details</label>
                  <textarea
                    name="details"
                    rows={4}
                    placeholder="Tell us more — number of cameras, area size, specific requirements, timeline..."
                    className="w-full border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}

                <Button type="submit" className="w-full h-11 text-base gap-2" disabled={loading}>
                  {loading ? "Submitting..." : <>Submit Quote Request <ArrowRight className="h-4 w-4" /></>}
                </Button>
                <p className="text-xs text-zinc-400 text-center">
                  By submitting you agree to our Privacy Policy. We never share your data.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* WhatsApp Quick Quote */}
            <Card className="border-2 border-[#25D366]/30 bg-[#25D366]/5 overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-[#25D366] grid place-items-center shrink-0">
                    <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white"><path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Need it faster?</p>
                    <p className="text-xs text-zinc-500">Get an instant quote via WhatsApp</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi Syntech! I need a quote for:\n\nService: \nLocation: \nProperty type: \n\nPlease send me a quote.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#20BD55] gap-2">WhatsApp Quote <ArrowRight className="h-4 w-4" /></Button>
                </a>
              </CardContent>
            </Card>

            {/* Call Us */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#0038A0] text-white grid place-items-center shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Prefer to call?</p>
                    <p className="text-xs text-zinc-500">Mon–Sat, 8am–6pm</p>
                  </div>
                </div>
                <a href={`tel:${SITE.phone}`}>
                  <Button variant="outline" className="w-full mt-3 gap-2"><Phone className="h-4 w-4" /> {SITE.phoneDisplay}</Button>
                </a>
              </CardContent>
            </Card>

            {/* Trust */}
            <Card className="border-[#0038A0]/15">
              <CardContent className="p-5 space-y-3">
                <p className="text-sm font-bold">Why 500+ clients trust Syntech</p>
                {[
                  "Free site survey within Nairobi",
                  "Custom quote in 30 minutes",
                  "5-year workmanship warranty",
                  "NCA, EPRA, CAK, PSRA licensed",
                  "Same-week installation available",
                  "24/7 emergency support",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-[#0038A0] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
