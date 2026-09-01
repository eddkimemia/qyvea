import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const nav = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Products", icon: "📦" },
    { href: "/admin/orders", label: "Orders", icon: "🧾" },
    { href: "/admin/leads", label: "Leads", icon: "👥" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-20 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-[#7FAF25]/10 shadow-sm overflow-hidden">
            <div className="bg-[#0A0A0A] text-white p-4">
              <p className="font-black text-sm tracking-tight flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#7FAF25] animate-pulse" /> Admin</p>
              <p className="text-xs text-zinc-400">Qyvea Limited • Secure</p>
            </div>
            <nav className="p-2 space-y-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href as any}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F2F9E6] hover:text-[#3F5D13] transition"
                >
                  <span className="text-base">{n.icon}</span> {n.label}
                </Link>
              ))}
            </nav>
            <div className="p-3 border-t space-y-2">
              <Link href="/shop" target="_blank"><Button variant="outline" size="sm" className="w-full">View Store ↗</Button></Link>
              <Link href="/api/products" target="_blank"><Button size="sm" className="w-full">API: /api/products</Button></Link>
            </div>
            <div className="px-3 pb-3">
              <p className="text-[11px] text-zinc-500">Signed in as <span className="font-mono">admin@qyvea.co.ke</span></p>
              <p className="text-[11px] text-zinc-400">Role: ADMIN • PostgreSQL</p>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
