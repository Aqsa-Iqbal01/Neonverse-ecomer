"use client";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  email: string;
  orderId: string;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#fdf6ef",
      fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
      fontSize: "14px",
      "::placeholder": { color: "rgba(255, 255, 255, 0.3)" },
      iconColor: "#fbbf24",
    },
    invalid: {
      color: "#fca5a5",
      iconColor: "#fca5a5",
    },
  },
};

export function CardPaymentForm({ email, orderId, clientSecret, paymentIntentId, amount }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: { email },
      },
    });

    if (submitError) {
      setError(submitError.message ?? "Payment failed.");
      setProcessing(false);
    } else {
      router.push(`/payment/success?payment_intent=${paymentIntentId}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-6">
        <label className="mb-1.5 block text-xs text-white/50">
          Card details <span className="text-red-400">*</span>
        </label>
        <div className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 transition-all duration-300 focus-within:border-neon-amber focus-within:ring-2 focus-within:ring-neon-amber/30">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-neon mt-6 w-full"
      >
        {processing ? (
          <>
            <Spinner /> Processing payment…
          </>
        ) : (
          <>
            <LockIcon /> Pay ${(amount / 100).toFixed(2)} securely
          </>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
        <ShieldIcon />
        Payments encrypted & processed by Stripe
      </div>
    </form>
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

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}