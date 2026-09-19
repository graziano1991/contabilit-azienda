import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureCompanyForUser } from "@/lib/data/ensure-company";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // App privata mono-azienda: chi si registra entra automaticamente
  // nell'azienda tramite la funzione database join_default_company.
  const company = await ensureCompanyForUser(supabase);

  if (!company) {
    // Niente redirect verso /login: l'utente è già autenticato, un
    // redirect qui rimbalzerebbe all'infinito tra /login e questa pagina.
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-card">
          <p className="text-sm font-medium text-neutral-900">
            Non è stato possibile collegarti all&apos;azienda.
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Riprova tra qualche secondo. Se il problema continua, contatta
            l&apos;amministratore.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50">
      <Sidebar companyName={company.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userEmail={user.email ?? ""} />
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
