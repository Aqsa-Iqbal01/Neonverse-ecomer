import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { requireDb } from "@/lib/data";
import { checkoutSchema } from "@/lib/validators";
import { fromZodError, jsonError, jsonOk } from "@/lib/api";
import { getSession } from "@/lib/auth";

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

    const ids = items.map((i) => i.id);
    const products = await db.product.findMany({ where: { id: { in: ids } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

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
    }

    const session = await getSession();

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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order.id },
      receipt_email: email,
    });

    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: paymentIntent.id },
    });

    return jsonOk({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: order.id,
    });
  } catch (err) {
    console.error("[create-payment-intent]", err);
    if (err instanceof Error && err.message.includes("database is not configured")) {
      return jsonError("Server is not configured. Add DATABASE_URL to .env.", 503);
    }
    return jsonError("Failed to create payment. Please try again.", 500);
  }
}