import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getAccountingEntries } from "@/lib/data/accounting";
import { getRealityOptions, getAccountOptions, getTransactionOptions } from "@/lib/data/lookups";
import { createAccountingEntry } from "@/lib/actions/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RealityFilter } from "@/components/reality-filter";
import { formatCurrency, formatDate } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass, selectClass, primaryButtonClass } from "@/lib/ui";
import { EmptyState } from "@/components/ui/empty-state";

export default async function PrimaNotaPage({
  searchParams,
}: {
  searchParams: Promise<{ reality?: string }>;
}) {
  const { reality } = await searchParams;
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const [entries, realities, accounts, transactions] = await Promise.all([
    getAccountingEntries(supabase, company.id, reality),
    getRealityOptions(supabase, company.id),
    getAccountOptions(supabase, company.id),
    getTransactionOptions(supabase, company.id),
  ]);

  return (
    <div>
      <PageHeader
        title="Prima Nota"
        description="Tutti i movimenti economici dell'azienda, filtrabili per realtà."
      />

      <RealityFilter action="/contabilita/prima-nota" realities={realities} selected={reality} />

      <Card className="mb-6 p-4">
        <form action={createAccountingEntry} className="grid grid-cols-1 gap-3 sm:grid-cols-7 sm:items-end">
          <div>
            <label className={labelClass}>Data</label>
            <input type="date" name="entry_date" className={inputClass} defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Descrizione</label>
            <input name="description" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tipo</label>
            <select name="direction" className={selectClass} defaultValue="costo">
              <option value="ricavo">Ricavo</option>
              <option value="costo">Costo</option>
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
              {realities.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Conto</label>
            <select name="account_id" className={selectClass} defaultValue="">
              <option value="">—</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-7 flex justify-end">
            <button type="submit" className={primaryButtonClass}>Registra movimento</button>
          </div>
        </form>
      </Card>

      {entries.length === 0 ? (
        <EmptyState title="Nessun movimento registrato" description="Registra il primo movimento con il form qui sopra." />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Data</th>
                <th className={thClass}>Descrizione</th>
                <th className={thClass}>Realtà</th>
                <th className={thClass}>Conto</th>
                <th className={thClass}>Tipo</th>
                <th className={thClass}>Importo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className={tdClass}>{formatDate(e.entry_date)}</td>
                  <td className={tdClass}>{e.description}</td>
                  <td className={tdClass}>{e.realities?.name ?? e.property_transactions?.name ?? "—"}</td>
                  <td className={tdClass}>{e.chart_of_accounts?.name ?? "—"}</td>
                  <td className={tdClass}>
                    <Badge tone={e.direction === "ricavo" ? "success" : "danger"}>{e.direction}</Badge>
                  </td>
                  <td className={`${tdClass} ${e.direction === "ricavo" ? "text-revenue" : "text-cost"}`}>
                    {formatCurrency(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
