import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getCategorySummaries, getRealitiesByType } from "@/lib/data/realities";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { RealityCard } from "@/components/reality-card";
import { primaryButtonClass } from "@/lib/ui";
import { formatCurrency } from "@/lib/format";
import { REALITY_TYPE_LABEL, REALITY_TYPE_ICON, REALITY_TYPE_PATH } from "@/lib/reality-types";
import type { RealityType } from "@/lib/reality-types";

export default async function ImmobiliPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const [summaries, affittiBrevi, appartamenti, hotel] = await Promise.all([
    getCategorySummaries(supabase, company.id),
    getRealitiesByType(supabase, company.id, "affitto_breve"),
    getRealitiesByType(supabase, company.id, "appartamento"),
    getRealitiesByType(supabase, company.id, "hotel"),
  ]);

  const allRealities = [...affittiBrevi, ...appartamenti, ...hotel];

  return (
    <div>
      <PageHeader
        title="Immobili"
        description="Tutte le realtà immobiliari dell'azienda, ognuna gestita separatamente."
        action={
          <Link href="/immobili/nuovo" className={primaryButtonClass}>
            <Plus className="h-4 w-4" />
            Aggiungi realtà
          </Link>
        }
      />

      <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaries.map((s) => {
          const Icon = REALITY_TYPE_ICON[s.type as RealityType];
          return (
            <Link
              key={s.type}
              href={`/immobili/${REALITY_TYPE_PATH[s.type as RealityType]}`}
              className="glass-panel group rounded-2xl p-5 shadow-ambient transition-all duration-300 ease-snappy hover:-translate-y-1 hover:border-white/20 hover:shadow-card-hover active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-700 shadow-glow transition-transform duration-200 group-hover:scale-110">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {REALITY_TYPE_LABEL[s.type as RealityType]}
                  </p>
                  <p className="text-xs text-neutral-500">{s.count} realtà</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-neutral-400">Ricavi</p>
                  <p className="text-sm font-medium text-revenue">{formatCurrency(s.revenue)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-neutral-400">Costi</p>
                  <p className="text-sm font-medium text-cost">{formatCurrency(s.cost)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-neutral-400">Utile</p>
                  <p className="text-sm font-medium text-brand-700">{formatCurrency(s.profit)}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Tutte le realtà
        </h3>
        {allRealities.length === 0 ? (
          <EmptyState
            title="Nessuna realtà ancora"
            description="Aggiungi il tuo primo affitto breve, appartamento o hotel."
            action={
              <Link href="/immobili/nuovo" className={primaryButtonClass}>
                <Plus className="h-4 w-4" />
                Aggiungi realtà
              </Link>
            }
          />
        ) : (
          <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allRealities.map((r) => (
              <RealityCard
                key={r.id}
                id={r.id}
                name={r.name}
                type={r.type}
                revenue={r.revenue}
                cost={r.cost}
                profit={r.profit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
