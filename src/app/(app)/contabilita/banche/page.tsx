import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { createBankAccount } from "@/lib/actions/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/format";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/ui";

export default async function BanchePage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const { data: accounts } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("company_id", company.id)
    .order("name");

  return (
    <div>
      <PageHeader title="Banche" description="I conti correnti dell'azienda." />

      <Card className="mb-6 p-4">
        <form action={createBankAccount} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
          <div>
            <label className={labelClass}>Nome conto</label>
            <input name="name" required className={inputClass} placeholder="Es. Conto operativo" />
          </div>
          <div>
            <label className={labelClass}>Banca</label>
            <input name="bank_name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>IBAN</label>
            <input name="iban" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Saldo iniziale (€)</label>
            <input name="opening_balance" type="number" step="0.01" className={inputClass} />
          </div>
          <div className="sm:col-span-4 flex justify-end">
            <button type="submit" className={primaryButtonClass}>Aggiungi conto</button>
          </div>
        </form>
      </Card>

      {!accounts || accounts.length === 0 ? (
        <EmptyState title="Nessun conto bancario ancora" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {accounts.map((a) => (
            <KpiCard key={a.id} label={`${a.name} · ${a.bank_name ?? ""}`} value={formatCurrency(a.opening_balance)} hint={a.iban ?? undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
