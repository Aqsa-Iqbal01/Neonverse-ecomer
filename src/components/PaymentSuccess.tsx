"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import type { OrderDto } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? searchParams.get("payment_intent");
  const { clearCart } = useCart();

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [status, setStatus] = useState<"loading" | "processing" | "paid" | "failed">("loading");
  const [error, setError] = useState<string | null>(null);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      setError("Missing payment session. Please return to the shop.");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    async function poll() {
      try {
        const res = await fetch(`/api/orders/lookup?payment_intent=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          if (res.status === 404) {
            setStatus("failed");
            setError("We couldn't find that order.");
          }
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setOrder(data.order);
          if (data.order.status === "paid") {
            setStatus("paid");
            if (!clearedRef.current) {
              clearCart();
              clearedRef.current = true;
            }
          } else if (data.order.status === "cancelled") {
            setStatus("failed");
            setError("This payment was cancelled.");
          } else {
            // Still pending — poll a few times for the webhook to land.
            attempts += 1;
            if (attempts < 10) {
              setTimeout(poll, 1500);
            } else {
              setStatus("processing");
            }
          }
        }
      } catch {
        if (!cancelled) setStatus("failed");
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  if (status === "loading" || status === "processing") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
        <div className="glass flex h-20 w-20 items-center justify-center rounded-full">
          <svg className="h-8 w-8 animate-spin text-neon-amber" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {status === "processing" ? "Confirming your payment…" : "Checking your order…"}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {status === "processing"
              ? "This can take a few seconds. Don't close this tab."
              : "Verifying your payment with Stripe."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
        <span className="glass flex h-20 w-20 items-center justify-center rounded-full text-3xl">
          ⚠️
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Payment not confirmed</h1>
          <p className="mt-2 text-sm text-white/50">{error ?? "We couldn't confirm your payment."}</p>
        </div>
        <Link href="/shop" className="btn-neon">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl"
    >
      <div className="glass rounded-3xl p-8 text-center shadow-neon-glow">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-neon-amber text-white shadow-neon-amber"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.span>

        <h1 className="mt-6 font-display text-3xl font-bold text-white">
          Payment successful!
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Thanks for your order. A confirmation was sent to{" "}
          <span className="text-white/80">{order?.email}</span>.
        </p>

        {order && (
          <div className="mt-8 text-left">
            <div className="flex items-center justify-between rounded-t-2xl border border-b-0 border-white/10 bg-white/[0.03] px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Order #{order.id.slice(-8)}
              </span>
              <span className="badge !border-emerald-400/40 !text-emerald-300">
                {order.status}
              </span>
            </div>
            <div className="rounded-b-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
              <ul className="space-y-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-white/80">
                      {item.productName} <span className="text-white/40">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-white">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-sm text-white/60">Total paid</span>
                <span className="text-lg font-bold text-gradient">{formatPrice(order.amount)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-neon">
            Continue shopping
          </Link>
          <Link href="/cart" className="btn-ghost">
            View cart
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
