// Auth placeholder — wire up next-auth when ready.
// This keeps types strict and isolates auth logic.
// Usage: import { auth } from "@/lib/auth" after you create auth.config.ts

// Example config (uncomment & adjust when enabling next-auth):
//
// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/lib/db";
// import bcrypt from "bcryptjs";
//
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   providers: [
//     Credentials({
//       credentials: { email: {}, password: {} },
//       authorize: async (creds) => {
//         const user = await prisma.user.findUnique({ where: { email: creds.email as string } });
//         if (!user?.password) return null;
//         const ok = await bcrypt.compare(creds.password as string, user.password);
//         return ok ? user : null;
//       },
//     }),
//   ],
//   callbacks: {
//     jwt: async ({ token, user }) => { if (user) token.role = (user as any).role; return token; },
//     session: async ({ session, token }) => { (session.user as any).role = token.role; return session; },
//   },
// });

export const authPlaceholder = "Configure src/lib/auth.ts with NextAuth when ready. See README.";
