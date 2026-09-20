"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";

const SECTION_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  immobili: "Immobili",
  compravendite: "Compravendite",
  contabilita: "Contabilità",
  report: "Report",
  documenti: "Documenti",
  impostazioni: "Impostazioni",
};

function sectionTitle(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  return SECTION_LABELS[segment] ?? "FinanzaCore";
}

// Iniziali da mostrare nell'avatar: prime due lettere della parte prima
// della @, o "?" se per qualche motivo l'email è vuota.
function initialsFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[^a-zA-Z0-9]/g, "");
  return cleaned.slice(0, 2).toUpperCase() || "?";
}

export function Topbar({
  userEmail,
  onMenuClick,
}: {
  userEmail: string;
  onMenuClick?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="glass-surface relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:h-16 sm:px-6">
      <span className="absolute inset-x-0 bottom-0 h-px bg-premium-gradient opacity-70" />
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Apri menu"
          className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-white/10 active:scale-95 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-base font-semibold text-neutral-900 sm:text-lg">
          {sectionTitle(pathname)}
        </h1>
      </div>

      {/* Account: avatar con iniziali invece del chip con l'email per
          intero — meno testo fisso in vista, coerente con un header da
          app di prodotto. Il menu a tendina mostra l'email completa e il
          logout, aperto/chiuso da uno scrim invisibile (stesso pattern
          già usato per il cassetto mobile della sidebar). */}
      <div className="relative flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu account"
          aria-expanded={menuOpen}
          className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-full bg-premium-gradient text-xs font-semibold text-white shadow-glow ring-1 ring-inset ring-white/15 transition-transform duration-150 ease-snappy hover:-translate-y-px active:translate-y-0 active:scale-95 sm:h-10 sm:w-10 sm:text-sm"
          )}
        >
          {initialsFromEmail(userEmail)}
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              aria-hidden="true"
              onClick={() => setMenuOpen(false)}
            />
            <div className="glass-panel absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-2xl p-1.5 shadow-card animate-fade-in-up">
              <div className="px-3 py-2.5">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {userEmail}
                </p>
                <p className="text-xs text-neutral-500">Account collegato</p>
              </div>
              <div className="my-1 h-px bg-white/10" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-cost transition-colors duration-150 hover:bg-rose-500/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Esci
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
