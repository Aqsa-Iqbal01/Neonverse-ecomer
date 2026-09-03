import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SortSelect } from "@/components/SortSelect";
import { ProductGrid } from "@/components/ProductGrid";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { SetupNotice } from "@/components/SetupNotice";
import { DatabaseNotConfiguredError, listProducts, getCategories } from "@/lib/data";
import { PER_PAGE, type SortKey } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}

const SORTS: SortKey[] = ["featured", "price-asc", "price-desc", "name-asc", "newest"];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;
  const q = sp.q?.trim();
  const category = sp.category;
  const sort = SORTS.includes(sp.sort as SortKey) ? (sp.sort as SortKey) : "featured";
  const page = Math.max(1, Number(sp.page) || 1);

  let categories: string[] = [];
  let result = null;
  let dbConfigured = true;
  let error: string | null = null;

  try {
    [categories, result] = await Promise.all([
      getCategories(),
      listProducts({ search: q, category, sort, page, perPage: PER_PAGE }),
    ]);
  } catch (err) {
    if (err instanceof DatabaseNotConfiguredError) {
      dbConfigured = false;
    } else {
      error = "Failed to load products. Please try again.";
      console.error("[shop]", err);
    }
  }

  const filterActive = Boolean(q) || (category && category !== "all");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white">
            The <span className="text-gradient">Shop</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {dbConfigured && result
              ? `${result.total} product${result.total === 1 ? "" : "s"} in the neonverse`
              : "Browse the full collection"}
            {filterActive ? " — filtered." : ""}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Suspense fallback={null}>
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SortSelect />
            </div>
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>

      {/* Results */}
      <div className="mt-10">
        {!dbConfigured ? (
          <SetupNotice>
            <p>
              Connect your Neon database to see products. Add{" "}
              <code className="text-neon-amber">DATABASE_URL</code> to{" "}
              <code className="text-neon-amber">.env</code>, then run:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-void-900 p-3 text-xs text-neon-amber">
              {`npm run db:push\nnpm run seed\nnpm run dev`}
            </pre>
          </SetupNotice>
        ) : error ? (
          <EmptyState title="Something went wrong" description={error} actionLabel="Retry" actionHref="/shop" />
        ) : result && result.items.length > 0 ? (
          <>
            <ProductGrid products={result.items} />
            <Pagination page={result.page} totalPages={result.totalPages} />
          </>
        ) : (
          <EmptyState
            title="No products found"
            description={
              filterActive
                ? "Try adjusting your search or filters."
                : "The database is empty — run `npm run seed` to add products."
            }
            actionLabel="Clear filters"
            actionHref="/shop"
          />
        )}
      </div>
    </div>
  );
}
