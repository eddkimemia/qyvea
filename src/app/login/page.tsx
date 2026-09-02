"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupOk, setSignupOk] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoginLoading(false);
    if (res?.error) {
      setLoginError("Invalid email or password");
      return;
    }
    if (res?.ok) {
      // Redirect based on email — admin to /admin
      if (email.toLowerCase() === "admin@qyvea.co.ke") router.push("/admin");
      else router.push("/");
      router.refresh();
    }
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSignupError(null);
    setSignupOk(null);
    setSignupLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      password: String(form.get("password") || ""),
    };
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSignupLoading(false);
    if (!res.ok) {
      setSignupError(json.error || "Signup failed");
      return;
    }
    setSignupOk("Account created! You can now sign in.");
    // auto sign in
    const loginRes = await signIn("credentials", { email: payload.email, password: payload.password, redirect: false });
    if (loginRes?.ok) {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black">Welcome to Qyvea</h1>
        <p className="text-sm text-zinc-500">Sign in to manage cart, wishlist, orders & admin</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-[#7FAF25]/20">
          <div className="h-1 bg-[#7FAF25]" />
          <CardHeader><CardTitle>Sign In</CardTitle><CardDescription>Save cart, track orders & more.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-3">
              <Input name="email" placeholder="Email" type="email" required defaultValue="admin@qyvea.co.ke" />
              <Input name="password" placeholder="Password" type="password" required defaultValue="Admin123!" />
              {loginError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={loginLoading}>{loginLoading ? "Signing in..." : "Sign In"}</Button>
              <div className="text-xs text-zinc-500 bg-[#F2F9E6] border border-[#7FAF25]/20 rounded-lg p-3 space-y-1">
                <p className="font-bold">Demo logins (seeded):</p>
                <p><span className="font-mono">admin@qyvea.co.ke</span> / <span className="font-mono">Admin123!</span> → Admin dashboard</p>
                <p><span className="font-mono">partner@qyvea.co.ke</span> / <span className="font-mono">Partner123!</span> → Partner</p>
                <p className="text-[11px]">Works even if DB not migrated (mock fallback).</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Create Account</CardTitle><CardDescription>Join Qyvea for quotes & installs.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-3">
              <Input name="name" placeholder="Full Name" required />
              <Input name="email" placeholder="Email" type="email" required />
              <Input name="phone" placeholder="Phone (e.g., 0712...)" required />
              <Input name="password" placeholder="Password (min 6 chars)" type="password" required minLength={6} />
              {signupError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{signupError}</p>}
              {signupOk && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">{signupOk}</p>}
              <Button type="submit" variant="outline" className="w-full" disabled={signupLoading}>{signupLoading ? "Creating..." : "Create Account"}</Button>
            </form>
            <p className="text-xs text-center mt-3"><Link href="/admin" className="underline text-[#5A7F1B]">Go to Admin Dashboard →</Link> (requires admin login)</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-center text-xs text-zinc-400 mt-6">By signing in you agree to our Terms & Privacy. Sessions via JWT • PostgreSQL.</p>
    </div>
  );
}
