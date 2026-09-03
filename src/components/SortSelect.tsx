"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/constants";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "featured";

  function change(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === "featured") params.delete("sort");
    else params.set("sort", e.target.value);
    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-xs text-white/50">
      <span className="whitespace-nowrap">Sort</span>
      <select
        value={sort}
        onChange={change}
        aria-label="Sort products"
        className="cursor-pointer rounded-xl border border-white/15 bg-void-900 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-neon-orange"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
