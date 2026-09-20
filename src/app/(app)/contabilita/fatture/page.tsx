import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getRealityOptions, getCustomerOptions, getSupplierOptions } from "@/lib/data/lookups";
import { createInvoice } from "@/lib/actions/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RealityFilter } from "@/components/reality-filter";
import { formatCurrency, formatDate } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass, selectClass } from "@/lib/ui";
import { SubmitButton } from "@/components/ui/submit-button";

const STATUS_TONE: Record<string, "success" | "danger" | "warning" | "default"> = {
  incassata: "success",
  pagata: "success",
  da_incassare: "warning",
  da_pagare: "warning",
  scaduta: "danger",
  annullata: "default",
};

export default async function FatturePage({
  searchParams,
}: {
  searchParams: Promise<{ reality?: string }>;
}) {
  const { reality } = await searchParams;
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const [realities, customers, suppliers] = await Promise.all([
    getRealityOptions(supabase, company.id),
    getCustomerOptions(supabase, company.id),
    getSupplierOptions(supabase, company.id),
  ]);

  let query = supabase
    .from("invoices")
    .select("*, realities(name), customers(name), suppliers(name)")
    .eq("company_id", company.id)
    .order("issue_date", { ascending: false });
  if (reality) query = query.eq("reality_id", reality);
  const { data: invoices } = await query;

  return (
    <div>
      <PageHeader title="Fatture" description="Fatture emesse e ricevute, collegabili a una realtà o operazione." />

      <RealityFilter action="/contabilita/fatture" realities={realities} selected={reality} />

      <Card className="mb-6 p-4">
        <form action={createInvoice} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
          <div>
            <label className={labelClass}>Direzione</label>
            <select name="direction" className={selectClass} defaultValue="emessa">
              <option value="emessa">Emessa (a cliente)</option>
              <option value="ricevuta">Ricevuta (da fornitore)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Numero</label>
            <input name="number" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Data emissione</label>
            <input type="date" name="issue_date" className={inputClass} defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
          <div>
            <label className={labelClass}>Scadenza</label>
            <input type="date" name="due_date" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cliente</label>
            <select name="customer_id" className={selectClass} defaultValue="">
              <option value="">—</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Fornitore</label>
            <select name="supplier_id" className={selectClass} defaultValue="">
              <option value="">—</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Realtà</label>
            <select name="reality_id" className={selectClass} defaultValue="">
              <option value="">Nessuna / azienda</option>
              {realities.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Categoria</label>
            <input name="category" className={inputClass} placeholder="Es. Affitto breve" />
          </div>
          <div>
            <label className={labelClass}>Imponibile (€)</label>
            <input name="taxable_amount" type="number" step="0.01" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>IVA (%)</label>
            <input name="vat_rate" type="number" step="0.1" defaultValue={22} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Stato</label>
            <select name="status" className={selectClass} defaultValue="da_incassare">
              <option value="da_incassare">Da incassare</option>
              <option value="da_pagare">Da pagare</option>
              <option value="incassata">Incassata</option>
              <option value="pagata">Pagata</option>
              <option value="scaduta">Scaduta</option>
              <option value="annullata">Annullata</option>
            </select>
          </div>
          <div className="sm:col-span-4 flex justify-end">
            <SubmitButton>Crea fattura</SubmitButton>
          </div>
        </form>
      </Card>

      {!invoices || invoices.length === 0 ? (
        <EmptyState title="Nessuna fattura ancora" />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Numero</th>
                <th className={thClass}>Data</th>
                <th className={thClass}>Cliente/Fornitore</th>
                <th className={thClass}>Realtà</th>
                <th className={thClass}>Imponibile</th>
                <th className={thClass}>Totale</th>
                <th className={thClass}>Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className={tdClass}>{inv.number ?? "—"}</td>
                  <td className={tdClass}>{formatDate(inv.issue_date)}</td>
                  <td className={tdClass}>{inv.customers?.name ?? inv.suppliers?.name ?? "—"}</td>
                  <td className={tdClass}>{inv.realities?.name ?? "—"}</td>
                  <td className={tdClass}>{formatCurrency(inv.taxable_amount)}</td>
                  <td className={tdClass}>{formatCurrency(inv.total_amount)}</td>
                  <td className={tdClass}>
                    <Badge tone={STATUS_TONE[inv.status] ?? "default"}>{inv.status}</Badge>
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
