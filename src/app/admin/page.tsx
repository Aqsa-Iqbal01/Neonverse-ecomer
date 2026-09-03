"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

type Stats = {
  productCount: number;
  userCount: number;
  orderCount: number;
  paidOrders: number;
  revenue: number;
  lowStock: number;
};

type RecentOrder = {
  id: string;
  email: string;
  amount: number;
  status: string;
  createdAt: string;
  items: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed");
        const data = await res.json();
        setStats(data.stats);
        setRecent(data.recentOrders ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats.");
      }
    })();
  }, []);

  const cards = [
    { label: "Products", value: stats?.productCount, href: "/admin/products", icon: "🛍️", tone: "text-neon-orange" },
    { label: "Orders", value: stats?.orderCount, href: "/admin/orders", icon: "📦", tone: "text-neon-amber" },
    { label: "Paid orders", value: stats?.paidOrders, href: "/admin/orders", icon: "✅", tone: "text-emerald-400" },
    { label: "Customers", value: stats?.userCount, href: "/admin/orders", icon: "👥", tone: "text-neon-rose" },
    { label: "Revenue", value: stats ? formatPrice(stats.revenue) : undefined, href: "/admin/orders", icon: "💰", tone: "text-neon-coral" },
    { label: "Low stock (≤5)", value: stats?.lowStock, href: "/admin/products", icon: "⚠️", tone: "text-amber-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-white/50">Store overview and recent activity.</p>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="glass card-hover rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className={`text-xl font-bold ${c.tone}`}>{c.value ?? "—"}</span>
              <span className="text-2xl" aria-hidden>{c.icon}</span>
            </div>
            <p className="mt-2 text-xs text-white/50">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">Recent orders</h2>
          <Link href="/admin/orders" className="text-xs text-neon-amber hover:text-white">
            View all →
          </Link>
        </div>
        <div className="glass mt-4 overflow-hidden rounded-2xl">
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-white/40">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recent.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {o.email}
                      <span className="ml-2 text-xs text-white/40">#{o.id.slice(-8)}</span>
                    </p>
                    <p className="text-xs text-white/40">
                      {o.items} item{o.items === 1 ? "" : "s"} · {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{formatPrice(o.amount)}</span>
                    <span
                      className={`badge ${
                        o.status === "paid"
                          ? "!border-emerald-400/40 !text-emerald-300"
                          : o.status === "cancelled"
                          ? "!border-red-400/40 !text-red-300"
                          : "!border-amber-400/40 !text-amber-300"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
