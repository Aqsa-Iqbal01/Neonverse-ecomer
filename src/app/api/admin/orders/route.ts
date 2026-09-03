import { jsonError, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/admin";
import { requireDb } from "@/lib/data";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const db = requireDb();
    const orders = await db.order.findMany({
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return jsonOk({
      orders: orders.map((o) => ({
        id: o.id,
        email: o.email,
        customer: o.user?.name ?? null,
        amount: o.amount,
        currency: o.currency,
        status: o.status,
        stripeSessionId: o.stripeSessionId,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
          price: i.price,
        })),
      })),
    });
  } catch (err) {
    console.error("[admin:orders]", err);
    return jsonError("Failed to load orders.", 500);
  }
}
