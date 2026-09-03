import { fromZodError, jsonError, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/admin";
import { requireDb } from "@/lib/data";
import { adminProductSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { id } = await params;
    const db = requireDb();
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return jsonError("Product not found.", 404);
    return jsonOk({ product });
  } catch (err) {
    console.error("[admin:products:get]", err);
    return jsonError("Failed to load product.", 500);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = adminProductSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const db = requireDb();
    const existingProduct = await db.product.findUnique({ where: { id } });
    if (!existingProduct) return jsonError("Product not found.", 404);

    const data = parsed.data;
    // Keep the slug stable unless the name changed.
    let slug = existingProduct.slug;
    const newSlug = slugify(data.name) || "product";
    if (newSlug !== existingProduct.slug) {
      const clash = await db.product.findFirst({
        where: { slug: newSlug, id: { not: id } },
      });
      slug = clash ? `${newSlug}-${id.slice(0, 5)}` : newSlug;
    }

    const product = await db.product.update({
      where: { id },
      data: { ...data, slug },
    });

    return jsonOk({ product });
  } catch (err) {
    console.error("[admin:products:update]", err);
    return jsonError("Failed to update product.", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { id } = await params;
    const db = requireDb();
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return jsonError("Product not found.", 404);

    // Order items keep a snapshot (productName/productImage), so deleting a
    // product never breaks historical orders.
    await db.product.delete({ where: { id } });

    return jsonOk({ ok: true });
  } catch (err) {
    console.error("[admin:products:delete]", err);
    return jsonError("Failed to delete product.", 500);
  }
}
