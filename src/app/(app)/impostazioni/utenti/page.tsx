import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass } from "@/lib/ui";

const ROLE_LABEL: Record<string, string> = {
  admin: "Amministratore",
  editor: "Operativo",
  viewer: "Sola lettura",
};

const ROLE_TONE: Record<string, "info" | "default" | "success"> = {
  admin: "info",
  editor: "default",
  viewer: "success",
};

export default async function UtentiPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const { data: members } = await supabase
    .from("company_users")
    .select("id, email, role, created_at")
    .eq("company_id", company.id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Utenti"
        description="Tutte le persone registrate ed entrate in FinanzaCore."
      />

      {!members || members.length === 0 ? (
        <EmptyState title="Nessun utente ancora" />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Email</th>
                <th className={thClass}>Ruolo</th>
                <th className={thClass}>Iscritto il</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className={tdClass}>{m.email ?? "—"}</td>
                  <td className={tdClass}>
                    <Badge tone={ROLE_TONE[m.role] ?? "default"}>
                      {ROLE_LABEL[m.role] ?? m.role}
                    </Badge>
                  </td>
                  <td className={tdClass}>{formatDate(m.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
