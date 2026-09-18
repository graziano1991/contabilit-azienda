import clsx from "clsx";

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
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-card">
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
