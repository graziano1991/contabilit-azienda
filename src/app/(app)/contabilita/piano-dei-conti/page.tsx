import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getAccountOptions } from "@/lib/data/lookups";
import { createAccount } from "@/lib/actions/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass, selectClass } from "@/lib/ui";
import { SubmitButton } from "@/components/ui/submit-button";

const TYPE_LABEL: Record<string, string> = {
  ricavo: "Ricavo",
  costo: "Costo",
  attivo: "Attivo",
  passivo: "Passivo",
  patrimonio_netto: "Patrimonio netto",
};

const TYPE_TONE: Record<string, "success" | "danger" | "info" | "default"> = {
  ricavo: "success",
  costo: "danger",
  attivo: "info",
  passivo: "default",
  patrimonio_netto: "default",
};

export default async function PianoDeiContiPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const accounts = await getAccountOptions(supabase, company.id);

  return (
    <div>
      <PageHeader
        title="Piano dei Conti"
        description="Le categorie usate per registrare ricavi e costi in Prima Nota e nelle Fatture."
      />

      <Card className="mb-6 p-4">
        <form action={createAccount} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
          <div>
            <label className={labelClass}>Codice</label>
            <input name="code" className={inputClass} placeholder="Es. 4010" />
          </div>
          <div>
            <label className={labelClass}>Nome</label>
            <input name="name" required className={inputClass} placeholder="Es. Affitto breve - ricavi" />
          </div>
          <div>
            <label className={labelClass}>Tipo</label>
            <select name="account_type" className={selectClass} defaultValue="costo">
              {Object.entries(TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <SubmitButton>Aggiungi conto</SubmitButton>
        </form>
      </Card>

      {accounts.length === 0 ? (
        <EmptyState title="Nessun conto ancora" description="Crea le categorie di ricavo e costo che userai in tutta l'azienda." />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Codice</th>
                <th className={thClass}>Nome</th>
                <th className={thClass}>Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td className={tdClass}>{a.code ?? "—"}</td>
                  <td className={tdClass}>{a.name}</td>
                  <td className={tdClass}>
                    <Badge tone={TYPE_TONE[a.account_type] ?? "default"}>{TYPE_LABEL[a.account_type] ?? a.account_type}</Badge>
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
