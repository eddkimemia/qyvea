import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle>Sign In</CardTitle><CardDescription>Save cart, track orders & more.</CardDescription></CardHeader>
          <CardContent>
            <form className="space-y-3">
              <Input placeholder="Email" type="email" required />
              <Input placeholder="Password" type="password" required />
              <Button className="w-full">Sign In</Button>
              <p className="text-xs text-zinc-500 text-center">Demo admin: admin@qyvea.co.ke / Admin123!</p>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Create Account</CardTitle><CardDescription>Join Qyvea for quotes & installs.</CardDescription></CardHeader>
          <CardContent>
            <form className="space-y-3">
              <Input placeholder="Full Name" required />
              <Input placeholder="Email" type="email" required />
              <Input placeholder="Phone (e.g., 0712...)" required />
              <Input placeholder="Password" type="password" required />
              <Button variant="outline" className="w-full">Create Account</Button>
            </form>
            <p className="text-xs text-center mt-3"><Link href="/admin" className="underline">Go to Admin Dashboard →</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
