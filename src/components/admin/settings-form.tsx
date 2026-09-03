"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/image-uploader";

export function SettingsForm({ initial }: { initial: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [siteName, setSiteName] = useState(initial.siteName || "Syntech Solutions");
  const [siteTagline, setSiteTagline] = useState(initial.siteTagline || "One Company, Every Solution");
  const [siteDescription, setSiteDescription] = useState(initial.siteDescription || "");
  const [siteUrl, setSiteUrl] = useState(initial.siteUrl || "https://syntech.co.ke");
  const [logoUrls, setLogoUrls] = useState<string[]>(initial.logoUrl ? [initial.logoUrl] : []);
  const [faviconUrls, setFaviconUrls] = useState<string[]>(initial.faviconUrl ? [initial.faviconUrl] : []);
  const [phone, setPhone] = useState(initial.phone || "+254 715 135 141");
  const [phoneDisplay, setPhoneDisplay] = useState(initial.phoneDisplay || "0715 135 141");
  const [whatsappNumber, setWhatsappNumber] = useState(initial.whatsappNumber || "254715135141");
  const [email, setEmail] = useState(initial.email || "info@syntech.co.ke");
  const [address, setAddress] = useState(initial.address || "Westlands, Nairobi");
  const [businessHours, setBusinessHours] = useState(initial.businessHours || "Mon–Fri: 8:00 AM – 6:00 PM\nSat: 9:00 AM – 1:00 PM\nSun & Holidays: Closed");
  const [facebookUrl, setFacebookUrl] = useState(initial.facebookUrl || "");
  const [instagramUrl, setInstagramUrl] = useState(initial.instagramUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initial.linkedinUrl || "");
  const [tiktokUrl, setTiktokUrl] = useState(initial.tiktokUrl || "");
  const [xUrl, setXUrl] = useState(initial.xUrl || "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial.youtubeUrl || "");
  const [promoText, setPromoText] = useState(initial.promoText || "");
  const [promoCode, setPromoCode] = useState(initial.promoCode || "");
  const [promoActive, setPromoActive] = useState(!!initial.promoActive);
  const [maintenanceMode, setMaintenanceMode] = useState(!!initial.maintenanceMode);
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState((initial.defaultDeliveryFee ?? 0).toString());
  const [taxRate, setTaxRate] = useState((initial.taxRate ?? 0).toString());
  const [currency, setCurrency] = useState(initial.currency || "KES");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const payload: any = {
      siteName,
      siteTagline,
      siteDescription,
      siteUrl,
      logoUrl: logoUrls[0] || null,
      faviconUrl: faviconUrls[0] || null,
      phone,
      phoneDisplay,
      whatsappNumber,
      email,
      address,
      businessHours,
      facebookUrl: facebookUrl || null,
      instagramUrl: instagramUrl || null,
      linkedinUrl: linkedinUrl || null,
      tiktokUrl: tiktokUrl || null,
      xUrl: xUrl || null,
      youtubeUrl: youtubeUrl || null,
      promoText: promoText || null,
      promoCode: promoCode || null,
      promoActive,
      maintenanceMode,
      defaultDeliveryFee: parseInt(defaultDeliveryFee) || 0,
      taxRate: parseFloat(taxRate) || 0,
      currency,
    };
    try {
      const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setSuccess("Settings saved!");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">{success}</div>}

      <Card className="border-2 border-[#0038A0]/20 overflow-hidden">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader><CardTitle>General — Site Identity</CardTitle><p className="text-sm text-zinc-500">Name, tagline, description and URL used for SEO and header.</p></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Site Name</label>
              <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Tagline</label>
              <input value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Site Description (SEO)</label>
            <textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} rows={3} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold">Site URL</label>
            <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://syntech.co.ke" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="accent-[#0038A0]" /> Maintenance mode (show banner)</label>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle>Branding — Logos</CardTitle><p className="text-sm text-zinc-500">Upload logos, favicons. Stored via /api/upload (8MB, fallback to data URL on Vercel).</p></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <ImageUploader value={logoUrls} onChange={setLogoUrls} max={1} label="Logo (syntechlogo.jpg)" />
            {logoUrls[0] && <p className="text-xs text-zinc-500 mt-2 break-all">URL: {logoUrls[0].slice(0, 80)}...</p>}
          </div>
          <div>
            <ImageUploader value={faviconUrls} onChange={setFaviconUrls} max={1} label="Favicon (fav.png)" />
            {faviconUrls[0] && <p className="text-xs text-zinc-500 mt-2 break-all">URL: {faviconUrls[0].slice(0, 80)}...</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-[#0038A0]/10">
        <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold">Phone (tel:)</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold">Phone Display</label>
            <input value={phoneDisplay} onChange={(e) => setPhoneDisplay(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold">WhatsApp Number (without +)</label>
            <input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Business Hours</label>
            <textarea value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} rows={3} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {[
            { label: "Facebook URL", v: facebookUrl, s: setFacebookUrl },
            { label: "Instagram URL", v: instagramUrl, s: setInstagramUrl },
            { label: "LinkedIn URL", v: linkedinUrl, s: setLinkedinUrl },
            { label: "TikTok URL", v: tiktokUrl, s: setTiktokUrl },
            { label: "X (Twitter) URL", v: xUrl, s: setXUrl },
            { label: "YouTube URL", v: youtubeUrl, s: setYoutubeUrl },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-sm font-semibold">{f.label}</label>
              <input value={f.v} onChange={(e) => f.s(e.target.value)} placeholder="https://..." className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-2 border-[#0038A0]/10">
        <CardHeader><CardTitle>Promo & Commerce</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Promo Text</label>
              <input value={promoText} onChange={(e) => setPromoText(e.target.value)} placeholder="Free Delivery..." className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Promo Code</label>
              <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="SYNTECH5" className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={promoActive} onChange={(e) => setPromoActive(e.target.checked)} className="accent-[#0038A0]" /> Promo Active</label>
            </div>
            <div>
              <label className="text-sm font-semibold">Default Delivery Fee (KES)</label>
              <input type="number" value={defaultDeliveryFee} onChange={(e) => setDefaultDeliveryFee(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Tax Rate %</label>
              <input type="number" step="0.1" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full mt-1 border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white">
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11">{loading ? "Saving..." : "Save All Settings"}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
