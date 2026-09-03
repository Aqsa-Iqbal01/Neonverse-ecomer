import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductImage } from "@/components/ProductImage";
import { ProductActions } from "@/components/ProductActions";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { SetupNotice } from "@/components/SetupNotice";
import { DatabaseNotConfiguredError, getProductBySlug, listProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product = null;
  let related = [];
  let dbConfigured = true;

  try {
    product = await getProductBySlug(slug);
    if (!product) notFound();

    const relatedResult = await listProducts({
      category: product.category,
      perPage: 4,
      page: 1,
    });
    related = relatedResult.items.filter((p) => p.id !== product.id).slice(0, 4);
  } catch (err) {
    if (err instanceof DatabaseNotConfiguredError) {
      dbConfigured = false;
    } else {
      throw err;
    }
  }

  if (!dbConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <SetupNotice>
          <p>
            Connect your Neon database to view products. Add{" "}
            <code className="text-neon-amber">DATABASE_URL</code> to{" "}
            <code className="text-neon-amber">.env</code>, then run{" "}
            <code className="text-neon-amber">npm run db:push && npm run seed</code>.
          </p>
        </SetupNotice>
      </div>
    );
  }

  const p = product as NonNullable<typeof product>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-white/50">
        <Link href="/" className="transition-colors hover:text-neon-amber">Home</Link>
        <span>/</span>
        <Link href="/shop" className="transition-colors hover:text-neon-amber">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${encodeURIComponent(p.category)}`} className="transition-colors hover:text-neon-amber">
          {p.category}
        </Link>
        <span>/</span>
        <span className="truncate text-white/80">{p.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-neon-glow">
          <ProductImage
            src={p.imageUrl}
            alt={p.name}
            name={p.name}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <Link
              href={`/shop?category=${encodeURIComponent(p.category)}`}
              className="badge !border-neon-amber/40 !text-neon-amber"
            >
              {p.category}
            </Link>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {p.name}
            </h1>
            <p className="mt-4 text-lg font-bold text-gradient">{formatPrice(p.price)}</p>
          </div>

          <p className="text-sm leading-relaxed text-white/60 sm:text-base">
            {p.description}
          </p>

          {/* Stock */}
          <div>
            {p.stock > 0 ? (
              <p className="inline-flex items-center gap-2 text-sm text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                In stock — {p.stock} available
              </p>
            ) : (
              <p className="inline-flex items-center gap-2 text-sm text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                Out of stock
              </p>
            )}
          </div>

          <ProductActions product={product!} />

          {/* Extras */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { icon: "🚚", label: "Free shipping" },
              { icon: "🛡️", label: "2-year warranty" },
              { icon: "🔄", label: "30-day returns" },
            ].map((e) => (
              <div key={e.label} className="glass rounded-xl p-3 text-center">
                <span className="text-lg">{e.icon}</span>
                <p className="mt-1 text-xs text-white/60">{e.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading eyebrow="Keep exploring" title="You might also like" />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
