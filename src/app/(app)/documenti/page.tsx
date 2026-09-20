import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getRealityOptions, getTransactionOptions } from "@/lib/data/lookups";
import { createDocument } from "@/lib/actions/documents";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass, selectClass } from "@/lib/ui";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function DocumentiPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const [realities, transactions, { data: documents }] = await Promise.all([
    getRealityOptions(supabase, company.id),
    getTransactionOptions(supabase, company.id),
    supabase
      .from("documents")
      .select("*, realities(name), property_transactions(name)")
      .eq("company_id", company.id)
      .order("uploaded_at", { ascending: false }),
  ]);

  return (
    <div>
      <PageHeader
        title="Documenti"
        description="Registro dei documenti collegati a realtà e operazioni. Carica il file nel tuo cloud preferito e incolla qui il link."
      />

      <Card className="mb-6 p-4">
        <form action={createDocument} className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:items-end">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nome documento</label>
            <input name="name" required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Link / percorso file</label>
            <input name="file_path" required className={inputClass} placeholder="https://…" />
          </div>
          <div>
            <label className={labelClass}>Categoria</label>
            <input name="category" className={inputClass} placeholder="Contratto, fattura…" />
          </div>
          <div>
            <label className={labelClass}>Realtà</label>
            <select name="reality_id" className={selectClass} defaultValue="">
              <option value="">Nessuna / azienda</option>
              {realities.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-6 flex justify-end">
            <SubmitButton>Aggiungi documento</SubmitButton>
          </div>
        </form>
      </Card>

      {!documents || documents.length === 0 ? (
        <EmptyState title="Nessun documento ancora" />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Nome</th>
                <th className={thClass}>Categoria</th>
                <th className={thClass}>Realtà / Operazione</th>
                <th className={thClass}>Caricato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {documents.map((d) => (
                <tr key={d.id}>
                  <td className={tdClass}>
                    <a href={d.file_path} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">
                      {d.name}
                    </a>
                  </td>
                  <td className={tdClass}>{d.category ?? "—"}</td>
                  <td className={tdClass}>{d.realities?.name ?? d.property_transactions?.name ?? "—"}</td>
                  <td className={tdClass}>{formatDate(d.uploaded_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
