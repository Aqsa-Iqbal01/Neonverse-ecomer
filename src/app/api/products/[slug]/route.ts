import { jsonError, jsonOk } from "@/lib/api";
import { getProductBySlug } from "@/lib/data";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return jsonError("Product not found.", 404);
    return jsonOk({ product });
  } catch (err) {
    console.error("[products:detail]", err);
    return jsonError("Failed to load product.", 500);
  }
}
