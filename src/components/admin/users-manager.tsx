"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/image-uploader";

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  image: string | null;
  refCode: string | null;
  createdAt: string;
}

export function UsersManager({ initialUsers, currentUserId }: { initialUsers: User[]; currentUserId?: string }) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  // Create form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("USER");
  const [editPassword, setEditPassword] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);

  const filtered = users.filter((u) => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (q) {
      const qq = q.toLowerCase();
      return (u.name?.toLowerCase().includes(qq) || u.email.toLowerCase().includes(qq) || u.phone?.includes(qq));
    }
    return true;
  });

  const refresh = async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (roleFilter) params.set("role", roleFilter);
    const res = await fetch(`/api/users?${params.toString()}`);
    const json = await res.json();
    if (json.users) setUsers(json.users);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, role, password, image: images[0] || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setUsers([{ id: json.user.id, name, email, phone, role, image: images[0] || null, refCode: role === "PARTNER" ? "SYN-xxxx" : null, createdAt: new Date().toISOString() }, ...users]);
      setShowCreate(false);
      setName(""); setEmail(""); setPhone(""); setRole("USER"); setPassword(""); setImages([]);
      router.refresh();
      await refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setEditName(u.name || "");
    setEditEmail(u.email);
    setEditPhone(u.phone || "");
    setEditRole(u.role);
    setEditPassword("");
    setEditImages(u.image ? [u.image] : []);
    setError(null);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);
    try {
      const payload: any = { name: editName, email: editEmail, phone: editPhone, role: editRole, image: editImages[0] || null };
      if (editPassword) payload.password = editPassword;
      const res = await fetch(`/api/users?id=${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setUsers(users.map((u) => (u.id === editing.id ? { ...u, name: editName, email: editEmail, phone: editPhone, role: editRole, image: editImages[0] || null } : u)));
      setEditing(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete user? This cannot be undone.")) return;
    const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) { alert(json.error); return; }
    setUsers(users.filter((u) => u.id !== id));
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name/email/phone" className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]" />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">All roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="PARTNER">PARTNER</option>
          <option value="CLIENT">CLIENT</option>
          <option value="USER">USER</option>
        </select>
        <Button variant="outline" size="sm" onClick={refresh}>Search</Button>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>{showCreate ? "Cancel" : "+ New User"}</Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

      {showCreate && (
        <Card className="border-2 border-[#0038A0]/20">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader><CardTitle>Create User / Partner / Admin</CardTitle><p className="text-sm text-zinc-500">Password min 6 chars. Partner gets refCode auto.</p></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-3">
              <ImageUploader value={images} onChange={setImages} max={1} label="Avatar (optional)" />
              <div className="grid md:grid-cols-2 gap-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email *" required className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <select value={role} onChange={(e) => setRole(e.target.value)} className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                  <option value="USER">USER</option>
                  <option value="CLIENT">CLIENT</option>
                  <option value="PARTNER">PARTNER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password * (min 6)" required className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : `Create ${role}`}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {editing && (
        <Card className="border-2 border-amber-200 bg-amber-50/30">
          <CardHeader><CardTitle>Edit {editing.email}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleEdit} className="space-y-3">
              <ImageUploader value={editImages} onChange={setEditImages} max={1} label="Avatar" />
              <div className="grid md:grid-cols-2 gap-3">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} type="email" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone" className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                  <option value="USER">USER</option>
                  <option value="CLIENT">CLIENT</option>
                  <option value="PARTNER">PARTNER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <input value={editPassword} onChange={(e) => setEditPassword(e.target.value)} type="password" placeholder="New password (leave blank to keep)" className="w-full border-2 border-zinc-200 rounded-lg px-3 py-2.5 text-sm outline-none" />
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">{loading ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b text-xs uppercase tracking-widest text-zinc-500">
              <tr><th className="text-left p-3">User</th><th className="text-left p-3">Role</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Ref</th><th className="text-right p-3">Created</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No users match filter.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-zinc-50/50">
                  <td className="p-3">
                    <div className="flex gap-3 items-center">
                      <img src={u.image || `https://placehold.co/40x40/0038A0/FFFFFF?text=${u.email[0].toUpperCase()}`} alt={u.email} className="h-9 w-9 rounded-full object-cover border" />
                      <div className="min-w-0">
                        <p className="font-semibold line-clamp-1 max-w-[180px]">{u.name || u.email.split("@")[0]} {u.id === currentUserId && <span className="text-xs text-[#0038A0]">(you)</span>}</p>
                        <p className="text-xs text-zinc-500 font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><Badge className={`${u.role === "ADMIN" ? "bg-[#002070] text-white" : u.role === "PARTNER" ? "bg-[#0038A0] text-white" : "bg-zinc-100 text-zinc-700"} text-xs`}>{u.role}</Badge></td>
                  <td className="p-3 text-xs">{u.phone || "—"}</td>
                  <td className="p-3 text-xs font-mono">{u.refCode || "—"}</td>
                  <td className="p-3 text-right text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => startEdit(u)}>Edit</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600" disabled={u.id === currentUserId} onClick={() => handleDelete(u.id)}>Del</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t bg-zinc-50 text-xs text-zinc-500 flex justify-between">
          <span>{filtered.length} of {users.length} shown</span>
          <span>Admin can create/edit roles, reset password, delete (except self).</span>
        </div>
      </Card>
    </div>
  );
}
