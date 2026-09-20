"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import clsx from "clsx";
import { verifySecurityPassword } from "@/lib/actions/security-gate";
import { labelClass, primaryButtonClass } from "@/lib/ui";
import { Spinner } from "@/components/ui/spinner";

// Schermata a blocco totale: nessun modo di chiuderla o saltarla, nessun
// link verso altre sezioni. Resta l'unica cosa renderizzata finché il
// server non conferma che la password di sicurezza è corretta.
export function SecurityGate() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await verifySecurityPassword(code);

    setLoading(false);

    if (!result.ok) {
      setError("Password di sicurezza errata. Riprova.");
      setCode("");
      return;
    }

    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="bg-grid-dots pointer-events-none absolute inset-0 opacity-40" />

      <div className="gradient-border relative w-full max-w-sm animate-scale-in rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-premium-gradient text-white shadow-glow-lg animate-glow-pulse">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Verifica di sicurezza
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Inserisci la password di sicurezza per accedere a FinanzaCore.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Password di sicurezza</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 pr-10 text-sm text-neutral-900 shadow-inner-glow backdrop-blur-sm transition-all duration-150 ease-snappy focus:border-accent-500/60 focus:outline-none focus:ring-4 focus:ring-accent-500/20 hover:border-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 transition-colors hover:text-accent-600"
                aria-label={showPassword ? "Nascondi password" : "Mostra password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-cost">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx(primaryButtonClass, "w-full")}
          >
            {loading && <Spinner />}
            {loading ? "Verifica…" : "Sblocca"}
          </button>
        </form>
      </div>
    </div>
  );
}
