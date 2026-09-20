"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { primaryButtonClass } from "@/lib/ui";

// Rete della sicurezza per ogni pagina sotto l'area privata: se una pagina
// lancia un errore mentre renderizza (dato mancante, query fallita, bug),
// l'utente vede questo invece di uno schermo bianco o dello stack trace di
// Next.js, e può riprovare senza dover ricaricare tutta l'app.
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center backdrop-blur-sm">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/15 text-cost shadow-glow-rose">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-neutral-700">
        Qualcosa è andato storto
      </p>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        Non siamo riusciti a caricare questa pagina. Riprova: se il problema
        continua, contatta l&apos;amministratore.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className={`${primaryButtonClass} mt-4`}
      >
        <RotateCw className="h-4 w-4" />
        Riprova
      </button>
    </div>
  );
}
