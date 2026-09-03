export function SetupNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl border-l-4 border-l-neon-orange p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neon-orange/15 text-neon-orange">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </span>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-white">Almost ready — one configuration step left</p>
          <div className="text-white/60">{children}</div>
        </div>
      </div>
    </div>
  );
}
