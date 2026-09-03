import Link from "next/link";

interface FooterProps {
  siteName: string;
  tagline: string;
  logoUrl: string;
}

export function Footer({ siteName, tagline, logoUrl }: FooterProps) {
  return (
    <footer className="mt-24 border-t border-white/10 bg-void-950/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-8 w-8 rounded-lg border border-white/10 object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-orange to-neon-rose shadow-neon-orange">
                  <span className="h-3 w-3 rotate-45 bg-white/90" />
                </span>
              )}
              <span className="font-display text-lg font-bold tracking-[0.2em] text-white">
                {siteName}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">{tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/50">
              <li><Link href="/shop" className="transition-colors hover:text-neon-amber">All products</Link></li>
              <li><Link href="/shop?category=Audio" className="transition-colors hover:text-neon-amber">Audio</Link></li>
              <li><Link href="/shop?category=Keyboards" className="transition-colors hover:text-neon-amber">Keyboards</Link></li>
              <li><Link href="/shop?category=Wearables" className="transition-colors hover:text-neon-amber">Wearables</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Account</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/50">
              <li><Link href="/cart" className="transition-colors hover:text-neon-amber">Cart</Link></li>
              <li><Link href="/checkout" className="transition-colors hover:text-neon-amber">Checkout</Link></li>
              <li><Link href="/login" className="transition-colors hover:text-neon-amber">Sign in</Link></li>
              <li><Link href="/signup" className="transition-colors hover:text-neon-amber">Sign up</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteName}. Crafted with neon.</p>
          <p className="flex items-center gap-1.5">
            Secure payments powered by{" "}
            <span className="font-semibold text-gradient">Stripe</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
