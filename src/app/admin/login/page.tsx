"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (role === "ADMIN") {
      router.replace("/admin");
    }
  }, [role, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });
      setLoading(false);
      if (res?.error) {
        setError("Invalid admin email or password");
        return;
      }
      window.location.href = res?.url || "/admin";
    } catch (err: any) {
      setLoading(false);
      console.error("Admin login error:", err);
      setError(err?.message?.includes("NEXTAUTH") ? "Auth configuration error — check AUTH_SECRET" : "Login failed. Please try again.");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/syntechlogo.jpg" alt="Syntech Admin" className="h-12 mx-auto object-contain rounded-md" />
          <h1 className="text-2xl font-black mt-3 tracking-tight">Admin Login</h1>
          <p className="text-sm text-zinc-500">Syntech Solutions • Secure admin access</p>
        </div>
        <Card className="border-2 border-[#0038A0]/20 shadow-lg">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0038A0] animate-pulse" /> Secure Access</CardTitle>
            <CardDescription>Enter your authorized admin email & password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Admin Email</label>
                <Input name="email" type="email" placeholder="admin@syntech.co.ke" required defaultValue="admin@syntech.co.ke" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" placeholder="••••••••" required defaultValue="Admin123!" className="mt-1" />
              </div>
              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
              <Button type="submit" className="w-full h-11" disabled={loading}>{loading ? "Signing in..." : "Sign In to Dashboard"}</Button>
              <div className="text-xs bg-[#F5F7FA] border border-[#0038A0]/20 rounded-xl p-3">
                <p className="font-bold">Demo access:</p>
                <p className="font-mono text-xs">admin@syntech.co.ke / Admin123!</p>
              </div>
            </form>
            <div className="mt-4 flex justify-between text-xs">
              <Link href="/login" className="underline text-[#0038A0]">User login →</Link>
              <Link href="/shop" className="underline">View store</Link>
            </div>
            {session?.user && (
              <div className="mt-4 border-t pt-3 text-xs space-y-2">
                <p>Signed in as <span className="font-mono">{(session.user as any).email}</span> ({role})</p>
                {(role !== "ADMIN") && <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">Not an admin — use admin@syntech.co.ke</p>}
                <Button variant="outline" size="sm" className="w-full" onClick={() => signOut({ callbackUrl: "/admin/login" })}>Sign Out</Button>
              </div>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-xs text-zinc-400 mt-4">© 2026 Syntech Limited • Westlands, Nairobi • 24/7</p>
      </div>
    </div>
  );
}
