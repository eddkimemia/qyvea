import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";

const fallbackSecret = "1lKFDOJ+j726WM7q61RamLtp2CPiAgEWeiK5RaPWvNQ="; // same as local .env, used only if Vercel env missing — rotate via dashboard
if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  console.warn("[Auth] AUTH_SECRET/NEXTAUTH_SECRET not set — using fallback. Set AUTH_SECRET in Vercel dashboard for production.");
}
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || fallbackSecret,
  logger: {
    error(error) { console.error("[NextAuth ERROR]", error); },
    warn(code) { console.warn("[NextAuth WARN]", code); },
    debug(code, metadata) { console.debug("[NextAuth DEBUG]", code, metadata); },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = (credentials?.email as string)?.toLowerCase().trim();
        const password = credentials?.password as string;
        if (!email || !password) return null;

        // Rate limit login attempts — 10 per 15 min per email
        const rl = rateLimit(`login:${email}`, 10, 15 * 60 * 1000);
        if (!rl.allowed) return null;

        // Allow mock admin even if DB not available (fallback for demo)
        const isMockAdmin = email === "admin@syntech.co.ke" && password === "Admin123!";
        const isMockPartner = email === "partner@syntech.co.ke" && password === "Partner123!";

        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) {
            // fallback mock if DB missing but credentials match mock
            if (isMockAdmin) return { id: "mock-admin", name: "Syntech Admin", email: "admin@syntech.co.ke", image: null, role: "ADMIN" } as any;
            if (isMockPartner) return { id: "mock-partner", name: "Demo Partner", email: "partner@syntech.co.ke", image: null, role: "PARTNER" } as any;
            return null;
          }
          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          } as any;
        } catch {
          // DB unavailable — allow mock logins only
          if (isMockAdmin) return { id: "mock-admin", name: "Syntech Admin", email: "admin@syntech.co.ke", image: null, role: "ADMIN" } as any;
          if (isMockPartner) return { id: "mock-partner", name: "Demo Partner", email: "partner@syntech.co.ke", image: null, role: "PARTNER" } as any;
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        (token as any).role = (user as any).role;
        (token as any).id = (user as any).id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        (session.user as any).role = (token as any).role;
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
