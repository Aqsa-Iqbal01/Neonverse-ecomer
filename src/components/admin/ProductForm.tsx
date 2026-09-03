"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  mode: "create" | "edit";
  initial?: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
  };
}

const MAX_IMAGE_BYTES = 700 * 1024; // ~700 KB

export function ProductForm({ mode, initial }: ProductFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priceDollars, setPriceDollars] = useState(
    initial ? (initial.price / 100).toFixed(2) : ""
  );
  const [category, setCategory] = useState(initial?.category ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [stock, setStock] = useState(String(initial?.stock ?? ""));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image is too large. Max ~700 KB. Compress it or use a URL instead.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(String(reader.result ?? ""));
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const price = Math.round(parseFloat(priceDollars) * 100);
    if (!name.trim()) return setError("Product name is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!Number.isFinite(price) || price <= 0) return setError("Enter a valid price.");
    if (!imageUrl.trim()) return setError("Add an image (URL or upload).");
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
      return setError("Enter a valid stock number.");

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim() || "General",
      imageUrl: imageUrl.trim(),
      stock: Number(stock),
    };

    setSubmitting(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass max-w-2xl rounded-2xl p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs text-white/50">
            Product name
          </label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="input-neon" placeholder="Aurora Wireless Headphones" />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-xs text-white/50">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="input-neon resize-none"
            placeholder="Describe the product…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1.5 block text-xs text-white/50">
              Price (USD)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={priceDollars}
              onChange={(e) => setPriceDollars(e.target.value)}
              className="input-neon"
              placeholder="299.99"
              inputMode="decimal"
            />
          </div>
          <div>
            <label htmlFor="stock" className="mb-1.5 block text-xs text-white/50">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="input-neon"
              placeholder="24"
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-xs text-white/50">
            Category
          </label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-neon"
            placeholder="Audio, Keyboards, Wearables…"
            list="category-suggestions"
          />
          <datalist id="category-suggestions">
            {["Audio", "Keyboards", "Wearables", "VR & Gaming", "Accessories", "Displays", "Laptops"].map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="imageUrl" className="mb-1.5 block text-xs text-white/50">
            Image — URL <span className="text-white/30">or upload from your device</span>
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input-neon flex-1"
              placeholder="https://… (paste an image URL)"
              type="text"
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="btn-ghost cursor-pointer !px-4 !py-3 text-xs"
            >
              📁 Upload
            </label>
          </div>
          {imageUrl && (
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="h-16 w-16 rounded-lg border border-white/10 object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting} className="btn-neon">
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
