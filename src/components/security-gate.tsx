"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import clsx from "clsx";
import { verifySecurityPassword } from "@/lib/actions/security-gate";
import { labelClass, primaryButtonClass } from "@/lib/ui";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-900 px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(94,224,166,0.35), transparent 40%), radial-gradient(circle at 85% 15%, rgba(23,175,156,0.30), transparent 45%), radial-gradient(circle at 50% 100%, rgba(47,85,150,0.55), transparent 55%), linear-gradient(160deg, #0b1a37 0%, #11254d 45%, #173263 100%)",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-700 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-semibold text-neutral-900">
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
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-10 text-sm shadow-sm transition-all focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 hover:border-neutral-400"
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
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-cost">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx(primaryButtonClass, "w-full")}
          >
            {loading ? "Verifica…" : "Sblocca"}
          </button>
        </form>
      </div>
    </div>
  );
}
