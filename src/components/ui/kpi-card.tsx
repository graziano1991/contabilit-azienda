import clsx from "clsx";
import { TrendingUp, TrendingDown, Scale, Wallet } from "lucide-react";

const BAR_CLASSES: Record<string, string> = {
  neutral: "from-brand-300 to-brand-500",
  revenue: "from-accent-400 to-accent-600",
  cost: "from-red-300 to-red-500",
  profit: "from-brand-500 to-accent-500",
};

const ICON_BY_TONE = {
  neutral: Wallet,
  revenue: TrendingUp,
  cost: TrendingDown,
  profit: Scale,
} as const;

const ICON_CLASSES: Record<string, string> = {
  neutral: "bg-brand-50 text-brand-600",
  revenue: "bg-accent-50 text-revenue",
  cost: "bg-red-50 text-cost",
  profit: "bg-gradient-to-br from-brand-50 to-accent-50 text-brand-700",
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

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-ambient transition-all duration-200 ease-snappy animate-fade-in-up hover:-translate-y-1 hover:shadow-card-hover">
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
          tone === "profit" && "text-brand-700",
          tone === "neutral" && "text-neutral-900"
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}
