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
  // nell'azienda (creata al volo se non esiste ancora), nessuno step
  // separato di "crea azienda".
  const company = await ensureCompanyForUser(supabase);

  if (!company) {
    redirect("/login");
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
