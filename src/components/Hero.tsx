"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-24">
        {/* Left — copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge !border-neon-amber/40 !text-neon-amber"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-amber" />
            New season drops are live
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Gear that
            <br />
            <span className="text-gradient">glows</span> in the dark.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-base text-white/55 sm:text-lg"
          >
            Premium electronics with a neon soul. Explore the collection, find your
            signature glow, and check out in seconds with secure Stripe payments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/shop" className="btn-neon">
              Shop now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/shop?category=Audio" className="btn-ghost">
              Explore audio
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6"
          >
            {[
              { value: "20+", label: "Curated products" },
              { value: "24h", label: "Express shipping" },
              { value: "100%", label: "Secure checkout" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-gradient">{s.value}</p>
                <p className="mt-1 text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — real product image with neon glow frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* Glow backdrop — sunset */}
            <div className="absolute -inset-8 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,rgba(251,146,60,0.4),rgba(244,63,94,0.3),rgba(251,191,36,0.4),rgba(251,146,60,0.4))] blur-2xl" />

            {/* Floating chip */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass-strong absolute -left-10 top-8 z-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-neon-orange"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-orange to-neon-rose text-white">
                🎧
              </span>
              <div>
                <p className="text-xs font-semibold text-white">Aurora Wireless</p>
                <p className="text-[10px] text-white/50">Noise cancelling · 40h</p>
              </div>
            </motion.div>

            {/* Floating chip 2 */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="glass-strong absolute -right-8 bottom-12 z-10 flex items-center gap-2 rounded-2xl px-4 py-3 shadow-neon-amber"
            >
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-xs font-semibold text-white">24h battery</p>
                <p className="text-[10px] text-white/50">Fast charge</p>
              </div>
            </motion.div>

            {/* Image frame */}
            <div className="glass relative h-full w-full overflow-hidden rounded-[2rem] border-white/15 shadow-neon-glow">
              <Image
                src={HERO_IMAGE}
                alt="Aurora Wireless Headphones — featured product"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
              />
              {/* Tint + bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-void-950/85 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,146,60,0.4),transparent_60%)]" />

              {/* Product label */}
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-void-950/75 px-4 py-3 backdrop-blur-xl">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neon-amber">
                    Featured
                  </p>
                  <p className="font-display text-lg font-bold text-white">Aurora Wireless</p>
                </div>
                <span className="text-sm font-bold text-gradient">$299</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
