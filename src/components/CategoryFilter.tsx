"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";

  function select(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") params.delete("category");
    else params.set("category", category);
    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  }

  const all = [{ value: "all", label: "All" }, ...categories.map((c) => ({ value: c, label: c }))];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {all.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => select(c.value)}
          aria-pressed={active === c.value}
          className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 ${
            active === c.value
              ? "border-neon-amber bg-neon-amber/15 text-neon-amber shadow-neon-amber"
              : "border-white/15 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
