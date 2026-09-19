import type { SupabaseClient } from "@supabase/supabase-js";

export type CurrentCompany = {
  id: string;
  name: string;
  role: string;
  securityVerified: boolean;
};

/**
 * Ritorna la prima azienda a cui l'utente loggato è associato (uso privato
 * mono-azienda: se in futuro serviranno più aziende per utente, qui si
 * aggiungerà un selettore).
 */
export async function getCurrentCompany(
  supabase: SupabaseClient
): Promise<CurrentCompany | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("company_users")
    .select("role, security_verified, companies(id, name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error || !data || !data.companies) return null;

  const company = Array.isArray(data.companies) ? data.companies[0] : data.companies;

  return {
    id: company.id,
    name: company.name,
    role: data.role,
    securityVerified: data.security_verified ?? false,
  };
}
