"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

type AdminOrder = {
  id: string;
  email: string;
  customer: string | null;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string | null;
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed");
        const data = await res.json();
        setOrders(data.orders ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders.");
      }
    })();
  }, []);

  const statusTone: Record<string, string> = {
    paid: "!border-emerald-400/40 !text-emerald-300",
    pending: "!border-amber-400/40 !text-amber-300",
    cancelled: "!border-red-400/40 !text-red-300",
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Orders</h1>
      <p className="mt-1 text-sm text-white/50">{orders.length} total orders</p>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-sm text-white/40">
            No orders yet. Completed Stripe checkouts will appear here.
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    #{o.id.slice(-8)}
                    {o.customer ? ` · ${o.customer}` : ""}
                  </p>
                  <p className="text-xs text-white/40">{o.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40">
                    {new Date(o.createdAt).toLocaleDateString()}{" "}
                    {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className={`badge ${statusTone[o.status] ?? ""}`}>{o.status}</span>
                  <span className="text-sm font-bold text-white">{formatPrice(o.amount)}</span>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
                {o.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-xs text-white/50">
                    <span>
                      {item.productName} <span className="text-white/30">× {item.quantity}</span>
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
