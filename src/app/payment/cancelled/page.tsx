import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment cancelled",
  description: "Your payment was cancelled. No charges were made.",
};

export default function PaymentCancelledPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="glass mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-2xl p-10 text-center">
        <span className="glass flex h-20 w-20 items-center justify-center rounded-full text-3xl">
          ↩️
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Payment cancelled</h1>
          <p className="mt-2 text-sm text-white/50">
            No charges were made. Your cart is still safe — you can pick up right where you
            left off.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/cart" className="btn-neon">
            Back to cart
          </Link>
          <Link href="/shop" className="btn-ghost">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
