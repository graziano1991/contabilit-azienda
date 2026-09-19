import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureCompanyForUser } from "./ensure-company";

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
 *
 * Delega a `ensureCompanyForUser`, che è memoizzata per richiesta
 * (`cache()`): il layout la chiama già una volta per verificare l'accesso,
 * quindi ogni pagina che chiama `getCurrentCompany` nello stesso ciclo di
 * richiesta riceve il risultato già pronto invece di rifare da zero la
 * stessa query. Prima di questa modifica ogni pagina eseguiva una query
 * `company_users` propria, indipendente da quella già fatta dal layout:
 * stesso identico dato, richiesto due volte a ogni navigazione.
 */
export async function getCurrentCompany(
  supabase: SupabaseClient
): Promise<CurrentCompany | null> {
  return ensureCompanyForUser(supabase);
}
