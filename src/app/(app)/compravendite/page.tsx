import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getTransactionsSummary } from "@/lib/data/transactions";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { EmptyState } from "@/components/ui/empty-state";
import { TransactionCard } from "@/components/transaction-card";
import { primaryButtonClass } from "@/lib/ui";
import { formatCurrency, formatPercent } from "@/lib/format";

export default async function CompravenditePage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const summary = await getTransactionsSummary(supabase, company.id);

  return (
    <div>
      <PageHeader
        title="Compravendite"
        description="Operazioni di acquisto, ristrutturazione, valorizzazione e vendita — separate dagli immobili a reddito."
        action={
          <Link href="/compravendite/nuova" className={primaryButtonClass}>
            <Plus className="h-4 w-4" />
            Nuova compravendita
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Operazioni attive" value={String(summary.activeCount)} />
        <KpiCard label="Operazioni concluse" value={String(summary.closedCount)} />
        <KpiCard label="Capitale investito" value={formatCurrency(summary.totalInvested)} />
        <KpiCard label="Ricavi da vendite" value={formatCurrency(summary.totalSaleRevenue)} tone="revenue" />
        <KpiCard label="Utili" value={formatCurrency(summary.totalProfit)} tone="profit" />
        <KpiCard label="ROI medio" value={formatPercent(summary.avgRoi)} />
      </div>

      <div className="mt-8">
        {summary.list.length === 0 ? (
          <EmptyState
            title="Nessuna operazione ancora"
            description="Crea la tua prima operazione di compravendita per iniziare a monitorare investimento, costi e utile."
            action={
              <Link href="/compravendite/nuova" className={primaryButtonClass}>
                <Plus className="h-4 w-4" />
                Nuova compravendita
              </Link>
            }
          />
        ) : (
          <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {summary.list.map((t) => (
              <TransactionCard
                key={t.id}
                id={t.id}
                name={t.name}
                status={t.status}
                investment={t.investment}
                saleRevenue={t.saleRevenue}
                profit={t.profit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
