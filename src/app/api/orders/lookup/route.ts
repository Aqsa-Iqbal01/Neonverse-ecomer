import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api";
import { requireDb } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

/**
 * Look up an order by its Stripe Checkout session id or PaymentIntent id.
 * Used by the payment success page to confirm the payment landed.
 */
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    const paymentIntentId = request.nextUrl.searchParams.get("payment_intent");
    const lookupId = sessionId ?? paymentIntentId;
    if (!lookupId) return jsonError("Missing session_id or payment_intent.", 400);

    const db = requireDb();
    const order = await db.order.findUnique({
      where: { stripeSessionId: lookupId },
      include: { items: true },
    });

    if (!order) {
      return jsonError("Order not found.", 404);
    }

    // If the order is still pending, cross-check with Stripe directly — the
    // webhook may not have landed yet.
    let status = order.status;
    if (status === "pending") {
      const stripe = getStripe();
      if (stripe) {
        try {
          // Try PaymentIntent first, then Checkout Session.
          let paid = false;
          let cancelled = false;
          if (paymentIntentId || sessionId?.startsWith("pi_")) {
            const pi = await stripe.paymentIntents.retrieve(lookupId);
            if (pi.status === "succeeded") {
              paid = true;
            } else if (pi.status === "canceled") {
              cancelled = true;
            }
          } else {
            const sess = await stripe.checkout.sessions.retrieve(lookupId);
            if (sess.payment_status === "paid") {
              paid = true;
            } else if (["expired", "canceled"].includes(sess.status ?? "")) {
              cancelled = true;
            }
          }
          if (paid) {
            await db.order.update({
              where: { id: order.id },
              data: { status: "paid" },
            });
            status = "paid";
          } else if (cancelled) {
            await db.order.update({
              where: { id: order.id },
              data: { status: "cancelled" },
            });
            status = "cancelled";
          }
        } catch {
          // Stripe unreachable — keep DB status.
        }
      }
    }

    // Security: if the order belongs to a signed-in user, only allow that user.
    const session = await getSession();
    if (order.userId && session && order.userId !== session.userId) {
      return jsonError("Unauthorized.", 403);
    }

    return jsonOk({
      order: {
        id: order.id,
        email: order.email,
        amount: order.amount,
        currency: order.currency,
        status,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((i) => ({
          id: i.id,
          productId: i.productId,
          productName: i.productName,
          productImage: i.productImage,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    });
  } catch (err) {
    console.error("[orders:lookup]", err);
    return jsonError("Failed to look up order.", 500);
  }
}
