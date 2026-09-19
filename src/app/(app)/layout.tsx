import { redirect } from "next/navigation";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { ensureCompanyForUser } from "@/lib/data/ensure-company";
import { AppShell } from "@/components/app-shell";
import { SecurityGate } from "@/components/security-gate";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = await getAuthUser();

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

  // Verifica di sicurezza obbligatoria, controllata lato server: nessuna
  // pagina dell'app (dashboard compresa) viene renderizzata finché l'utente
  // non ha inserito la password di sicurezza corretta. Non è aggirabile
  // modificando il frontend perché il controllo avviene qui, prima che
  // "children" venga anche solo montato.
  if (!company.securityVerified) {
    return <SecurityGate />;
  }

  return (
    <AppShell companyName={company.name} userEmail={user.email ?? ""}>
      {children}
    </AppShell>
  );
}
