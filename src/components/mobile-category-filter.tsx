"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  CCTV: "CCTV",
  INTERCOM: "Intercom",
  ACCESS_CONTROL: "Access Control",
  BIOMETRICS: "Biometrics",
  NETWORKING: "Networking",
  ELECTRIC_FENCE: "E-Fence",
  GATE_AUTOMATION: "Gates",
  FIRE_ALARM: "Fire Alarm",
  SOLAR: "Solar",
  SMART_HOME: "Smart Home",
  ELECTRICAL: "Electrical",
  IT_SUPPORT: "IT",
  ACCESSORIES: "Accessories",
  ICT: "ICT Products",
};

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "sold", label: "Best Sellers" },
];

export function MobileCategoryFilter({
  currentCategory,
  currentSort,
  currentQ,
  currentMin,
  currentMax,
  productCount,
}: {
  currentCategory?: string;
  currentSort?: string;
  currentQ?: string;
  currentMin?: string;
  currentMax?: string;
  productCount: number;
}) {
  const [open, setOpen] = useState(false);
  const categoryLabel = currentCategory ? CATEGORY_LABELS[currentCategory] || currentCategory : "All Categories";

  return (
    <div className="lg:hidden space-y-3 mb-4">
      {/* Category dropdown */}
      <div className="border-2 border-[#0038A0]/15 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold"
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0038A0]" />
            {categoryLabel}
            <span className="text-zinc-400 font-normal">• {productCount} products</span>
          </span>
          <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="border-t px-3 py-2 space-y-1 max-h-[50vh] overflow-y-auto">
            <Link
              href="/shop"
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${!currentCategory ? "bg-[#0038A0] text-white" : "hover:bg-zinc-100"}`}
            >
              All Categories
            </Link>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <Link
                key={value}
                href={`/shop?category=${value}`}
                className={`block px-3 py-2 rounded-lg text-sm transition ${currentCategory === value ? "bg-[#002070] text-white font-semibold" : "hover:bg-zinc-100"}`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sort + Price row */}
      <div className="flex gap-2">
        <select
          defaultValue={currentSort || ""}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            if (e.target.value) params.set("sort", e.target.value);
            else params.delete("sort");
            window.location.href = `/shop?${params.toString()}`;
          }}
          className="flex-1 border-2 border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-[#0038A0] outline-none bg-white"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const q = String(form.get("q") || "");
          const params = new URLSearchParams(window.location.search);
          if (q) params.set("q", q);
          else params.delete("q");
          window.location.href = `/shop?${params.toString()}`;
        }}
        className="flex gap-2"
      >
        <input name="q" defaultValue={currentQ} placeholder="Search products..." className="flex-1 border-2 border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-[#0038A0] outline-none" />
        <button type="submit" className="bg-[#0038A0] text-white px-4 rounded-lg text-sm font-medium">Go</button>
      </form>
    </div>
  );
}
