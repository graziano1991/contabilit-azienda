"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
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
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-neutral-500 sm:inline">
          {userEmail}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-neutral-600 transition-all duration-150 ease-snappy hover:-translate-y-px hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-cost active:translate-y-0 active:scale-95 sm:px-3"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Esci</span>
        </button>
      </div>
    </header>
  );
}
