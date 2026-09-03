"use client";

import { useState } from "react";
import { QuantitySelector } from "./QuantitySelector";
import { AddToCartButton } from "./AddToCartButton";
import type { Product } from "@/lib/types";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const max = Math.max(1, product.stock);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        max={max}
        ariaLabel={`Quantity for ${product.name}`}
      />
      <AddToCartButton product={product} quantity={quantity} className="flex-1 sm:flex-none" label="Add to cart" />
    </div>
  );
}
