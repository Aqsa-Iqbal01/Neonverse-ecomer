import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/PaymentSuccess";

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Your payment went through. Thanks for shopping with NEONVERSE.",
};

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <Suspense fallback={null}>
        <PaymentSuccess />
      </Suspense>
    </div>
  );
}
