import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Mantiene la sessione Supabase aggiornata su ogni richiesta e protegge le
// pagine dell'app: senza login si viene rimandati a /login.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  // Il vero check di sicurezza è supabase.auth.getUser() qui sotto: verifica
  // il token con un giro di rete a Supabase, prima ancora che Next.js inizi
  // a renderizzare qualunque pagina. Prima di questa modifica, il layout
  // dell'area privata rifaceva DA CAPO lo stesso identico giro di rete
  // (un'altra chiamata a getUser()) per sapere chi fosse l'utente — quindi
  // ogni click su un link della sidebar costava due verifiche di rete in
  // sequenza invece di una sola, prima ancora di arrivare alla query dati
  // vera e propria della pagina. Passiamo qui il risultato già verificato
  // al resto della richiesta tramite header interni: il layout/le pagine
  // leggono questi header invece di richiamare Supabase una seconda volta.
  // Impostati SEMPRE da qui (mai dal client): un valore inviato dal
  // browser con lo stesso nome viene sovrascritto incondizionatamente.

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Ricostruire la response con i nuovi header sulla request scarterebbe
    // eventuali cookie di refresh sessione già scritti sopra da setAll (la
    // response verrebbe rimpiazzata da zero): li salviamo prima e li
    // riapplichiamo alla nuova response, così il refresh del token continua
    // a funzionare esattamente come prima.
    const pendingCookies = response.cookies.getAll();
    request.headers.set("x-user-id", user.id);
    request.headers.set("x-user-email", user.email ?? "");
    response = NextResponse.next({ request });
    pendingCookies.forEach((c) => response.cookies.set(c));
  }

  const isPublicRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/auth");

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
