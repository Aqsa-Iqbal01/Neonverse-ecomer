import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm brown/amber background — no pure black
        void: {
          950: "#1c120a",
          900: "#261710",
          800: "#301d12",
          700: "#3d2616",
        },
        // Sunset neon palette — orange / amber / rose
        neon: {
          orange: "#fb923c",
          amber: "#fbbf24",
          yellow: "#fcd34d",
          rose: "#f43f5e",
          pink: "#f472b6",
          red: "#ef4444",
          coral: "#fb7185",
        },
      },
      boxShadow: {
        "neon-orange": "0 0 18px rgba(251,146,60,0.45), 0 0 55px rgba(244,63,94,0.22)",
        "neon-amber": "0 0 18px rgba(251,191,36,0.45), 0 0 55px rgba(251,146,60,0.22)",
        "neon-rose": "0 0 18px rgba(244,63,94,0.45), 0 0 55px rgba(251,146,60,0.22)",
        "neon-coral": "0 0 18px rgba(251,113,133,0.45), 0 0 55px rgba(251,146,60,0.22)",
        "neon-glow": "0 0 30px rgba(251,146,60,0.35), 0 0 80px rgba(244,63,94,0.18)",
        "neon-inset": "inset 0 0 22px rgba(251,191,36,0.18)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(to right, rgba(251,146,60,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(251,146,60,0.05) 1px, transparent 1px)",
        "hero-fade":
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(251,146,60,0.22), transparent 70%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 14s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
