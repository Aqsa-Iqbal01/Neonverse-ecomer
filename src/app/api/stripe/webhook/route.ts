import { getStripe } from "@/lib/stripe";
import { requireDb } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    return new Response("Stripe webhook not configured.", { status: 503 });
  }

  let event;
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) return new Response("Missing signature.", { status: 400 });
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[stripe:webhook] signature verification failed", err);
    return new Response("Webhook signature verification failed.", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "payment_intent.succeeded": {
        const obj = event.data.object as { metadata?: { orderId?: string }; id: string };
        const orderId = obj.metadata?.orderId;

        if (!orderId) {
          console.warn("[stripe:webhook] event has no orderId metadata", obj.id);
          return new Response("Ignored: no order metadata.", { status: 200 });
        }

        const db = requireDb();

        await db.$transaction(async (tx) => {
          const order = await tx.order.findUnique({ where: { id: orderId } });
          if (!order || order.status !== "pending") {
            return;
          }

          await tx.order.update({
            where: { id: orderId },
            data: { status: "paid" },
          });

          const orderItems = await tx.orderItem.findMany({ where: { orderId } });
          for (const item of orderItems) {
            if (!item.productId) continue;
            await tx.product.updateMany({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        });

        console.log(`[stripe:webhook] order ${orderId} marked as paid (${event.type})`);
        return new Response("OK", { status: 200 });
      }

      case "checkout.session.expired":
      case "payment_intent.canceled": {
        const obj = event.data.object as { metadata?: { orderId?: string } };
        const orderId = obj.metadata?.orderId;
        if (orderId) {
          const db = requireDb();
          await db.order.updateMany({
            where: { id: orderId, status: "pending" },
            data: { status: "cancelled" },
          });
        }
        return new Response("OK", { status: 200 });
      }

      default:
        return new Response("OK", { status: 200 });
    }
  } catch (err) {
    console.error("[stripe:webhook] processing failed", err);
    return new Response("Webhook processing error.", { status: 500 });
  }
}
