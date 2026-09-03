"use client";

import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Add product</h1>
      <p className="mt-1 text-sm text-white/50">
        Create a new product — it appears in the shop instantly.
      </p>
      <div className="mt-6">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
