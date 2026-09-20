import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

/**
 * Client Supabase da usare nei Server Component / route handler.
 * Gestisce i cookie di sessione per mantenere l'utente autenticato.
 *
 * Avvolto in `cache()` di React: dentro la stessa richiesta (es. layout +
 * pagina + eventuali componenti annidati), tutte le chiamate a createClient()
 * restituiscono la STESSA istanza invece di ricrearne una ogni volta. Questo
 * è anche ciò che rende efficace la cache di getAuthUser() qui sotto: due
 * chiamate con lo stesso client (stesso riferimento) vengono deduplicate.
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chiamato da un Server Component: ignorabile se c'è un middleware
            // che aggiorna la sessione.
          }
        },
      },
    }
  );
});

/**
 * Utente autenticato, memoizzato per singola richiesta. Prima di questa
 * ottimizzazione ogni pagina (layout + pagina + eventuali server action)
 * chiamava `supabase.auth.getUser()` per conto proprio: ogni chiamata è un
 * round-trip di rete verso Supabase, quindi su una singola navigazione
 * capitava di rifare la stessa identica verifica 2-3 volte in sequenza
 * prima di poter renderizzare qualcosa. Con `cache()` la prima chiamata
 * nella richiesta esegue la verifica, tutte le successive leggono il
 * risultato già pronto, a costo zero.
 */
export const getAuthUser = cache(async () => {
  // Il middleware ha già verificato l'utente con un giro di rete a Supabase
  // e ci passa il risultato tramite header interni: se sono presenti, li
  // usiamo direttamente invece di rifare la stessa identica verifica qui
  // (che sarebbe un secondo giro di rete per la stessa identica richiesta).
  const headerList = await headers();
  const headerUserId = headerList.get("x-user-id");
  const headerUserEmail = headerList.get("x-user-email");

  if (headerUserId) {
    return { id: headerUserId, email: headerUserEmail || null } as {
      id: string;
      email: string | null;
    };
  }

  // Fallback: nessun header (es. route non coperta dal matcher del
  // middleware, oppure chiamata da un contesto senza middleware davanti).
  // Rifacciamo la verifica reale, come prima di questa ottimizzazione.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
