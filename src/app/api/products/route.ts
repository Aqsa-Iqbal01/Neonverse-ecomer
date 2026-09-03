import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api";
import { listProducts } from "@/lib/data";
import { PER_PAGE, type SortKey } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const perPage = Math.min(24, Math.max(1, Number(sp.get("perPage")) || PER_PAGE));

    const sortParam = sp.get("sort");
    const sort: SortKey = ["featured", "price-asc", "price-desc", "name-asc", "newest"].includes(
      sortParam ?? ""
    )
      ? (sortParam as SortKey)
      : "featured";

    const result = await listProducts({
      search: sp.get("q") ?? undefined,
      category: sp.get("category") ?? undefined,
      sort,
      page,
      perPage,
    });

    return jsonOk(result);
  } catch (err) {
    console.error("[products:list]", err);
    return jsonError(
      err instanceof Error && err.name === "DatabaseNotConfiguredError"
        ? "Database not configured."
        : "Failed to load products.",
      500
    );
  }
}
