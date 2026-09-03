import { jsonError, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/admin";
import { requireDb } from "@/lib/data";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const db = requireDb();
    const [productCount, userCount, orderCount, paidOrders, lowStock] = await Promise.all([
      db.product.count(),
      db.user.count(),
      db.order.count(),
      db.order.findMany({ where: { status: "paid" }, select: { amount: true } }),
      db.product.count({ where: { stock: { lte: 5 } } }),
    ]);

    const revenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    const recentOrders = await db.order.findMany({
      include: { items: { take: 5 } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return jsonOk({
      stats: {
        productCount,
        userCount,
        orderCount,
        paidOrders: paidOrders.length,
        revenue,
        lowStock,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        email: o.email,
        amount: o.amount,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        items: o.items.length,
      })),
    });
  } catch (err) {
    console.error("[admin:stats]", err);
    return jsonError("Failed to load stats.", 500);
  }
}
