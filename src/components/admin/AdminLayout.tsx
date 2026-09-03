"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🛍️" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // The login page lives under /admin but must render WITHOUT the admin guard,
  // otherwise a non-admin visitor would be stuck on the "Checking admin access…" spinner.
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [user, loading, router, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="glass flex items-center gap-4 rounded-2xl px-8 py-6">
          <svg className="h-6 w-6 animate-spin text-neon-amber" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="text-sm text-white/60">Checking admin access…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-2xl p-4">
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              Admin panel
            </p>
            <nav className="mt-3 flex flex-col gap-1" aria-label="Admin navigation">
              {NAV.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-neon-orange/15 text-neon-orange"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span aria-hidden>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 px-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neon-orange to-neon-amber text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-white">{user.name}</p>
                  <p className="truncate text-[10px] text-white/40">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white">
                  <span aria-hidden>🌐</span> View site
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    router.push("/");
                    router.refresh();
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-white/5"
                >
                  <span aria-hidden>🚪</span> Sign out
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
