import type { SupabaseClient } from "@supabase/supabase-js";
import type { CurrentCompany } from "./company";

const DEFAULT_COMPANY_NAME = "La mia azienda";

/**
 * App privata mono-azienda multi-utente: non esiste più uno step "crea
 * azienda". Chi si registra ed entra viene automaticamente collegato
 * all'unica azienda esistente (o, se è la primissima persona di sempre a
 * registrarsi, l'azienda viene creata automaticamente con un nome di
 * default, rinominabile poi da Impostazioni).
 */
export async function ensureCompanyForUser(
  supabase: SupabaseClient
): Promise<CurrentCompany | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: existingMembership } = await supabase
    .from("company_users")
    .select("role, companies(id, name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existingMembership && existingMembership.companies) {
    const company = Array.isArray(existingMembership.companies)
      ? existingMembership.companies[0]
      : existingMembership.companies;
    return { id: company.id, name: company.name, role: existingMembership.role };
  }

  const { data: anyCompany } = await supabase
    .from("companies")
    .select("id, name")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (anyCompany) {
    const { error: joinError } = await supabase.from("company_users").insert({
      company_id: anyCompany.id,
      user_id: user.id,
      role: "editor",
      email: user.email,
    });
    if (joinError) return null;
    return { id: anyCompany.id, name: anyCompany.name, role: "editor" };
  }

  const { data: newCompany, error: companyError } = await supabase
    .from("companies")
    .insert({ name: DEFAULT_COMPANY_NAME })
    .select("id, name")
    .single();

  if (companyError || !newCompany) return null;

  const { error: memberError } = await supabase.from("company_users").insert({
    company_id: newCompany.id,
    user_id: user.id,
    role: "admin",
    email: user.email,
  });

  if (memberError) return null;

  return { id: newCompany.id, name: newCompany.name, role: "admin" };
}
