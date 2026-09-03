import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewPostPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/blog"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-black">New Blog Post</h1>
      </div>
      <BlogForm />
    </div>
  );
}
