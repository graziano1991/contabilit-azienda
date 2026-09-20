import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getRealityOptions } from "@/lib/data/lookups";
import { createDueDate } from "@/lib/actions/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass, selectClass } from "@/lib/ui";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function ScadenzePage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const [realities, { data: dueDates }] = await Promise.all([
    getRealityOptions(supabase, company.id),
    supabase
      .from("due_dates")
      .select("*, realities(name)")
      .eq("company_id", company.id)
      .order("due_date", { ascending: true }),
  ]);

  return (
    <div>
      <PageHeader title="Scadenze" description="Ciò che devi incassare o pagare, con relativa data di scadenza." />

      <Card className="mb-6 p-4">
        <form action={createDueDate} className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:items-end">
          <div className="sm:col-span-2">
            <label className={labelClass}>Descrizione</label>
            <input name="description" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Scadenza</label>
            <input type="date" name="due_date" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Importo (€)</label>
            <input name="amount" type="number" step="0.01" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tipo</label>
            <select name="type" className={selectClass} defaultValue="da_pagare">
              <option value="da_incassare">Da incassare</option>
              <option value="da_pagare">Da pagare</option>
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
            <SubmitButton>Aggiungi scadenza</SubmitButton>
          </div>
        </form>
      </Card>

      {!dueDates || dueDates.length === 0 ? (
        <EmptyState title="Nessuna scadenza ancora" />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Scadenza</th>
                <th className={thClass}>Descrizione</th>
                <th className={thClass}>Realtà</th>
                <th className={thClass}>Tipo</th>
                <th className={thClass}>Importo</th>
                <th className={thClass}>Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {dueDates.map((d) => (
                <tr key={d.id}>
                  <td className={tdClass}>{formatDate(d.due_date)}</td>
                  <td className={tdClass}>{d.description}</td>
                  <td className={tdClass}>{d.realities?.name ?? "—"}</td>
                  <td className={tdClass}>
                    <Badge tone={d.type === "da_incassare" ? "success" : "danger"}>{d.type}</Badge>
                  </td>
                  <td className={tdClass}>{formatCurrency(d.amount)}</td>
                  <td className={tdClass}>
                    <Badge tone={d.status === "saldata" ? "success" : d.status === "scaduta" ? "danger" : "warning"}>
                      {d.status}
                    </Badge>
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
