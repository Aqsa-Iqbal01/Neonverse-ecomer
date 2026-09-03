"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index % 4, 3) * 0.08, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-neon-orange/50 hover:shadow-neon-orange"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden"
        aria-label={product.name}
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          name={product.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Hover glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(251,146,60,0.35),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-void-950/85 via-transparent to-transparent opacity-60" />

        {/* Category badge */}
        <span className="absolute left-3 top-3 badge !border-neon-orange/40 !text-neon-orange">
          {product.category}
        </span>

        {/* Stock badge */}
        {outOfStock ? (
          <span className="absolute right-3 top-3 badge !border-red-500/40 !text-red-400">
            Out of stock
          </span>
        ) : lowStock ? (
          <span className="absolute right-3 top-3 badge !border-amber-400/40 !text-amber-300">
            Only {product.stock} left
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/product/${product.slug}`} className="block">
              <h3 className="truncate text-sm font-semibold text-white transition-colors hover:text-neon-orange">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-2 text-xs text-white/50">{product.description}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-gradient">{formatPrice(product.price)}</span>
          <button
            type="button"
            disabled={outOfStock}
            onClick={() =>
              addItem({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                stock: product.stock,
                category: product.category,
              })
            }
            className="btn-neon !px-4 !py-2 text-xs disabled:opacity-40"
          >
            {outOfStock ? "Unavailable" : "Add to cart"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
