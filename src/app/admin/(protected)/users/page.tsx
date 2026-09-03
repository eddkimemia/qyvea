import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { UsersManager } from "@/components/admin/users-manager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const sp = await searchParams;
  const session = await auth();
  const currentUserId = (session?.user as any)?.id;

  let users: any[] = [];
  try {
    const where: any = {};
    if (sp.q) {
      where.OR = [
        { name: { contains: sp.q, mode: "insensitive" } },
        { email: { contains: sp.q, mode: "insensitive" } },
      ];
    }
    if (sp.role) where.role = sp.role;
    users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, name: true, email: true, phone: true, role: true, image: true, refCode: true, createdAt: true },
    });
  } catch {
    users = [];
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black">Users & Partners</h1>
        <p className="text-sm text-zinc-500">Manage all accounts — USERS, CLIENTS, PARTNERS (refCode), ADMINS. Create, edit role, avatar, reset password.</p>
      </div>
      <UsersManager initialUsers={JSON.parse(JSON.stringify(users))} currentUserId={currentUserId} />
    </div>
  );
}
