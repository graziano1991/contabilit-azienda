import Link from "next/link";
import { Compass } from "lucide-react";
import { primaryButtonClass } from "@/lib/ui";

// Pagina 404 con lo stesso stile del resto dell'app, invece della pagina di
// errore generica di Next.js: coerenza visiva anche quando qualcosa non c'è.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-premium-gradient text-white shadow-glow-lg">
        <Compass className="h-6 w-6" />
      </div>
      <h1 className="text-lg font-semibold text-neutral-900">
        Pagina non trovata
      </h1>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        L&apos;indirizzo che hai aperto non esiste o è stato spostato.
      </p>
      <Link href="/dashboard" className={`${primaryButtonClass} mt-5`}>
        Torna alla dashboard
      </Link>
    </div>
  );
}
