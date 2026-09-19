"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

// Contenitore client che tiene lo stato "menu mobile aperto/chiuso" e lo
// condivide tra Topbar (bottone hamburger) e Sidebar (pannello a scomparsa +
// sfondo cliccabile). Sotto ~768px la sidebar non è più sempre visibile:
// diventa un cassetto che scorre da sinistra sopra il contenuto.
export function AppShell({
  companyName,
  userEmail,
  children,
}: {
  companyName: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Cambio pagina: chiude sempre il cassetto, anche se l'utente ha navigato
  // in un altro modo (indietro/avanti del browser) oltre al click su un link.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Blocca lo scroll del contenuto sottostante mentre il cassetto è aperto,
  // per evitare lo sgradevole doppio-scroll su mobile.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-accent-50/40">
      <Sidebar
        companyName={companyName}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userEmail={userEmail} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
