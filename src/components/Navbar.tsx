"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

interface NavbarProps {
  siteName: string;
  logoUrl: string;
}

export function Navbar({ siteName, logoUrl }: NavbarProps) {
  const { itemCount, isLoaded } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function handleLogout() {
    await logout();
    setAccountOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void-950/70 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label={`${siteName} home`}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={siteName}
              className="h-8 w-8 rounded-lg border border-white/10 object-cover"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          ) : (
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-orange to-neon-rose shadow-neon-orange">
              <span className="h-3 w-3 rotate-45 bg-white/90" />
            </span>
          )}
          <span className="font-display text-lg font-bold tracking-[0.2em] text-white">
            {siteName}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-neon-amber"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "text-neon-orange"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={`Cart, ${itemCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] text-white/80 transition-colors hover:border-neon-amber/50 hover:text-neon-amber"
          >
            <CartIcon />
            {isLoaded && itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-neon-rose to-neon-orange px-1 text-[10px] font-bold text-white shadow-neon-rose">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 text-sm font-medium text-white/80 transition-colors hover:border-neon-orange/50"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-neon-orange to-neon-rose text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-24 truncate lg:inline">{user.name.split(" ")[0]}</span>
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-void-900/90 p-1 backdrop-blur-2xl"
                  >
                    <div className="border-b border-white/10 px-3 py-2">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="truncate text-xs text-white/50">{user.email}</p>
                    </div>
                    <Link
                      href="/cart"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                    >
                      View cart
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="btn-ghost !px-4 !py-2 text-xs">
                Sign in
              </Link>
              <Link href="/signup" className="btn-neon !px-4 !py-2 text-xs">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] text-white/80 md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 bg-void-950/95 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive(link.href) ? "text-neon-amber bg-white/5" : "text-white/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-neon-orange"
                >
                  Admin
                </Link>
              )}
              {user ? (
                <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
                  <p className="px-2 text-xs text-white/50">
                    Signed in as <span className="text-white/80">{user.email}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg px-4 py-3 text-left text-sm text-red-400"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2 border-t border-white/10 pt-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn-ghost flex-1"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="btn-neon flex-1"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
