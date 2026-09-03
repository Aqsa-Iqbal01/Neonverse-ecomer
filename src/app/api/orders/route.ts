import { jsonError, jsonOk } from "@/lib/api";
import { requireDb } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return jsonError("Please sign in to view your orders.", 401);

    const db = requireDb();
    const orders = await db.order.findMany({
      where: { userId: session.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const data = orders.map((o) => ({
      id: o.id,
      email: o.email,
      amount: o.amount,
      currency: o.currency,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        productName: i.productName,
        productImage: i.productImage,
        quantity: i.quantity,
        price: i.price,
      })),
    }));

    return jsonOk({ orders: data });
  } catch (err) {
    console.error("[orders:list]", err);
    return jsonError("Failed to load orders.", 500);
  }
}
