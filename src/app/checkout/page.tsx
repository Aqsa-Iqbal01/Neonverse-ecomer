"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ProductImage } from "@/components/ProductImage";
import { CardPaymentForm } from "@/components/CardPaymentForm";
import { formatPrice } from "@/lib/utils";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_placeholder");

export default function CheckoutPage() {
  const { items, isLoaded, subtotal, itemCount } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntentData, setPaymentIntentData] = useState<{
    clientSecret: string;
    paymentIntentId: string;
    orderId: string;
  } | null>(null);

  useEffect(() => {
    if (user) setEmail(user.email);
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass shimmer h-96 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="glass mx-auto max-w-md rounded-2xl p-10 text-center">
          <h1 className="text-lg font-semibold text-white">Your cart is empty</h1>
          <p className="mt-2 text-sm text-white/50">
            Add some products before checking out.
          </p>
          <Link href="/shop" className="btn-neon mt-6">
            Browse shop
          </Link>
        </div>
      </div>
    );
  }

  const outOfStock = items.some((i) => i.stock < i.quantity);

  async function handleCreatePaymentIntent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Enter your email to continue.");
      return;
    }
    if (outOfStock) {
      setError("Some items in your cart are out of stock. Please review your cart.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to start checkout.");
      }

      setPaymentIntentData({
        clientSecret: data.clientSecret,
        paymentIntentId: data.paymentIntentId,
        orderId: data.orderId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  async function handleRetry() {
    setPaymentIntentData(null);
    setSubmitting(false);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight text-white">
        Secure <span className="text-gradient">Checkout</span>
      </h1>
      <p className="mt-2 text-sm text-white/50">
        Enter your card details below to complete your purchase securely.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass h-fit rounded-2xl p-6 lg:col-span-2"
        >
          {!paymentIntentData ? (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Contact details
              </h2>

              <form onSubmit={handleCreatePaymentIntent}>
                <div className="mt-4">
                  <label htmlFor="email" className="mb-1.5 block text-xs text-white/50">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-neon"
                    autoComplete="email"
                  />
                  <p className="mt-1.5 text-xs text-white/40">
                    We'll send your order confirmation here.
                  </p>
                </div>

                {user ? (
                  <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-xs text-emerald-300">
                    ✓ Signed in as {user.name} — order will be linked to your account.
                  </p>
                ) : (
                  <p className="mt-4 text-xs text-white/40">
                    <Link href="/login" className="text-neon-amber hover:text-white">
                      Sign in
                    </Link>{" "}
                    to link your order to an account (optional).
                  </p>
                )}

                <div className="mt-6 border-t border-white/10 pt-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                    Review ({itemCount} items)
                  </h3>
                  <ul className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <ProductImage
                            src={item.imageUrl}
                            alt={item.name}
                            name={item.name}
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-white">{item.name}</p>
                          <p className="text-xs text-white/40">Qty {item.quantity}</p>
                        </div>
                        <span className="text-xs font-semibold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </div>
                )}

                <button type="submit" disabled={submitting} className="btn-neon mt-6 w-full">
                  {submitting ? (
                    <>
                      <Spinner /> Processing…
                    </>
                  ) : (
                    <>
                      Continue to payment
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Complete payment
              </h2>
              <p className="mt-2 text-xs text-white/40">
                Paying with email: <span className="text-white/80">{email}</span>
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                  Order summary ({itemCount} items)
                </h3>
                <ul className="mt-3 max-h-48 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <ProductImage
                          src={item.imageUrl}
                          alt={item.name}
                          name={item.name}
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white">{item.name}</p>
                        <p className="text-xs text-white/40">Qty {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Elements stripe={stripePromise} key={paymentIntentData.clientSecret}>
                <CardPaymentForm
                  email={email}
                  orderId={paymentIntentData.orderId}
                  clientSecret={paymentIntentData.clientSecret}
                  paymentIntentId={paymentIntentData.paymentIntentId}
                  amount={subtotal}
                />
              </Elements>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                ← Change email or items
              </button>
            </>
          )}
        </motion.div>

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
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <dt className="text-white">Total</dt>
                <dd className="text-lg font-bold text-gradient">{formatPrice(subtotal)}</dd>
              </div>
            </dl>

            <Link href="/cart" className="btn-ghost mt-6 w-full text-xs">
              Back to cart
            </Link>
            {outOfStock && (
              <p className="mt-3 text-center text-xs text-red-400">
                Some items are out of stock — update your cart.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}