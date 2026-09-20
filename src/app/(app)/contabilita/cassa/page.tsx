import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getRealityOptions } from "@/lib/data/lookups";
import { createCashTransaction } from "@/lib/actions/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass, selectClass } from "@/lib/ui";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function CassaPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const [realities, { data: transactions }] = await Promise.all([
    getRealityOptions(supabase, company.id),
    supabase
      .from("cash_transactions")
      .select("*, realities(name)")
      .eq("company_id", company.id)
      .order("tx_date", { ascending: false }),
  ]);

  const balance = (transactions ?? []).reduce(
    (sum, t) => sum + (t.direction === "entrata" ? Number(t.amount) : -Number(t.amount)),
    0
  );

  return (
    <div>
      <PageHeader title="Cassa" description="Movimenti di cassa dell'azienda." />

      <div className="mb-6">
        <KpiCard label="Saldo cassa" value={formatCurrency(balance)} />
      </div>

      <Card className="mb-6 p-4">
        <form action={createCashTransaction} className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:items-end">
          <div>
            <label className={labelClass}>Data</label>
            <input type="date" name="tx_date" className={inputClass} defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Descrizione</label>
            <input name="description" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Direzione</label>
            <select name="direction" className={selectClass} defaultValue="uscita">
              <option value="entrata">Entrata</option>
              <option value="uscita">Uscita</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Importo (€)</label>
            <input name="amount" type="number" step="0.01" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Realtà</label>
            <select name="reality_id" className={selectClass} defaultValue="">
              <option value="">Nessuna / azienda</option>
              {realities.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-6 flex justify-end">
            <SubmitButton>Registra movimento</SubmitButton>
          </div>
        </form>
      </Card>

      {!transactions || transactions.length === 0 ? (
        <EmptyState title="Nessun movimento di cassa ancora" />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Data</th>
                <th className={thClass}>Descrizione</th>
                <th className={thClass}>Realtà</th>
                <th className={thClass}>Direzione</th>
                <th className={thClass}>Importo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className={tdClass}>{formatDate(t.tx_date)}</td>
                  <td className={tdClass}>{t.description}</td>
                  <td className={tdClass}>{t.realities?.name ?? "—"}</td>
                  <td className={tdClass}>
                    <Badge tone={t.direction === "entrata" ? "success" : "danger"}>{t.direction}</Badge>
                  </td>
                  <td className={tdClass}>{formatCurrency(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
