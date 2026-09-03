"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (next: number) => void;
  max?: number;
  ariaLabel?: string;
}

export function QuantitySelector({ value, onChange, max, ariaLabel }: QuantitySelectorProps) {
  const step = (dir: -1 | 1) => {
    const next = value + dir;
    if (next < 1) return;
    if (max !== undefined && next > max) return;
    onChange(next);
  };

  return (
    <div
      className="inline-flex items-center rounded-xl border border-white/15 bg-white/[0.03]"
      role="group"
      aria-label={ariaLabel ?? "Quantity"}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-neon-amber disabled:opacity-30"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-semibold text-white" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={max !== undefined && value >= max}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-neon-amber disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
