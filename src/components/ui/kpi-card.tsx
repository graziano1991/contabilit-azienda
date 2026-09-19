import clsx from "clsx";

const BAR_CLASSES: Record<string, string> = {
  neutral: "from-brand-300 to-brand-500",
  revenue: "from-accent-400 to-accent-600",
  cost: "from-red-300 to-red-500",
  profit: "from-brand-500 to-accent-500",
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
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <span
        className={clsx(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80 transition-opacity duration-200 group-hover:opacity-100",
          BAR_CLASSES[tone] ?? BAR_CLASSES.neutral
        )}
      />
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p
        className={clsx(
          "mt-2 text-2xl font-semibold tabular-nums",
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
