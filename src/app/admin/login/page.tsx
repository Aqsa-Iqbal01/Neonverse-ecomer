"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user?.role === "admin") router.replace("/admin");
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-16">
      <div className="glass w-full rounded-2xl p-8">
        <div className="mb-6 text-center">
          <span className="text-3xl" aria-hidden>🔐</span>
          <h1 className="mt-2 font-display text-2xl font-bold text-white">Admin access</h1>
          <p className="mt-1 text-sm text-white/50">
            Sign in with an admin account to manage the store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-xs text-white/50">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="input-neon"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-xs text-white/50">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-neon"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-neon w-full">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Don’t have an admin account?{" "}
          <Link href="/signup" className="text-neon-amber hover:text-white">
            The first account is automatically an admin.
          </Link>
        </p>
      </div>
    </div>
  );
}
