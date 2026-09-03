"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { QuantitySelector } from "@/components/QuantitySelector";
import { ProductImage } from "@/components/ProductImage";
import { EmptyState } from "@/components/EmptyState";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, isLoaded, subtotal, itemCount, updateQuantity, removeItem, clearCart } =
    useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight text-white">
        Your <span className="text-gradient">Cart</span>
      </h1>
      <p className="mt-2 text-sm text-white/50">
        {isLoaded ? `${itemCount} item${itemCount === 1 ? "" : "s"}` : "Loading…"}
      </p>

      {!isLoaded ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="glass shimmer h-64 rounded-2xl lg:col-span-2" />
          <div className="glass shimmer h-64 rounded-2xl" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Your cart is empty"
            description="Looks like you haven't added any glow yet. Browse the collection and find your signature piece."
            actionLabel="Browse shop"
            actionHref="/shop"
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.2 }}
                    className="glass flex gap-4 rounded-2xl p-4"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl"
                    >
                      <ProductImage
                        src={item.imageUrl}
                        alt={item.name}
                        name={item.name}
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            className="line-clamp-1 text-sm font-semibold text-white transition-colors hover:text-neon-amber"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-white/40">{item.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-red-400"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.id, q)}
                          max={item.stock}
                          ariaLabel={`Quantity for ${item.name}`}
                        />
                        <span className="font-semibold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-white/40 transition-colors hover:text-red-400"
              >
                Clear cart
              </button>
              <Link href="/shop" className="text-xs text-neon-amber transition-colors hover:text-white">
                ← Continue shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Order summary
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-white/50">Subtotal</dt>
                  <dd className="font-medium text-white">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-white/50">Shipping</dt>
                  <dd className="text-white/40">Calculated at checkout</dd>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <dt className="text-white">Total</dt>
                  <dd className="text-lg font-bold text-gradient">{formatPrice(subtotal)}</dd>
                </div>
              </dl>

              <Link href="/checkout" className="btn-neon mt-6 w-full">
                Proceed to checkout
              </Link>
              <p className="mt-3 text-center text-xs text-white/40">
                Secure payment via Stripe · Cancel anytime
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
