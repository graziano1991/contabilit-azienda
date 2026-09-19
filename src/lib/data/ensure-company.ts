import type { SupabaseClient } from "@supabase/supabase-js";
import type { CurrentCompany } from "./company";

/**
 * App privata mono-azienda multi-utente: chi si registra viene collegato
 * automaticamente all'unica azienda condivisa tramite la funzione database
 * `join_default_company` (gira con privilegi elevati per bypassare in modo
 * controllato le policy RLS che altrimenti impedirebbero a un utente nuovo
 * di leggere o creare la propria azienda). Restituisce anche lo stato della
 * verifica di sicurezza (security_verified), controllato lato server dal
 * layout prima di mostrare qualunque pagina dell'app.
 */
export async function ensureCompanyForUser(
  supabase: SupabaseClient
): Promise<CurrentCompany | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .rpc("join_default_company", { user_email: user.email ?? "" })
    .single();

  if (error || !data) return null;

  const row = data as {
    id: string;
    name: string;
    role: string;
    security_verified: boolean;
  };

  return {
    id: row.id,
    name: row.name,
    role: row.role,
    securityVerified: row.security_verified,
  };
}
