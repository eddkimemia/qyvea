"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatKES } from "@/lib/utils";
import { Heart, ShoppingCart, Package, FileText, Settings, Save, AlertCircle, Copy, Check } from "lucide-react";
import { useSession } from "next-auth/react";

export function DashboardClient({ user, orders, leads, partnerLeads }: { user: any; orders: any[]; leads: any[]; partnerLeads: any[] }) {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "quotes" | "wishlist" | "settings">("overview");
  const wishlist = useStore((s) => s.wishlist);
  const cart = useStore((s) => s.cart);
  const { update } = useSession();
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [image, setImage] = useState(user.image || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, image }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setMessage({ type: "success", text: "Profile updated!" });
      if (update) await update({ name, image } as any);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwMessage(null);
    try {
      const res = await fetch("/api/user/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setPwMessage({ type: "success", text: "Password changed!" });
      setCurrentPw(""); setNewPw("");
    } catch (err: any) {
      setPwMessage({ type: "error", text: err.message });
    } finally {
      setPwLoading(false);
    }
  };

  const copyRef = () => {
    if (!user.refCode) return;
    navigator.clipboard.writeText(`https://syntech.co.ke/?ref=${user.refCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-fit overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: Package },
          { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingCart },
          { id: "quotes", label: `Quotes (${leads.length})`, icon: FileText },
          { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: Heart },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((tab: any) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition ${activeTab === tab.id ? "bg-white dark:bg-zinc-800 shadow text-[#0038A0]" : "text-zinc-600 hover:text-zinc-900"}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div><CardTitle className="text-base">Recent Orders</CardTitle><CardDescription>Latest purchases</CardDescription></div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("orders")}>View all</Button>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-xl">
                  <ShoppingCart className="h-10 w-10 mx-auto text-zinc-300" />
                  <p className="text-sm font-medium mt-2">No orders yet</p>
                  <Link href="/shop" className="inline-block mt-3"><Button size="sm">Browse Shop</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((o: any) => (
                    <div key={o.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-zinc-50 transition">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-xs font-bold">{o.id.slice(0, 8)} • {new Date(o.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-zinc-500 truncate">{o.items?.length || 0} items • {o.phone || "—"}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          <Badge variant="secondary" className={`text-[10px] ${o.status === "PENDING" ? "bg-amber-100 text-amber-800" : o.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-zinc-100"}`}>{o.status}</Badge>
                          {o.includeInstallation && <Badge className="bg-[#002070] text-white text-[10px]">+Install</Badge>}
                        </div>
                      </div>
                      <div className="text-right ml-3"><p className="font-black text-sm">{formatKES(o.total)}</p><p className="text-xs text-zinc-500">via {o.mpesaRef ? "M-Pesa" : "COD"}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div><CardTitle className="text-base">Recent Quotes</CardTitle><CardDescription>Service inquiries</CardDescription></div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("quotes")}>View all</Button>
            </CardHeader>
            <CardContent>
              {leads.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed rounded-xl">
                  <FileText className="h-8 w-8 mx-auto text-zinc-300" />
                  <p className="text-sm font-medium mt-2">No quotes yet</p>
                  <Link href="/quote" className="inline-block mt-3"><Button size="sm" variant="outline">Get Quote</Button></Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {leads.slice(0, 3).map((l: any) => (
                    <div key={l.id} className="p-3 border rounded-xl text-sm">
                      <div className="flex justify-between items-start gap-2"><p className="font-semibold">{l.service || "General"} • {l.location || "—"}</p><Badge className="text-[10px] bg-zinc-100 text-zinc-700">{l.status}</Badge></div>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{l.message || "—"}</p>
                      <p className="text-xs text-zinc-400 mt-1">{new Date(l.createdAt).toLocaleDateString()} • {l.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {user.role === "PARTNER" && (
            <Card className="border-2 border-[#0038A0]/20 bg-[#F5F7FA]/50">
              <CardHeader><CardTitle className="text-base">Partner Performance</CardTitle><CardDescription>Leads via your code</CardDescription></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border rounded-xl p-3 bg-white"><p className="text-xl font-black">{partnerLeads.length}</p><p className="text-xs text-zinc-500">Total</p></div>
                  <div className="border rounded-xl p-3 bg-white"><p className="text-xl font-black text-green-600">{partnerLeads.filter((l: any) => l.status === "CONVERTED").length}</p><p className="text-xs text-zinc-500">Converted</p></div>
                  <div className="border rounded-xl p-3 bg-white"><p className="text-xl font-black text-amber-600">{partnerLeads.filter((l: any) => l.status === "NEW").length}</p><p className="text-xs text-zinc-500">New</p></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <Card>
          <CardHeader><CardTitle>All Orders</CardTitle><CardDescription>{orders.length} orders • Sorted by newest</CardDescription></CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <Package className="h-12 w-12 mx-auto text-zinc-300" />
                <p className="font-semibold mt-3">No orders</p>
                <Link href="/shop"><Button className="mt-4">Start Shopping</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o: any) => (
                  <div key={o.id} className="border-2 border-zinc-100 rounded-xl p-4 hover:border-[#0038A0]/20 transition">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div><p className="font-mono text-xs font-bold">{o.id} • {new Date(o.createdAt).toLocaleString()}</p><p className="font-bold mt-1">{formatKES(o.total)} <Badge variant="secondary" className="ml-2 text-[11px]">{o.status}</Badge></p><p className="text-xs text-zinc-500 mt-1">{o.phone || "no phone"} • {o.email || "no email"}</p></div>
                      <div className="text-xs text-zinc-500 text-right"><p>Delivery: {formatKES(o.deliveryFee)} • Install: {formatKES(o.installationFee)}</p><p>{o.mpesaRef ? `M-Pesa: ${o.mpesaRef}` : "Pay on Delivery"}</p></div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {o.items?.map((it: any) => (<span key={it.id} className="text-xs border px-2.5 py-1.5 rounded-full bg-zinc-50">{it.product?.name?.slice(0, 30) || it.productId.slice(0, 8)} × {it.qty}</span>))}
                    </div>
                    {o.notes && <p className="text-xs mt-3 p-3 bg-[#F5F7FA] rounded-lg border">{o.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "quotes" && (
        <Card>
          <CardHeader><CardTitle>Quotes & Leads</CardTitle><CardDescription>{leads.length} inquiries</CardDescription></CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl"><FileText className="h-12 w-12 mx-auto text-zinc-300" /><p className="font-semibold mt-3">No quotes</p><Link href="/quote"><Button className="mt-4">Request Quote</Button></Link></div>
            ) : (
              <div className="space-y-3">
                {leads.map((l: any) => (
                  <div key={l.id} className="border rounded-xl p-4">
                    <div className="flex justify-between gap-2"><div><p className="font-bold">{l.service || "General"} <Badge variant="outline" className="ml-2 text-[11px]">{l.service || "—"}</Badge></p><p className="text-sm text-zinc-600 mt-1">{l.location || "No location"} • {l.phone}</p></div><Badge className={`${l.status === "NEW" ? "bg-[#0038A0] text-white" : l.status === "CONVERTED" ? "bg-green-600 text-white" : "bg-zinc-100 text-zinc-700"} h-fit`}>{l.status}</Badge></div>
                    <p className="text-sm text-zinc-600 mt-2 p-3 bg-zinc-50 rounded-lg border">{l.message || "No message"}</p>
                    <p className="text-xs text-zinc-400 mt-2">{new Date(l.createdAt).toLocaleString()} • Source: {l.source || "direct"}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "wishlist" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-[#0038A0]" /> Wishlist</CardTitle><CardDescription>{wishlist.length} saved</CardDescription></CardHeader>
          <CardContent>
            {wishlist.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-xl"><Heart className="h-10 w-10 mx-auto text-zinc-300" /><p className="text-sm font-medium mt-2">Your wishlist is empty</p><Link href="/shop"><Button size="sm" className="mt-3">Browse Shop</Button></Link></div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">{wishlist.map((slug: string) => (<Link key={slug} href={`/shop/${slug}`} className="border px-3 py-2 rounded-full text-sm hover:bg-[#F5F7FA] transition">{slug}</Link>))}</div>
                <div className="mt-4 p-3 bg-zinc-50 rounded-xl border flex gap-2 text-xs text-zinc-600"><ShoppingCart className="h-4 w-4 text-[#0038A0] shrink-0 mt-0.5" /><div><p className="font-bold">Cart</p><p>{cart.length} items • {formatKES(cart.reduce((s: number, c: any) => s + c.price * c.qty, 0))} total • <Link href="/cart" className="underline text-[#0038A0]">View cart →</Link></p></div></div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card className="border-2 border-[#0038A0]/10">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader><CardTitle>Profile Settings</CardTitle><CardDescription>Update your name, phone, avatar. Email cannot be changed.</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Full Name</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Kamau" className="mt-1" /></div>
                  <div><label className="text-sm font-medium">Email (cannot change)</label><Input value={user.email} disabled className="mt-1 bg-zinc-50" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Phone</label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712..." className="mt-1" /></div>
                  <div><label className="text-sm font-medium">Role</label><Input value={user.role} disabled className="mt-1 bg-zinc-50" /></div>
                </div>
                <div><label className="text-sm font-medium">Avatar URL</label><Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://... or /uploads/..." className="mt-1" /><p className="text-xs text-zinc-500 mt-1">Paste image URL or leave empty for placeholder.</p></div>
                {message && <div className={`text-xs px-3 py-2 rounded-lg border flex items-center gap-2 ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}><AlertCircle className="h-4 w-4" />{message.text}</div>}
                <Button type="submit" disabled={saving} className="gap-1"><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>Min 8 chars, uppercase, lowercase, number, special char.</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div><label className="text-sm font-medium">Current Password</label><Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" className="mt-1" required /></div>
                <div><label className="text-sm font-medium">New Password</label><Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password" className="mt-1" required /></div>
                {pwMessage && <div className={`text-xs px-3 py-2 rounded-lg border ${pwMessage.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>{pwMessage.text}</div>}
                <Button type="submit" disabled={pwLoading} variant="outline" className="gap-1">{pwLoading ? "Updating..." : "Update Password"}</Button>
              </form>
            </CardContent>
          </Card>

          {user.role === "PARTNER" && user.refCode && (
            <Card className="border-2 border-[#0038A0]/20 bg-[#F5F7FA]">
              <CardHeader><CardTitle className="text-base">Partner Tools</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2"><Input value={`https://syntech.co.ke/?ref=${user.refCode}`} readOnly className="font-mono text-sm bg-white" /><Button size="sm" variant="outline" onClick={copyRef} className="gap-1 shrink-0">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}</Button></div>
                <p className="text-xs text-zinc-500">Share this link. Leads with ?ref={user.refCode} are tracked as yours.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
