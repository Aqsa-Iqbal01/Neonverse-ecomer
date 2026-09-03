import Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { requireDb } from "@/lib/data";
import { checkoutSchema } from "@/lib/validators";
import { fromZodError, jsonError, jsonOk } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { appUrl } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    if (!stripe || !isStripeConfigured()) {
      return jsonError(
        "Stripe is not configured yet. Add your STRIPE_SECRET_KEY to .env.",
        503
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { email, items } = parsed.data;
    const db = requireDb();

    // Load products and validate stock.
    const ids = items.map((i) => i.id);
    const products = await db.product.findMany({ where: { id: { in: ids } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let total = 0;

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        return jsonError(`A product in your cart no longer exists (${item.id}).`, 400);
      }
      if (product.stock < item.quantity) {
        return jsonError(
          `"${product.name}" only has ${product.stock} in stock.`,
          409
        );
      }
      total += product.price * item.quantity;
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description.slice(0, 120),
            images: [product.imageUrl],
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      });
    }

    const session = await getSession();

    // Persist the order (pending) so we can finalize it on the webhook.
    const order = await db.order.create({
      data: {
        userId: session?.userId ?? null,
        email,
        amount: total,
        currency: "usd",
        status: "pending",
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.id)!;
            return {
              productId: product.id,
              productName: product.name,
              productImage: product.imageUrl,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
    });

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
      metadata: { orderId: order.id },
      success_url: appUrl(`/payment/success?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: appUrl(`/payment/cancelled?order=${order.id}`),
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US", "PK", "GB", "CA", "AE"] },
      // Make shipping cost part of the session (flat rate).
      shipping_options: [
        { shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 999, currency: "usd" }, display_name: "Express shipping" } },
      ],
    });

    // Link the session id to the order.
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkout.id },
    });

    return jsonOk({ url: checkout.url, sessionId: checkout.id, orderId: order.id });
  } catch (err) {
    console.error("[checkout]", err);
    if (err instanceof Error && err.message.includes("database is not configured")) {
      return jsonError("Server is not configured. Add DATABASE_URL to .env.", 503);
    }
    return jsonError("Failed to start checkout. Please try again.", 500);
  }
}
