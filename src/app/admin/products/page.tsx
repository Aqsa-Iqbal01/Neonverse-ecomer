"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";

type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  description: string;
  createdAt: string;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products${q ? `?q=${encodeURIComponent(q)}` : ""}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed");
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load("");
  }, [load]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-white/50">{products.length} products</p>
        </div>
        <Link href="/admin/products/new" className="btn-neon !px-4 !py-2 text-xs">
          + Add product
        </Link>
      </div>

      <div className="mt-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") load(query);
          }}
          placeholder="Search by name or category…"
          aria-label="Search products"
          className="input-neon max-w-sm"
        />
        <button
          type="button"
          onClick={() => load(query)}
          className="btn-ghost ml-2 !px-4 !py-3 text-xs"
        >
          Search
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="glass mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-white/40">
                  Loading…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-white/40">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <ProductImage src={p.imageUrl} alt={p.name} name={p.name} sizes="40px" className="object-cover" />
                      </span>
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/50">{p.category}</td>
                  <td className="px-4 py-3 font-semibold text-white">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.stock <= 5
                          ? "font-medium text-amber-400"
                          : p.stock === 0
                          ? "font-medium text-red-400"
                          : "text-white/60"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="btn-ghost !px-3 !py-1.5 text-xs"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="btn-ghost !px-3 !py-1.5 text-xs !text-red-400 hover:!border-red-400/50 disabled:opacity-40"
                      >
                        {deleting === p.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
