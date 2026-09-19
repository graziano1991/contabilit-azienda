// Mostrato automaticamente da Next.js mentre i dati server di una pagina
// stanno caricando (navigazione tra sezioni, refresh dopo un'azione). Senza
// questo file lo schermo resta bianco/fermo durante il fetch, che su
// connessioni lente si percepisce come un'app bloccata o rotta.
export default function AppLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-1.5 rounded-full bg-neutral-200" />
            <div className="h-5 w-40 rounded bg-neutral-200" />
          </div>
          <div className="mt-2 h-3 w-60 rounded bg-neutral-100" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl border border-neutral-200 bg-white shadow-card"
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-neutral-200 bg-white shadow-card"
          />
        ))}
      </div>
    </div>
  );
}
