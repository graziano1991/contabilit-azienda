import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatCurrency } from "@/lib/format";
import { KpiCard } from "@/components/ui/kpi-card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { RealityCard } from "@/components/reality-card";
import { TransactionCard } from "@/components/transaction-card";
import type { RealityType } from "@/lib/reality-types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const data = await getDashboardData(supabase, company.id);
  const hasRealities = data.realities.length + data.transactions.length > 0;

  return (
    <div>
      {/* Banner "control center": prima impressione della dashboard, con
          l'utile netto in evidenza a caratteri grandi e sfumatura premium
          invece di partire subito con la griglia di numeri. */}
      <div className="glass-panel relative mb-7 overflow-hidden rounded-3xl p-6 shadow-ambient animate-fade-in-up sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent-500/15 blur-3xl" />
        <p className="relative text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {company.name}
        </p>
        <p className="relative mt-2 text-3xl font-semibold tracking-tight text-gradient-brand sm:text-4xl">
          {formatCurrency(data.totalProfit)}
        </p>
        <p className="relative mt-1 text-sm text-neutral-500">
          Utile complessivo su tutte le realtà e operazioni
        </p>
      </div>

      <PageHeader
        title="Panoramica aziendale"
        description={company.name}
      />

      <div className="stagger-children grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Ricavi totali" value={formatCurrency(data.totalRevenue)} tone="revenue" />
        <KpiCard label="Costi totali" value={formatCurrency(data.totalCost)} tone="cost" />
        <KpiCard label="Utile" value={formatCurrency(data.totalProfit)} tone="profit" />
        <KpiCard label="Cash" value={formatCurrency(data.cash)} />
        <KpiCard label="Crediti" value={formatCurrency(data.receivables)} tone="revenue" />
        <KpiCard label="Debiti" value={formatCurrency(data.payables)} tone="cost" />
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Le tue realtà
        </h3>

        {!hasRealities ? (
          <EmptyState
            title="Non hai ancora nessuna realtà"
            description="Aggiungi il tuo primo affitto breve, appartamento, hotel o operazione di compravendita per iniziare a vedere i numeri qui."
          />
        ) : (
          <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.realities.map((r) => (
              <RealityCard
                key={r.reality_id}
                id={r.reality_id}
                name={r.name}
                type={r.type as RealityType}
                revenue={r.total_revenue}
                cost={r.total_cost}
                profit={r.profit}
              />
            ))}
            {data.transactions.map((t) => (
              <TransactionCard
                key={t.transaction_id}
                id={t.transaction_id}
                name={t.name}
                status={t.status}
                investment={t.total_investment}
                saleRevenue={t.total_sale_revenue}
                profit={t.gross_profit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
