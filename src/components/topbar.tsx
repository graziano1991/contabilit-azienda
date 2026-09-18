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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-neutral-900">
        {sectionTitle(pathname)}
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-500">{userEmail}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          Esci
        </button>
      </div>
    </header>
  );
}
