"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3, Quote, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Code } from "lucide-react";

// Simple rich text editor using contentEditable + execCommand (still widely supported)
// Stores HTML string and emits onChange. Also handles image uploads via /api/upload.

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Write detailed content...", minHeight = "280px" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Keep editor content in sync when value changes externally (e.g., initial load)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const emit = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    emit();
  };

  const handleLink = () => {
    const url = prompt("Enter URL (https://...):");
    if (!url) return;
    try { new URL(url); } catch { alert("Invalid URL"); return; }
    exec("createLink", url);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) { alert("Images only"); return; }
    // upload to /api/upload
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      const url: string = json.url || json.urls?.[0];
      if (url && editorRef.current) {
        editorRef.current.focus();
        // insert image at cursor
        document.execCommand("insertImage", false, url);
        // make inserted image responsive
        // wrap with figure? simple.
        emit();
      }
    } catch (e: any) {
      alert("Image upload failed: " + e.message);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle paste of images / html
  const onPaste = (e: React.ClipboardEvent) => {
    // let default handle, then emit next tick
    setTimeout(emit, 0);
  };

  return (
    <div className={`border-2 rounded-xl overflow-hidden bg-white ${isFocused ? "border-[#0038A0] ring-2 ring-[#0038A0]/10" : "border-zinc-200"}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-zinc-50 border-b border-zinc-200">
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} title="Bold (Ctrl+B)"><Bold className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} title="Italic"><Italic className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("underline"); }} title="Underline"><Underline className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); }} title="Clear">✕</Button>
        </div>
        <div className="w-px bg-zinc-200 mx-1" />
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "<h2>"); }} title="Heading 2"><Heading2 className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "<h3>"); }} title="Heading 3"><Heading3 className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "<p>"); }} title="Paragraph" >P</Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "<blockquote>"); }} title="Quote"><Quote className="h-4 w-4" /></Button>
        </div>
        <div className="w-px bg-zinc-200 mx-1" />
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }} title="Bullet list"><List className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }} title="Numbered"><ListOrdered className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "<pre>"); }} title="Code"><Code className="h-4 w-4" /></Button>
        </div>
        <div className="w-px bg-zinc-200 mx-1" />
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); handleLink(); }} title="Link"><LinkIcon className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => fileInputRef.current?.click()} title="Insert image"><ImageIcon className="h-4 w-4" /></Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />
        </div>
        <div className="w-px bg-zinc-200 mx-1" />
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("undo"); }} title="Undo"><Undo className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onMouseDown={(e) => { e.preventDefault(); exec("redo"); }} title="Redo"><Redo className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); emit(); }}
        onPaste={onPaste}
        data-placeholder={placeholder}
        className="w-full p-4 outline-none prose max-w-none prose-sm prose-headings:font-black prose-a:text-[#0038A0] prose-a:underline prose-img:rounded-xl prose-img:border prose-blockquote:border-l-2 prose-blockquote:border-[#0038A0] prose-blockquote:bg-zinc-50 prose-blockquote:px-3 prose-blockquote:py-1 min-h-[280px] overflow-auto"
        style={{ minHeight }}
      />

      {/* Hint */}
      <div className="px-3 py-2 bg-zinc-50 border-t text-xs text-zinc-500 flex flex-wrap gap-3 justify-between">
        <span>Tip: Paste images, use headings, links. Content is saved as HTML.</span>
        <span className="hidden sm:inline">Supports bold, lists, quotes, images uploaded via /api/upload</span>
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #a1a1aa;
          pointer-events: none;
        }
        div :global(img) { max-width: 100%; height: auto; }
      `}</style>
    </div>
  );
}
