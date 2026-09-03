"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load settings.");
        const data = await res.json();
        const s = data.settings as SiteSettings;
        setSettings(s);
        setSiteName(s.siteName);
        setTagline(s.tagline);
        setLogoUrl(s.logoUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings.");
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!siteName.trim()) return setError("Site name is required.");

    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: siteName.trim(),
          tagline: tagline.trim(),
          logoUrl: logoUrl.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      setSettings(data.settings);
      setSaved(true);
      // Let the navbar pick it up.
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (!settings && !error) {
    return <p className="text-sm text-white/40">Loading settings…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Store settings</h1>
      <p className="mt-1 text-sm text-white/50">
        Change the site name, tagline, and logo — no code required.
      </p>

      <form onSubmit={handleSubmit} className="glass mt-6 max-w-xl rounded-2xl p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="siteName" className="mb-1.5 block text-xs text-white/50">
              Site name
            </label>
            <input
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="input-neon"
              placeholder="NEONVERSE"
            />
            <p className="mt-1 text-xs text-white/40">Shown in the navbar and footer.</p>
          </div>

          <div>
            <label htmlFor="tagline" className="mb-1.5 block text-xs text-white/50">
              Tagline
            </label>
            <input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="input-neon"
              placeholder="Future-Proof Electronics"
            />
          </div>

          <div>
            <label htmlFor="logoUrl" className="mb-1.5 block text-xs text-white/50">
              Logo image URL <span className="text-white/30">(optional)</span>
            </label>
            <input
              id="logoUrl"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="input-neon"
              placeholder="https://… (leave empty to use the default diamond logo)"
            />
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-white/40">Current logo:</span>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="h-10 w-10 rounded-lg border border-white/10 object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.2")}
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neon-orange to-neon-amber">
                  <span className="h-3 w-3 rotate-45 bg-white/90" />
                </span>
              )}
            </div>
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {saved && (
            <div role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              ✓ Settings saved.
            </div>
          )}

          <button type="submit" disabled={saving} className="btn-neon">
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
