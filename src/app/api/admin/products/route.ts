import type { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { fromZodError, jsonError, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/admin";
import { requireDb } from "@/lib/data";
import { adminProductSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const db = requireDb();
    const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    const where: Prisma.ProductWhereInput = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const items = await db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return jsonOk({
      products: items.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        category: p.category,
        imageUrl: p.imageUrl,
        stock: p.stock,
        description: p.description,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[admin:products:list]", err);
    return jsonError("Failed to load products.", 500);
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json().catch(() => null);
    const parsed = adminProductSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const db = requireDb();
    const data = parsed.data;

    // Build a unique slug from the name.
    let slug = slugify(data.name) || "product";
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const product = await db.product.create({
      data: { ...data, slug } as any,
    });

    return jsonOk({ product }, 201);
  } catch (err) {
    console.error("[admin:products:create]", err);
    return jsonError("Failed to create product.", 500);
  }
}
