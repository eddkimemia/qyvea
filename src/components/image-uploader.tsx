"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value: string[]; // array of image URLs (can be external URLs or /uploads/... or data URLs)
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
  required?: boolean;
}

export function ImageUploader({ value = [], onChange, max = 8, label = "Images", required }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files as FileList);
    if (!arr.length) return;
    if (value.length + arr.length > max) {
      setError(`Max ${max} images allowed. You have ${value.length}, trying to add ${arr.length}.`);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      arr.forEach((f) => form.append("file", f));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const urls: string[] = json.urls || (json.url ? [json.url] : []);
      if (urls.length) onChange([...value, ...urls]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [value, onChange, max]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
  };

  const addByUrl = () => {
    const url = urlInputRef.current?.value.trim();
    if (!url) return;
    if (value.length >= max) {
      setError(`Max ${max} images`);
      return;
    }
    // basic validation
    try { new URL(url); } catch { setError("Invalid URL"); return; }
    if (!url.match(/^https?:\/\/.+\..+|data:image\//)) {
      // allow any http(s) or data url for flexibility
    }
    onChange([...value, url]);
    if (urlInputRef.current) urlInputRef.current.value = "";
    setError(null);
  };

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const setPrimary = (idx: number) => {
    if (idx === 0) return;
    const next = [...value];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">{label} {required && <span className="text-red-600">*</span>} <span className="text-xs text-zinc-500 font-normal">{value.length}/{max} {value.length === 1 ? "image" : "images"}</span></label>
        {value.length > 0 && <span className="text-xs text-zinc-500">First image = primary • click “Primary” to reorder</span>}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragOver ? "border-[#0038A0] bg-[#F5F7FA]" : "border-zinc-200 hover:border-[#0038A0]/30 hover:bg-zinc-50"}`}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleInput} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-sm text-zinc-600"><Loader2 className="h-6 w-6 animate-spin text-[#0038A0]" /> Uploading {value.length}/{max}...</div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-[#0038A0] text-white grid place-items-center"><Upload className="h-5 w-5" /></div>
            <p className="text-sm font-medium">Drop images here or click to browse</p>
            <p className="text-xs text-zinc-500">PNG, JPG, WEBP up to 8MB each • Max {max} images • Will fallback to data URL on Vercel if needed</p>
          </div>
        )}
      </div>

      {/* URL add */}
      <div className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input ref={urlInputRef} placeholder="Or paste image URL (Unsplash, etc.) and Add" className="w-full border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg pl-10 pr-3 py-2 text-sm outline-none" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addByUrl(); } }} />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addByUrl} className="h-10 px-4 shrink-0">Add URL</Button>
        </div>
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {/* Preview grid */}
      {value.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div key={`${url}-${idx}`} className="group relative border-2 rounded-xl overflow-hidden bg-zinc-50 aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`upload-${idx}`} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x300/0038A0/FFFFFF?text=Error"; }} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-2">
                {idx !== 0 && <Button type="button" size="sm" variant="secondary" className="h-7 text-xs w-full" onClick={() => setPrimary(idx)}>Primary</Button>}
                {idx === 0 && <span className="bg-[#0038A0] text-white text-[10px] font-bold px-2 py-1 rounded-full">PRIMARY</span>}
                <Button type="button" size="sm" variant="destructive" className="h-7 text-xs w-full" onClick={() => removeAt(idx)}><X className="h-3 w-3" /> Remove</Button>
              </div>
              <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-full">{idx + 1}</span>
              <button type="button" onClick={() => removeAt(idx)} className="absolute top-1 right-1 h-6 w-6 bg-red-600 text-white rounded-full grid place-items-center md:hidden"><X className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-zinc-500 border-2 border-dashed rounded-xl p-4 text-center bg-zinc-50/50">No images yet — upload or paste URLs above. First image will be the product/blog cover.</div>
      )}

      {/* Hidden inputs for traditional form fallback (if JS disabled, will be empty) */}
      <input type="hidden" name="__image_uploader_debug" value={value.join(",")} readOnly className="hidden" />
    </div>
  );
}
