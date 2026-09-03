import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { SetupNotice } from "@/components/SetupNotice";
import { DatabaseNotConfiguredError, getFeaturedProducts } from "@/lib/data";
import { CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, string> = {
  Audio: "🎧",
  Keyboards: "⌨️",
  Wearables: "⌚",
  "VR & Gaming": "🕹️",
  Accessories: "🖱️",
  Displays: "🖥️",
  Laptops: "💻",
};

export default async function HomePage() {
  let products = [];
  let dbConfigured = true;

  try {
    products = await getFeaturedProducts(8);
  } catch (err) {
    if (err instanceof DatabaseNotConfiguredError) {
      dbConfigured = false;
    } else {
      console.error("[home]", err);
    }
  }

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl sm:grid-cols-3">
          {[
            { icon: "🚚", title: "Fast shipping", text: "Free express delivery over $200" },
            { icon: "🛡️", title: "Secure checkout", text: "Payments encrypted by Stripe" },
            { icon: "🔄", title: "30-day returns", text: "No-questions-asked warranty" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-orange/20 to-neon-amber/20 text-lg">
                {f.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="mt-0.5 text-xs text-white/50">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured products"
            subtitle="The essentials that started it all — fresh from the grid."
          />
          <Link
            href="/shop"
            className="btn-ghost text-xs"
          >
            View all products
          </Link>
        </div>

        <div className="mt-10">
          {dbConfigured ? (
            products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <p className="glass rounded-2xl p-10 text-center text-sm text-white/50">
                No products found yet. Run <code className="text-neon-amber">npm run seed</code> to
                populate the database.
              </p>
            )
          ) : (
            <SetupNotice>
              <p>
                Add your <code className="text-neon-amber">DATABASE_URL</code> to{" "}
                <code className="text-neon-amber">.env</code>, then run:
              </p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-void-900 p-3 text-xs text-neon-amber">
                {`npm run db:push\nnpm run seed\nnpm run dev`}
              </pre>
            </SetupNotice>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category"
          subtitle="From wired to wireless — find your lane."
          align="center"
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              className="glass card-hover group flex flex-col items-center gap-3 rounded-2xl p-6 text-center"
            >
              <span
                className="text-3xl transition-transform duration-300 group-hover:scale-125"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {CATEGORY_ICONS[c] ?? "🔮"}
              </span>
              <span className="text-sm font-medium text-white/80 group-hover:text-neon-amber">
                {c}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="glass relative overflow-hidden rounded-3xl p-10 text-center shadow-neon-glow sm:p-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-neon-orange/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-neon-amber/20 blur-3xl" />
          <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to join the <span className="text-gradient">neonverse</span>?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm text-white/55 sm:text-base">
            Create an account to sync your orders, then check out in seconds with
            Stripe — encrypted, secure, and blindingly fast.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-neon">
              Create free account
            </Link>
            <Link href="/shop" className="btn-ghost">
              Browse shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
