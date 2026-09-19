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
    <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:h-16 sm:px-6">
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600" />
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Apri menu"
          className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 active:scale-95 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-base font-semibold text-neutral-900 sm:text-lg">
          {sectionTitle(pathname)}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <span className="hidden text-sm text-neutral-500 sm:inline">{userEmail}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-600 transition-all duration-150 hover:border-red-200 hover:bg-red-50 hover:text-cost active:scale-95 sm:px-3"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Esci</span>
        </button>
      </div>
    </header>
  );
}
