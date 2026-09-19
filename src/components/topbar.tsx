"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
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

export function Topbar({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600" />
      <h1 className="text-lg font-semibold text-neutral-900">
        {sectionTitle(pathname)}
      </h1>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-neutral-500 sm:inline">{userEmail}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition-all duration-150 hover:border-red-200 hover:bg-red-50 hover:text-cost active:scale-95"
        >
          <LogOut className="h-3.5 w-3.5" />
          Esci
        </button>
      </div>
    </header>
  );
}
