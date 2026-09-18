import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getRealityOptions, getBankAccountOptions } from "@/lib/data/lookups";
import { createPayment } from "@/lib/actions/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RealityFilter } from "@/components/reality-filter";
import { formatCurrency, formatDate } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass, selectClass, primaryButtonClass } from "@/lib/ui";

export default async function PagamentiPage({
  searchParams,
}: {
  searchParams: Promise<{ reality?: string }>;
}) {
  const { reality } = await searchParams;
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const [realities, bankAccounts] = await Promise.all([
    getRealityOptions(supabase, company.id),
    getBankAccountOptions(supabase, company.id),
  ]);

  let query = supabase
    .from("payments")
    .select("*, realities(name)")
    .eq("company_id", company.id)
    .order("pay_date", { ascending: false });
  if (reality) query = query.eq("reality_id", reality);
  const { data: payments } = await query;

  return (
    <div>
      <PageHeader title="Pagamenti" description="Incassi e pagamenti effettuati o pianificati." />

      <RealityFilter action="/contabilita/pagamenti" realities={realities} selected={reality} />

      <Card className="mb-6 p-4">
        <form action={createPayment} className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:items-end">
          <div>
            <label className={labelClass}>Direzione</label>
            <select name="direction" className={selectClass} defaultValue="incasso">
              <option value="incasso">Incasso</option>
              <option value="pagamento">Pagamento</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Data</label>
            <input type="date" name="pay_date" className={inputClass} defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
          <div>
            <label className={labelClass}>Importo (€)</label>
            <input name="amount" type="number" step="0.01" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Metodo</label>
            <select name="method" className={selectClass} defaultValue="bonifico">
              <option value="bonifico">Bonifico</option>
              <option value="contanti">Contanti</option>
              <option value="carta">Carta</option>
              <option value="assegno">Assegno</option>
              <option value="altro">Altro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Conto bancario</label>
            <select name="bank_account_id" className={selectClass} defaultValue="">
              <option value="">—</option>
              {bankAccounts.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Realtà</label>
            <select name="reality_id" className={selectClass} defaultValue="">
              <option value="">Nessuna / azienda</option>
              {realities.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-6 flex justify-end">
            <button type="submit" className={primaryButtonClass}>Registra pagamento</button>
          </div>
        </form>
      </Card>

      {!payments || payments.length === 0 ? (
        <EmptyState title="Nessun pagamento ancora" />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Data</th>
                <th className={thClass}>Direzione</th>
                <th className={thClass}>Realtà</th>
                <th className={thClass}>Metodo</th>
                <th className={thClass}>Importo</th>
                <th className={thClass}>Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className={tdClass}>{formatDate(p.pay_date)}</td>
                  <td className={tdClass}>
                    <Badge tone={p.direction === "incasso" ? "success" : "danger"}>{p.direction}</Badge>
                  </td>
                  <td className={tdClass}>{p.realities?.name ?? "—"}</td>
                  <td className={tdClass}>{p.method ?? "—"}</td>
                  <td className={tdClass}>{formatCurrency(p.amount)}</td>
                  <td className={tdClass}>
                    <Badge tone={p.status === "completato" ? "success" : "default"}>{p.status}</Badge>
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
