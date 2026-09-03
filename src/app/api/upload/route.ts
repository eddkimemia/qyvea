import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const runtime = "nodejs";

// Allow 10MB uploads
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized — admin only" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const single = formData.get("file") as File | null;

    // normalize: support both single and multiple under same key, or "files"
    const allFiles: File[] = [];
    if (files.length) allFiles.push(...files.filter(Boolean));
    else if (single) allFiles.push(single);

    // also check "files" key
    const alt = formData.getAll("files") as File[];
    if (alt.length) allFiles.push(...alt.filter(Boolean));

    // deduplicate by name+size
    const uniq = Array.from(new Map(allFiles.map((f) => [`${(f as any).name}-${(f as any).size}`, f])).values()).filter((f) => f && typeof (f as any).arrayBuffer === "function");

    if (uniq.length === 0) {
      return NextResponse.json({ error: "No file uploaded. Use field 'file' or 'files'" }, { status: 400 });
    }

    const urls: string[] = [];
    const uploadDir = join(process.cwd(), "public", "uploads");

    // ensure dir exists (best effort — may fail on Vercel read-only, fallback to data URL)
    let canWriteFs = true;
    try {
      if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
    } catch {
      canWriteFs = false;
    }

    for (const file of uniq) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        // allow images and webp etc, but reject obvious non-media for now if >5MB? keep permissive for images only
        if (!file.type.startsWith("image/")) {
          return NextResponse.json({ error: `Invalid file type ${file.type} for ${file.name} — images only` }, { status: 400 });
        }
      }
      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json({ error: `${file.name} exceeds 8MB limit` }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // sanitize filename
      const original = (file.name || "upload").replace(/[^a-zA-Z0-9._-]/g, "_");
      const ext = original.includes(".") ? "." + original.split(".").pop() : "";
      const base = original.replace(/\.[^.]+$/, "").slice(0, 40) || "image";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext || (file.type === "image/jpeg" ? ".jpg" : file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : "")}`;
      const filepath = join(uploadDir, filename);

      if (canWriteFs) {
        try {
          await writeFile(filepath, buffer);
          urls.push(`/uploads/${filename}`);
          continue;
        } catch (e) {
          // fallthrough to data URL fallback
          canWriteFs = false;
        }
      }

      // Fallback: data URL (works everywhere, no fs persistence needed)
      const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      urls.push(dataUrl);
    }

    if (urls.length === 1) {
      return NextResponse.json({ url: urls[0], urls });
    }
    return NextResponse.json({ urls, url: urls[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "POST multipart/form-data with field 'file' (single) or multiple 'file'/'files'. Max 8MB, images only. Returns {url, urls}" });
}
