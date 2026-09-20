import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { createCustomer } from "@/lib/actions/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass } from "@/lib/ui";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function ClientiPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("company_id", company.id)
    .order("name");

  return (
    <div>
      <PageHeader title="Clienti" description="Anagrafica clienti dell'azienda." />

      <Card className="mb-6 p-4">
        <form action={createCustomer} className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nome</label>
            <input name="name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>P.IVA</label>
            <input name="vat_number" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input name="email" type="email" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telefono</label>
            <input name="phone" className={inputClass} />
          </div>
          <div className="sm:col-span-5 flex justify-end">
            <SubmitButton>Aggiungi cliente</SubmitButton>
          </div>
        </form>
      </Card>

      {!customers || customers.length === 0 ? (
        <EmptyState title="Nessun cliente ancora" />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Nome</th>
                <th className={thClass}>P.IVA</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Telefono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className={tdClass}>{c.name}</td>
                  <td className={tdClass}>{c.vat_number ?? "—"}</td>
                  <td className={tdClass}>{c.email ?? "—"}</td>
                  <td className={tdClass}>{c.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
