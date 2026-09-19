import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getTransactions } from "@/lib/data/transactions";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TransactionCard } from "@/components/transaction-card";

export default async function VenditePage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const all = await getTransactions(supabase, company.id);
  const items = all.filter((t) => ["venduto", "chiusa"].includes(t.status));

  return (
    <div>
      <PageHeader
        title="Vendite"
        description="Operazioni concluse: immobili venduti e operazioni chiuse."
      />
      {items.length === 0 ? (
        <EmptyState title="Nessuna vendita conclusa ancora" />
      ) : (
        <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((t) => (
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
  );
}
