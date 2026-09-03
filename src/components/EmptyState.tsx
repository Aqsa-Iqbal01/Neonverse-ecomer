"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref = "/shop" }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl p-10 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-orange/20 to-neon-amber/20 text-neon-amber shadow-neon-inset">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v2" />
          <path d="M12 19v2" />
          <path d="M3 12h2" />
          <path d="M19 12h2" />
          <path d="M5.6 5.6l1.4 1.4" />
          <path d="M17 17l1.4 1.4" />
          <path d="M5.6 18.4l1.4-1.4" />
          <path d="M17 7l1.4-1.4" />
        </svg>
      </span>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/50">{description}</p>
      </div>
      {actionLabel && (
        <Link href={actionHref} className="btn-neon">
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
