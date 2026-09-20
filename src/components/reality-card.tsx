import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { REALITY_TYPE_LABEL, REALITY_TYPE_ICON, type RealityType } from "@/lib/reality-types";

export function RealityCard({
  id,
  name,
  type,
  revenue,
  cost,
  profit,
}: {
  id: string;
  name: string;
  type: RealityType;
  revenue: number;
  cost: number;
  profit: number;
}) {
  const Icon = REALITY_TYPE_ICON[type];

  return (
    <Link
      href={`/realta/${id}`}
      className="glass-panel group flex animate-fade-in-up flex-col rounded-2xl p-4 shadow-ambient transition-all duration-300 ease-snappy hover:-translate-y-1 hover:border-white/20 hover:shadow-card-hover active:scale-[0.98]"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-700 shadow-glow transition-transform duration-200 group-hover:scale-110">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-500">{REALITY_TYPE_LABEL[type]}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-neutral-400">Ricavi</p>
          <p className="text-sm font-medium text-revenue">{formatCurrency(revenue)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-neutral-400">Costi</p>
          <p className="text-sm font-medium text-cost">{formatCurrency(cost)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-neutral-400">Utile</p>
          <p className="text-sm font-medium text-brand-700">{formatCurrency(profit)}</p>
        </div>
      </div>
    </Link>
  );
}
