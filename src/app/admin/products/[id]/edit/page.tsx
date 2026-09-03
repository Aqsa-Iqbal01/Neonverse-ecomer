"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

type EditProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
};

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<EditProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed");
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product.");
      }
    })();
  }, [id]);

  if (error) {
    return (
      <div className="glass max-w-2xl rounded-2xl p-8 text-center">
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  if (!product) {
    return <p className="text-sm text-white/40">Loading product…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Edit product</h1>
      <p className="mt-1 text-sm text-white/50">Update details — changes go live instantly.</p>
      <div className="mt-6">
        <ProductForm mode="edit" initial={product} />
      </div>
    </div>
  );
}
