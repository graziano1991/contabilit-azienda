import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAuthUser } from "@/lib/supabase/server";
import type { CurrentCompany } from "./company";

/**
 * App privata mono-azienda multi-utente: chi si registra viene collegato
 * automaticamente all'unica azienda condivisa tramite la funzione database
 * `join_default_company` (gira con privilegi elevati per bypassare in modo
 * controllato le policy RLS che altrimenti impedirebbero a un utente nuovo
 * di leggere o creare la propria azienda). Restituisce anche lo stato della
 * verifica di sicurezza (security_verified), controllato lato server dal
 * layout prima di mostrare qualunque pagina dell'app.
 *
 * Avvolta in `cache()`: viene chiamata dal layout e (tramite
 * getCurrentCompany, che ora delega qui) da ogni singola pagina. Senza
 * memoizzazione questo significava una query extra al database a ogni
 * navigazione, per rileggere dati già noti nello stesso ciclo di richiesta.
 */
async function ensureCompanyForUserImpl(
  supabase: SupabaseClient
): Promise<CurrentCompany | null> {
  const user = await getAuthUser();

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

export const ensureCompanyForUser = cache(ensureCompanyForUserImpl);
