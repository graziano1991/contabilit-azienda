import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getVatSummary } from "@/lib/data/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { formatCurrency } from "@/lib/format";

export default async function IvaPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const summary = await getVatSummary(supabase, company.id);

  return (
    <div>
      <PageHeader
        title="IVA"
        description="Riepilogo IVA calcolato automaticamente dalle fatture emesse e ricevute."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="IVA a debito (su vendite)" value={formatCurrency(summary.vatOnSales)} tone="cost" />
        <KpiCard label="IVA a credito (su acquisti)" value={formatCurrency(summary.vatOnPurchases)} tone="revenue" />
        <KpiCard
          label="Saldo IVA"
          value={formatCurrency(summary.vatBalance)}
          tone={summary.vatBalance >= 0 ? "cost" : "revenue"}
          hint={summary.vatBalance >= 0 ? "Da versare" : "A credito"}
        />
      </div>
    </div>
  );
}
