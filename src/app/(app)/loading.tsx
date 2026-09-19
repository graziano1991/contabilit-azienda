// Mostrato automaticamente da Next.js mentre i dati server di una pagina
// stanno caricando (navigazione tra sezioni, refresh dopo un'azione). Senza
// questo file lo schermo resta bianco/fermo durante il fetch, che su
// connessioni lente si percepisce come un'app bloccata o rotta. Il riflesso
// che scorre (skeleton-shimmer, definito in globals.css) comunica "sta
// arrivando qualcosa" in modo più curato del semplice pulse piatto.
export default function AppLoading() {
  return (
    <div>
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-7 w-1.5 rounded-full bg-neutral-200" />
            <div className="skeleton-shimmer h-6 w-44 rounded-lg" />
          </div>
          <div className="skeleton-shimmer mt-2 ml-4 h-3 w-64 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-shimmer h-24 rounded-2xl border border-neutral-200/80"
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-shimmer h-32 rounded-2xl border border-neutral-200/80"
          />
        ))}
      </div>
    </div>
  );
}
