import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { createSupplier } from "@/lib/actions/accounting";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass, primaryButtonClass } from "@/lib/ui";

export default async function FornitoriPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("*")
    .eq("company_id", company.id)
    .order("name");

  return (
    <div>
      <PageHeader title="Fornitori" description="Anagrafica fornitori dell'azienda." />

      <Card className="mb-6 p-4">
        <form action={createSupplier} className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end">
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
            <button type="submit" className={primaryButtonClass}>Aggiungi fornitore</button>
          </div>
        </form>
      </Card>

      {!suppliers || suppliers.length === 0 ? (
        <EmptyState title="Nessun fornitore ancora" />
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
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td className={tdClass}>{s.name}</td>
                  <td className={tdClass}>{s.vat_number ?? "—"}</td>
                  <td className={tdClass}>{s.email ?? "—"}</td>
                  <td className={tdClass}>{s.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
