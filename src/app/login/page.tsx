"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass, primaryButtonClass } from "@/lib/ui";
import { Spinner } from "@/components/ui/spinner";
import clsx from "clsx";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // La registrazione è andata a buon fine ma Supabase non ha creato una
    // sessione attiva: significa che sul progetto è ancora attiva la
    // conferma email. Meglio dirlo chiaramente che restare muti.
    if (mode === "signup" && !data.session) {
      setError(
        "Account creato, ma per accedere serve confermare l'email che ti è appena arrivata (oppure disattivare la conferma email su Supabase)."
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    // Niente più sfondo dipinto a mano qui: l'aurora animata viene da
    // body::before (globals.css) ed è la stessa su tutta l'app — solo la
    // trama a puntini resta locale, per texture sopra l'aurora.
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="bg-grid-dots pointer-events-none absolute inset-0 opacity-40" />

      <div className="gradient-border relative w-full max-w-sm animate-scale-in rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 rounded-2xl shadow-glow-lg">
            <Image
              src="/logo.png"
              alt="FinanzaCore"
              width={56}
              height={56}
              className="h-14 w-14 rounded-2xl"
              priority
            />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            FinanzaCore
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Centro di controllo finanziario e operativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-cost">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx(primaryButtonClass, "w-full")}
          >
            {loading && <Spinner />}
            {loading ? "Attendere…" : mode === "login" ? "Accedi" : "Crea account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-center text-sm text-neutral-500 transition-colors hover:text-accent-700"
        >
          {mode === "login"
            ? "Non hai un account? Registrati"
            : "Hai già un account? Accedi"}
        </button>
      </div>
    </div>
  );
}
