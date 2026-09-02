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
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: email.toLowerCase() === "admin@syntech.co.ke" ? "/admin" : "/",
      });
      setLoginLoading(false);
      if (res?.error) {
        setLoginError("Invalid email or password");
        return;
      }
      // Login successful — full page reload to pick up session
      window.location.href = res?.url || (email.toLowerCase() === "admin@syntech.co.ke" ? "/admin" : "/");
    } catch (err: any) {
      setLoginLoading(false);
      console.error("Login error:", err);
      setLoginError(err?.message?.includes("NEXTAUTH") ? "Auth configuration error — check AUTH_SECRET" : "Login failed. Please try again.");
    }
  }

  function validatePassword(pw: string): string[] {
    const errors: string[] = [];
    if (pw.length < 8) errors.push("At least 8 characters");
    if (pw.length > 128) errors.push("Under 128 characters");
    if (!/[A-Z]/.test(pw)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(pw)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(pw)) errors.push("One number");
    if (!/[^A-Za-z0-9]/.test(pw)) errors.push("One special character");
    return errors;
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setPasswordErrors(validatePassword(value));
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSignupError(null);
    setSignupOk(null);
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setSignupError("Password requirements: " + errors.join(", "));
      return;
    }
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
    if (json.mock) {
      setSignupOk("Account created (demo mode). Please sign in.");
      return;
    }
    setSignupOk("Account created! Signing you in...");
    // auto sign in
    const loginRes = await signIn("credentials", { email: payload.email, password: payload.password, redirect: false });
    if (loginRes?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setSignupOk("Account created! You can now sign in.");
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black">Welcome to Syntech</h1>
        <p className="text-sm text-zinc-500">Sign in to manage cart, wishlist, orders & admin</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-[#0038A0]/20">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader><CardTitle>Sign In</CardTitle><CardDescription>Save cart, track orders & more.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-3">
              <Input name="email" placeholder="Email" type="email" required defaultValue="admin@syntech.co.ke" />
              <Input name="password" placeholder="Password" type="password" required defaultValue="Admin123!" />
              {loginError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={loginLoading}>{loginLoading ? "Signing in..." : "Sign In"}</Button>
              <div className="text-xs text-zinc-500 bg-[#F5F7FA] border border-[#0038A0]/20 rounded-lg p-3 space-y-1">
                <p className="font-bold">Demo access:</p>
                <p><span className="font-mono">admin@syntech.co.ke</span> / <span className="font-mono">Admin123!</span> → Admin dashboard</p>
                <p><span className="font-mono">partner@syntech.co.ke</span> / <span className="font-mono">Partner123!</span> → Partner</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Create Account</CardTitle><CardDescription>Join Syntech for quotes & installs.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-3">
              <Input name="name" placeholder="Full Name" required />
              <Input name="email" placeholder="Email" type="email" required />
              <Input name="phone" placeholder="Phone (e.g., 0712...)" required />
              <div>
                <Input name="password" placeholder="Password" type="password" required minLength={8} value={password} onChange={(e) => handlePasswordChange(e.target.value)} />
                {password.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {[
                      { label: "8+ chars", ok: password.length >= 8 },
                      { label: "A-Z", ok: /[A-Z]/.test(password) },
                      { label: "a-z", ok: /[a-z]/.test(password) },
                      { label: "0-9", ok: /[0-9]/.test(password) },
                      { label: "!@#", ok: /[^A-Za-z0-9]/.test(password) },
                    ].map((r) => (
                      <span key={r.label} className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${r.ok ? "bg-green-50 border-green-300 text-green-700" : "bg-zinc-50 border-zinc-200 text-zinc-400"}`}>{r.label}</span>
                    ))}
                  </div>
                )}
              </div>
              {signupError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{signupError}</p>}
              {signupOk && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">{signupOk}</p>}
              <Button type="submit" variant="outline" className="w-full" disabled={signupLoading}>{signupLoading ? "Creating..." : "Create Account"}</Button>
            </form>
            <p className="text-xs text-center mt-3"><Link href="/admin" className="underline text-[#0038A0]">Go to Admin Dashboard →</Link> (requires admin login)</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-center text-xs text-zinc-400 mt-6">By signing in you agree to our Terms & Privacy. Secure authentication.</p>
    </div>
  );
}
