"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sessione non valida, effettua di nuovo l'accesso.");
      setLoading(false);
      return;
    }

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({ name, vat_number: vatNumber || null })
      .select("id")
      .single();

    if (companyError || !company) {
      setError(companyError?.message ?? "Errore nella creazione dell'azienda.");
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase.from("company_users").insert({
      company_id: company.id,
      user_id: user.id,
      role: "admin",
    });

    setLoading(false);

    if (memberError) {
      setError(memberError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-card">
        <h1 className="text-lg font-semibold text-neutral-900">
          Crea la tua azienda
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Prima di iniziare, indica il nome dell&apos;azienda che gestirai in
          FinanzaCore.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Nome azienda
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. ABC SRL"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Partita IVA <span className="text-neutral-400">(opzionale)</span>
            </label>
            <input
              type="text"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-cost">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Creazione…" : "Continua"}
          </button>
        </form>
      </div>
    </div>
  );
}
