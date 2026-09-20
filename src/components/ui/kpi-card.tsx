"use client";

import { useRef } from "react";
import clsx from "clsx";
import { TrendingUp, TrendingDown, Scale, Wallet } from "lucide-react";

const BAR_CLASSES: Record<string, string> = {
  neutral: "from-brand-500 to-accent-600",
  revenue: "from-emerald-400 to-emerald-600",
  cost: "from-rose-400 to-rose-600",
  profit: "from-brand-500 via-glow-500 to-accent-500",
};

const ICON_BY_TONE = {
  neutral: Wallet,
  revenue: TrendingUp,
  cost: TrendingDown,
  profit: Scale,
} as const;

// Chip dell'icona: sfondo del colore a bassa opacità + glow coerente,
// invece dei vecchi chip pastello (bg-brand-50 ecc.) che su uno sfondo
// scuro sarebbero risultati rettangoli chiari fuori posto.
const ICON_CLASSES: Record<string, string> = {
  neutral: "bg-brand-500/15 text-brand-700 shadow-glow",
  revenue: "bg-emerald-500/15 text-emerald-300 shadow-glow-emerald",
  cost: "bg-rose-500/15 text-cost shadow-glow-rose",
  profit: "bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-brand-700 shadow-glow",
};

export function KpiCard({
  label,
  value,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "revenue" | "cost" | "profit";
  hint?: string;
}) {
  const Icon = ICON_BY_TONE[tone] ?? ICON_BY_TONE.neutral;
  const ref = useRef<HTMLDivElement>(null);

  // Glow che segue il cursore: sola CSS custom property aggiornata via
  // ref (niente useState/re-render), radial-gradient in un layer separato
  // che si accende in opacità all'hover — costa quanto una transizione di
  // opacity, nessun calcolo pesante ad ogni frame.
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--glow-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="glass-panel group relative overflow-hidden rounded-2xl p-4 shadow-ambient transition-all duration-300 ease-snappy animate-fade-in-up hover:-translate-y-1 hover:border-white/20 hover:shadow-card-hover"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(217,70,239,0.12), transparent 70%)",
        }}
      />
      <span
        className={clsx(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80 transition-opacity duration-200 group-hover:opacity-100",
          BAR_CLASSES[tone] ?? BAR_CLASSES.neutral
        )}
      />
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {label}
        </p>
        <div
          className={clsx(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110",
            ICON_CLASSES[tone] ?? ICON_CLASSES.neutral
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p
        className={clsx(
          "mt-2 text-2xl font-semibold tracking-tight tabular-nums",
          tone === "revenue" && "text-revenue",
          tone === "cost" && "text-cost",
          tone === "profit" && "text-gradient-brand",
          tone === "neutral" && "text-neutral-900"
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}
