"use client";

import { motion } from "framer-motion";

/**
 * Fixed, animated neon background: glowing orbs drifting slowly plus a faint
 * cyber-grid. Rendered once behind all content.
 */
export function NeonBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-void-950">
      {/* Base grid */}
      <div className="absolute inset-0 bg-grid-lines bg-[size:48px_48px] opacity-60" />
      {/* Radial vignette — warm brown, not black */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(28,18,10,0.75)_100%)]" />

      {/* Drifting orbs — sunset, brighter so warm tones dominate */}
      <motion.div
        className="neon-orb h-[38rem] w-[38rem] bg-neon-orange/35 top-[-8rem] left-[-6rem]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="neon-orb h-[32rem] w-[32rem] bg-neon-rose/30 bottom-[-6rem] right-[-8rem]"
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="neon-orb h-[26rem] w-[26rem] bg-neon-amber/30 top-1/3 right-1/4"
        animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="neon-orb h-[24rem] w-[24rem] bg-neon-coral/30 bottom-1/4 left-1/5"
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
